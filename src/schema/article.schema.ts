import { z } from "zod";

export enum Status {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export const articleSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(3, "Title must be at least 3 characters long")
    .max(150, "Title cannot exceed 150 characters"),

  slug: z
    .string({ message: "Slug is required" })
    .min(3, "Slug must be at least 3 characters long")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase and hyphen-separated (e.g., my-first-article)",
    ),

  coverImage: z
    .string({ message: "Cover image is required" })
    .url("Cover image must be a valid URL"),

  techStack: z
    .array(z.string().min(1, "Tech stack item cannot be empty"))
    .min(1, "Select at least one technology stack"),

  category: z.string().optional(),

  excerpt: z
    .string()
    .max(300, "Excerpt cannot exceed 300 characters")
    .optional(),

  content: z
    .string({ message: "Content is required" })
    .min(10, "Content must be at least 10 characters long"),

  status: z.nativeEnum(Status).optional().default(Status.DRAFT),

  featured: z.boolean().optional().default(false),

  authorId: z
    .string({ message: "Author ID is required" })
    .min(1, "Author ID cannot be empty"),

  projectId: z.string().optional(),

  publishedAt: z
    .union([z.date(), z.string().datetime()])
    .pipe(z.coerce.date())
    .optional(),
});

export const idSchema = z.object({
  id: z.string().uuid({ message: "ID must be a valid UUID" }),
});
export const slugSchema = z.object({
  slug: z.string().min(1, { message: "Slug is required" }),
});

export const createArticleSchema = z.object({
  body: articleSchema.omit({ slug: true }),
})
export const updateArticleSchema = z.object({
  body: articleSchema.partial().omit({ slug: true }),
})
export const getArticleSchema = z.object({
  params: idSchema,
})
export const getArticleSchemaBySlug = z.object({
  params: slugSchema,
})