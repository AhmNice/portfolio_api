import { CreateUserDTO, LoginDTO, UserDTO } from "@/interface/user.dto.js";
import { IAuthRepository } from "./auth.repo.js";
import { ApiError } from "@/util/errorHandler.js";
import bcrypt from "bcrypt";
import { Response, Request } from "express";
import { ISessionService } from "@/util/Session.js";
import crypto from "crypto";
import { ICacheRepository } from "@/redis/index.js";
export interface IAuthService {
  createUser(user: CreateUserDTO): Promise<any>;
  login(data: LoginDTO): Promise<UserDTO>;
  findUserByEmail(email: string): Promise<UserDTO | null>;
  logout(res: Response, req: Request): Promise<void>;
  requestRecovery(secrete: string): Promise<{ recoveryToken: string }>;
  recoverAccount(recoveryToken: string, newPassword: string): Promise<void>;
}
const DUMMY_HASH =
  "$2b$10$e8N8gQ5J3uB9q2P.yKkZe.0v7M1H/7K0eD0Yh4L0V5N7m9/8A1K2O";
const USER_UUID = "00000000-0000-0000-0000-000000000001";
export class AuthService implements IAuthService {
  constructor(
    private authRepository: IAuthRepository,
    private sessionService: ISessionService,
    private cacheRepository: ICacheRepository,
  ) {}
  async createUser(user: CreateUserDTO): Promise<any> {
    const existingUser = await this.authRepository.findUserByEmail(user.email);
    if (existingUser) {
      return new ApiError(400, "Email already exists");
    }

    const passwordHash = await bcrypt.hash(user.password, 10);
    const newUser = await this.authRepository.createUser({
      ...user,
      password: passwordHash,
    });
    return newUser;
  }
  async login(data: LoginDTO): Promise<UserDTO> {
    const user = await this.authRepository.findUserByEmail(data.email);
    if (!user) {
      throw new ApiError(400, "Invalid email or password");
    }
    const isPassword = bcrypt.compare(data.password, user.password);
    if (!isPassword) {
      throw new ApiError(400, "Invalid email or password");
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
  async findUserByEmail(email: string): Promise<UserDTO | null> {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
  async logout(res: Response, req: Request): Promise<void> {
    if (!req.user) {
      throw new ApiError(401, "No active session found");
    }

    const { userId, sessionId } = req.user;
    if (!sessionId) {
      throw new ApiError(400, "Session ID missing from token status");
    }

    await this.sessionService.clearSession(res, userId, sessionId);
  }
  async requestRecovery(secretKey: string): Promise<{ recoveryToken: string }> {
    const savedKey = await this.authRepository.getSecretKey();
    if (!savedKey || !savedKey.secretKeyHash) {
      throw new ApiError(500, "Secret key not found in the database");
    }
    const targetHash = savedKey?.secretKeyHash || DUMMY_HASH;
    const isKeyValid = await bcrypt.compare(secretKey, targetHash);
console.log(isKeyValid)
    if (!savedKey || !savedKey.secretKeyHash || !isKeyValid) {
      throw new ApiError(400, "Invalid secret key");
    }

    const recoveryToken = crypto.randomBytes(32).toString("hex");

    const recoveryTokenHash = crypto
      .createHash("sha256")
      .update(recoveryToken)
      .digest("hex");

    const recoveryTokenTTL = 300; // 5 minutes

    try {
      await this.cacheRepository.saveRecoveryToken(recoveryTokenHash);
    } catch (error) {
      throw new ApiError(
        500,
        "Cache storage error: Unable to issue recovery token",
      );
    }

    return { recoveryToken };
  }
  async recoverAccount(
    recoveryToken: string,
    newPassword: string,
  ): Promise<void> {
    const recoveryTokenHash = crypto
      .createHash("sha256")
      .update(recoveryToken)
      .digest("hex");

    const savedToken =
      await this.cacheRepository.getRecoveryToken(recoveryTokenHash);
    if (!savedToken) {
      throw new ApiError(400, "Invalid or expired recovery token");
    }

    try {
      const passwordHash = await bcrypt.hash(newPassword, 10);

      await this.authRepository.updateUser(USER_UUID, {
        password: passwordHash,
      });
    } catch (error) {
      throw new ApiError(500, "Failed to update account password");
    }

    // 4. Invalidate token immediately to prevent replay attacks
    await this.cacheRepository.deleteRecoveryToken(recoveryTokenHash);
  }
}
