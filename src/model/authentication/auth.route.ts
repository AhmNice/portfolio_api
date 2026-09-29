import express from "express";
import { AuthController } from "./auth.controller.js";
import { protect, sessionService } from "@/middleware/authentication.js";
import { AuthService } from "./auth.service.js";
import { AuthRepository } from "./auth.repo.js";
import { CacheRepository } from "@/redis/index.js";
import { validate } from "@/middleware/validation.js";
import { loginRequestSchema } from "@/schema/auth.schema.js";

const authRepository = new AuthRepository();
const cacheRepository = new CacheRepository();
const authService = new AuthService(
  authRepository,
  sessionService,
  cacheRepository,
);
const authController = new AuthController(authService, sessionService);
const authRouter = express.Router();
authRouter.post("/login", validate(loginRequestSchema), authController.login);
authRouter.post("/request-recovery", authController.requestRecovery);
authRouter.post("/change-password", authController.recoverAccount);
authRouter.use(protect);
authRouter.get("/me",  authController.getAuthenticatedUser);
authRouter.post("/logout",  authController.logout);
export default authRouter;
