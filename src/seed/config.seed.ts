import config from "@/config/config.js";
import { AuthRepository } from "@/model/authentication/auth.repo.js";
import bcrypt from "bcrypt";
const secret = config.SERVER_SECRET || "default_secret_key";

export const configSeed = async () => {
  const authRepository = new AuthRepository();

  try {
    const existingSecret = await authRepository.getSecretKey?.();
    if (existingSecret) {
      console.log("Config seed: Secret key already exists, skipping initialization.");
      return;
    }
    const hashedSecret = await bcrypt.hash(secret, 10);
    await authRepository.createSecretKey(hashedSecret);
    console.log("Config seed: Secret key successfully initialized.");
  } catch (error) {
    console.error("Config seed failed:", error);
    throw error;
  }
};

configSeed()