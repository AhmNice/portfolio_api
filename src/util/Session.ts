import { NextFunction, Request, Response } from "express";
import {
  jwtSignReturnType,
  SessionPayload,
} from "@/interface/session.interface.js";
import crypto from "crypto";
import config from "@/config/config.js";
import jwt from "jsonwebtoken";
import { ApiError } from "./errorHandler.js";
import { ITokenRepository } from "@/model/token/sessionToken.js";
import { TokenService } from "@/model/token/token.service.js";

declare module "express-serve-static-core" {
  interface Request {
    user?: SessionPayload & { sessionId: string };
  }
}

export interface ISessionService {
  signTo(
    res: Response,
    payload: SessionPayload,
  ): Promise<jwtSignReturnType>;

  verifySession(
    res: Response,
    req: Request,
    next: NextFunction,
  ): Promise<void>;

  autoRefreshSession(
    res: Response,
    req: Request,
    next: NextFunction,
  ): Promise<void>;

  refreshSession(
    res: Response,
    req: Request,
    next: NextFunction,
  ): Promise<jwtSignReturnType>;

  clearSession(
    res: Response,
    userId: string,
    sessionId: string,
  ): Promise<void>;
}

export class SessionService implements ISessionService {
  private readonly ACCESS_COOKIE_NAME =
    config.GHOST_PORTFOLIO_CMS_ACCESS_TOKEN_NAME;

  private readonly REFRESH_COOKIE_NAME =
    config.GHOST_PORTFOLIO_CMS_REFRESH_TOKEN_NAME;

  constructor(
    private readonly tokenService: TokenService,
    private readonly tokenRepository: ITokenRepository,
  ) {}

  /**
   * Attach access and refresh tokens to cookies.
   */
  private setSessionCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    const cookieOptions = {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
    };

    res.cookie(this.ACCESS_COOKIE_NAME, accessToken, cookieOptions);
    res.cookie(this.REFRESH_COOKIE_NAME, refreshToken, cookieOptions);
  }

  /**
   * Create a new access/refresh token pair.
   */
  private createTokenPair(
    payload: SessionPayload,
    sessionId: string,
  ): jwtSignReturnType {
    const accessTokenExpiresIn =
      config.GHOST_PORTFOLIO_CMS_ACCESS_TOKEN_EXPIRES as jwt.SignOptions["expiresIn"];

    const refreshTokenExpiresIn =
      config.GHOST_PORTFOLIO_CMS_REFRESH_TOKEN_EXPIRES as jwt.SignOptions["expiresIn"];

    /**
     * Only include values that belong inside the JWT.
     * This prevents accidental propagation of unwanted properties.
     */
    const cleanPayload: SessionPayload = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    const payloadWithSessionId = {
      ...cleanPayload,
      sessionId,
    };

    const accessToken = jwt.sign(
      payloadWithSessionId,
      config.JWT_SECRET,
      {
        expiresIn: accessTokenExpiresIn,
      },
    );

    const refreshToken = jwt.sign(
      payloadWithSessionId,
      config.JWT_SECRET,
      {
        expiresIn: refreshTokenExpiresIn,
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Create a completely new session.
   *
   * Used during login.
   */
  async signTo(
    res: Response,
    payload: SessionPayload,
  ): Promise<jwtSignReturnType> {
    const sessionId = crypto.randomUUID();

    const { accessToken, refreshToken } = this.createTokenPair(
      payload,
      sessionId,
    );

    await this.tokenRepository.saveSession(
      payload.userId,
      sessionId,
    );

    this.setSessionCookies(
      res,
      accessToken,
      refreshToken,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Rotate an existing refresh session.
   *
   * The old session is replaced with a new session ID.
   *
   * IMPORTANT:
   * This method does NOT call signTo(), because signTo()
   * creates a completely new session.
   */
  private async rotateRefreshSession(
    userId: string,
    oldSessionId: string,
    payload: SessionPayload,
  ): Promise<jwtSignReturnType & { sessionId: string }> {
    const newSessionId = crypto.randomUUID();

    const { accessToken, refreshToken } =
      this.createTokenPair(
        payload,
        newSessionId,
      );

    /**
     * Atomically replace the old session with the new one.
     *
     * This is important for refresh-token rotation.
     */
    const rotated =
      await this.tokenService.rotateSessionAtomically(
        userId,
        oldSessionId,
        newSessionId,
      );

    if (!rotated) {
      throw new ApiError(
        401,
        "Session has already been used or revoked.",
      );
    }

    return {
      accessToken,
      refreshToken,
      sessionId: newSessionId,
    };
  }

  /**
   * Verify the current access token.
   *
   * If the access token is expired but a valid refresh token
   * exists, automatically rotate the session.
   */
  async verifySession(
    res: Response,
    req: Request,
    next: NextFunction,
  ): Promise<void> {
    const accessToken =
      req.cookies[this.ACCESS_COOKIE_NAME];

    const refreshToken =
      req.cookies[this.REFRESH_COOKIE_NAME];

    if (!accessToken && !refreshToken) {
      return next(
        new ApiError(
          401,
          "No session found. Please log in.",
        ),
      );
    }

    /**
     * No access token but refresh token exists.
     * Try to create a fresh session.
     */
    if (!accessToken && refreshToken) {
      return this.autoRefreshSession(
        res,
        req,
        next,
      );
    }

    try {
      const decoded = jwt.verify(
        accessToken!,
        config.JWT_SECRET,
      ) as SessionPayload & {
        sessionId: string;
      };

      const isActive =
        await this.tokenService.isActiveToken(
          decoded.userId,
          decoded.sessionId,
        );

      if (!isActive) {
        await this.clearSession(
          res,
          decoded.userId,
          decoded.sessionId,
        );

        return next(
          new ApiError(
            401,
            "Unauthorized: Invalid or revoked session.",
          ),
        );
      }

      req.user = decoded;

      return next();
    } catch (error: unknown) {
      /**
       * Access token expired.
       *
       * If refresh token exists, rotate the session.
       */
      if (
        error instanceof jwt.TokenExpiredError &&
        refreshToken
      ) {
        return this.autoRefreshSession(
          res,
          req,
          next,
        );
      }

      return next(
        new ApiError(
          401,
          "Unauthorized: Invalid or expired access token.",
        ),
      );
    }
  }

  /**
   * Automatically refresh an expired access token.
   *
   * This is used internally by verifySession().
   */
  async autoRefreshSession(
    res: Response,
    req: Request,
    next: NextFunction,
  ): Promise<void> {
    const refreshToken =
      req.cookies[this.REFRESH_COOKIE_NAME];

    if (!refreshToken) {
      return next(
        new ApiError(
          401,
          "Unauthorized: Session credentials missing.",
        ),
      );
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        config.JWT_SECRET,
      ) as SessionPayload & {
        sessionId: string;
      };

      /**
       * Make sure the session still exists and has not
       * already been rotated/revoked.
       */
      const isActive =
        await this.tokenService.isActiveToken(
          decoded.userId,
          decoded.sessionId,
        );

      if (!isActive) {
        await this.clearSession(
          res,
          decoded.userId,
          decoded.sessionId,
        );

        return next(
          new ApiError(
            401,
            "Unauthorized: Invalid or revoked refresh session.",
          ),
        );
      }

      /**
       * Rotate the existing session.
       */
      const {
        accessToken,
        refreshToken: newRefreshToken,
      } = await this.rotateRefreshSession(
        decoded.userId,
        decoded.sessionId,
        decoded,
      );

      /**
       * Replace both cookies with the newly generated pair.
       */
      this.setSessionCookies(
        res,
        accessToken,
        newRefreshToken,
      );

      /**
       * Attach the newly issued access-token payload
       * to the request so downstream controllers can use it.
       */
      req.user = jwt.verify(
        accessToken,
        config.JWT_SECRET,
      ) as SessionPayload & {
        sessionId: string;
      };

      return next();
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        return next(error);
      }

      return next(
        new ApiError(
          401,
          "Unauthorized: Invalid or expired refresh token.",
        ),
      );
    }
  }

  /**
   * Manual refresh endpoint.
   *
   * This endpoint rotates the current refresh session
   * and returns the new token pair.
   */
  async refreshSession(
    res: Response,
    req: Request,
    _next: NextFunction,
  ): Promise<jwtSignReturnType> {
    const refreshToken =
      req.cookies[this.REFRESH_COOKIE_NAME];

    if (!refreshToken) {
      throw new ApiError(
        401,
        "No refresh token found. Please log in.",
      );
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        config.JWT_SECRET,
      ) as SessionPayload & {
        sessionId: string;
      };

      const isActive =
        await this.tokenService.isActiveToken(
          decoded.userId,
          decoded.sessionId,
        );

      if (!isActive) {
        await this.clearSession(
          res,
          decoded.userId,
          decoded.sessionId,
        );

        throw new ApiError(
          401,
          "Unauthorized: Invalid or revoked refresh session.",
        );
      }

      /**
       * Rotate the existing session.
       */
      const {
        accessToken,
        refreshToken: newRefreshToken,
      } = await this.rotateRefreshSession(
        decoded.userId,
        decoded.sessionId,
        decoded,
      );

      /**
       * Replace cookies with the new token pair.
       */
      this.setSessionCookies(
        res,
        accessToken,
        newRefreshToken,
      );

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        401,
        "Unauthorized: Invalid or expired refresh token.",
      );
    }
  }

  /**
   * Invalidate a session and remove authentication cookies.
   */
  async clearSession(
    res: Response,
    userId: string,
    sessionId: string,
  ): Promise<void> {
    try {
      await this.tokenService.invalidateToken(
        userId,
        sessionId,
      );
    } catch (error: unknown) {
      /**
       * Cookie cleanup should still happen even if
       * database invalidation fails.
       */
      console.error(
        "Error occurred while clearing session:",
        error,
      );
    }

    const clearOptions = {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
    };

    res.clearCookie(
      this.ACCESS_COOKIE_NAME,
      clearOptions,
    );

    res.clearCookie(
      this.REFRESH_COOKIE_NAME,
      clearOptions,
    );
  }
}