import { TokenRepository } from "@/model/token/sessionToken.js";
import { TokenService } from "@/model/token/token.service.js";
import { SessionService } from "@/util/Session.js";
import { Request, Response, NextFunction } from "express";
const tokenRepository = new TokenRepository();
const tokenService = new TokenService(tokenRepository);
const sessionService = new SessionService(tokenService, tokenRepository);
 const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await sessionService.verifySession(res, req, next);
  } catch (error) {
    next(error);
  }
};
export {protect, sessionService, tokenService,};