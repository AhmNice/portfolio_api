import { z} from "zod"
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
})
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
})

export const createUserRequestSchema = z.object({
  body: createUserSchema,
})

export const updateUserRequestSchema = z.object({
  body: updateUserSchema,
})

export const loginRequestSchema = z.object({
  body: loginSchema,
})