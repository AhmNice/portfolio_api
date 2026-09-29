import { LoginDTO } from "@/interface/user.dto.js";
import { IAuthService } from "./auth.service.js";
import { asyncHandler } from "@/lib/asyncHandler.js";
import { Request, Response } from "express";
import { ISessionService } from "@/util/Session.js";
import { ApiResponse } from "@/util/api.js";

export class AuthController {
  constructor(
    private authService: IAuthService,
    private sessionService: ISessionService,
  ) {}
  readonly login = asyncHandler(async (req: Request, res: Response) => {
    const data: LoginDTO = req.body;
    const result = await this.authService.login(data);
    const { accessToken, refreshToken } = await this.sessionService.signTo(
      res,
      { userId: result.id, email: result.email, role: "ADMIN" },
    );
    // const response = {
    //   user: { ...result },
    //   accessToken,
    //   refreshToken,
    // };
    return res
      .status(200)
      .json(new ApiResponse(200, "User Logged in", result));
  });
  readonly getAuthenticatedUser = asyncHandler(
    async (req: Request, res: Response) => {
      const user = req.user;
      if (!user) {
        return res.status(401).json(new ApiResponse(401, "Unauthorized", null));
      }
      const fullUser = await this.authService.findUserByEmail(
        user.email as string,
      );
      if (!fullUser) {
        return res
          .status(404)
          .json(new ApiResponse(404, "User not found", null));
      }
      return res
        .status(200)
        .json(new ApiResponse(200, "User fetched successfully", fullUser));
    },
  );
  readonly logout = asyncHandler(async (req: Request, res: Response) => {
    await this.authService.logout(res, req);
    return res
      .status(200)
      .json(new ApiResponse(200, "User logged out successfully", null));
  });
  readonly requestRecovery = asyncHandler(
    async (req: Request, res: Response) => {
      const { secretKey } = req.body;
      const result = await this.authService.requestRecovery(secretKey);
      return res
        .status(200)
        .json(new ApiResponse(200, "Recovery token generated", result));
    },
  );
  readonly recoverAccount = asyncHandler(
    async (req: Request, res: Response) => {
      const { recoveryToken, newPassword } = req.body;
      await this.authService.recoverAccount(recoveryToken, newPassword);
      return res
        .status(200)
        .json(new ApiResponse(200, "Account recovered successfully", null));
    },
  )
}
