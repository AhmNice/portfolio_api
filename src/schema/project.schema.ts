import { z } from "zod";

export const linkItemSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(["SOURCE_CODE", "LIVE_DEMO", "DOCUMENTATION", "OTHER"]),
  url: z.string().url({ message: "Must be a valid URL" }),
});
export const projectSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().optional(),
  name: z.string().min(1, { message: "Project name is required" }),
  description: z.string().optional(),
  coverImage: z.string().min(1, { message: "Cover image is required" }),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  techStack: z.array(z.string()).optional(),
  links: z
    .preprocess((val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      }
      return val;
    }, z.array(linkItemSchema))
    .optional(),

  // ownerId: z.string().uuid({ message: "Owner ID must be a valid UUID" }),
});
export const idSchema = z.object({
  id: z.string().uuid({ message: "ID must be a valid UUID" }),
});

export const slugSchema = z.object({
  slug: z.string().min(1, { message: "Slug is required" }),
});

export const getProjectSchema = z.object({
  params: idSchema,
});
export const getProjectBySlugSchema = z.object({
  params: idSchema,
});
export const createProjectSchema = z.object({
  body: projectSchema.omit({ id: true, slug: true }),
});
