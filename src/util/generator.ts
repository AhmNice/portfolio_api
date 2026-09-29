import { prisma } from "@/lib/prisma.js";
import slugify from "slugify";

type Resource = "PROJECT" | "ARTICLE";

export const generateSlug = async (
  text: string,
  resource: Resource,
): Promise<string> => {
  const baseSlug = slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    let existingRecord = null;

    if (resource === "PROJECT") {
      existingRecord = await prisma.project.findUnique({
        where: { slug },
      });
    } else if (resource === "ARTICLE") {
      existingRecord = await prisma.article.findUnique({
        where: { slug },
      });
    }

    // If no existing record with this slug exists, it is safe to use
    if (!existingRecord) {
      return slug;
    }

    // If a collision occurs, append counter and try again
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};