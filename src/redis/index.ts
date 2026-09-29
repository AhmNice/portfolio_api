import { redis } from "@/config/redis.js";

export interface ICacheRepository {
  saveRecoveryToken(recoveryTokenHash: string): Promise<string | null>;
  getRecoveryToken(recoveryTokenHash: string): Promise<string | null>;
  deleteRecoveryToken(recoveryTokenHash: string): Promise<number>;
}

export class CacheRepository implements ICacheRepository {
  async saveRecoveryToken(recoveryTokenHash: string): Promise<string | null> {
    const recoveryTokenTTL = 300; // 5 minutes
    try {
      return await redis.set(
        `recoveryToken:${recoveryTokenHash}`,
        "SYSTEM_ADMIN",
        "EX",
        recoveryTokenTTL,
      );
    } catch (error) {
      console.error("Redis error saving recovery token:", error);
      throw new Error("Failed to store recovery token in cache");
    }
  }

  async getRecoveryToken(recoveryTokenHash: string): Promise<string | null> {
    try {
      return await redis.get(`recoveryToken:${recoveryTokenHash}`);
    } catch (error) {
      console.error("Redis error retrieving recovery token:", error);
      throw new Error("Failed to retrieve recovery token from cache");
    }
  }

  async deleteRecoveryToken(recoveryTokenHash: string): Promise<number> {
    try {
      return await redis.del(`recoveryToken:${recoveryTokenHash}`);
    } catch (error) {
      console.error("Redis error deleting recovery token:", error);
      throw new Error("Failed to delete recovery token from cache");
    }
  }
}