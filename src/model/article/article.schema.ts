import zod from "zod";
export const createArticleSchema = zod.object({
  title: zod.string().min(1, "Title is required"),
  slug: zod.string().min(1, "Slug is required"),
  coverImage: zod.string().min(1, "Cover image is required"),
  techStack: zod.array(zod.string()).min(1, "At least one tech stack is required"),
  category: zod.string().optional(),
  excerpt: zod.string().optional(),
  status: zod.enum(["DRAFT", "PUBLISHED"]).optional(),
  featured: zod.boolean().optional(),
  authorId: zod.string().min(1, "Author ID is required"),
  projectId: zod.string().optional(),
  publishedAt: zod.date().optional(),
});