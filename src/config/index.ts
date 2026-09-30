import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string().url(),
  CORS_ORIGIN: z.string().url().optional(),
  CMS_URL: z.string().url().optional(),
  REDIS_URL: z.string().url(),
  PORT: z
    .string()
    .default("3000")
    .transform((val) => Number(val)),
  SERVER_SECRET: z
    .string()
    .min(32, "SERVER_SECRET must be at least 32 characters long"),
  GHOST_PORTFOLIO_CMS_ACCESS_TOKEN_EXPIRES: z.string().default("15m"),
  GHOST_PORTFOLIO_CMS_REFRESH_TOKEN_EXPIRES: z.string().default("7d"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long"),
  PORTFOLIO_CMS_SESSION_NAME: z.string(),
  GHOST_PORTFOLIO_CMS_ACCESS_TOKEN_NAME: z.string().default("ghost_portfolio_cms_access_token"),
  GHOST_PORTFOLIO_CMS_REFRESH_TOKEN_NAME: z.string().default("ghost_portfolio_cms_refresh_token"),
  CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_SECRET_KEY: z.string()
});

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error("Invalid environment variables:", parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
export type Env = typeof env;
