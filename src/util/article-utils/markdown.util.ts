import fs from "node:fs/promises";

export const extractImagePaths = async (
  filePath: string,
): Promise<string[]> => {
  const content = await fs.readFile(filePath, "utf-8");

  const regex = /!\[([^\]]*)\]\(([^)]+)\)/g;

  const imagePaths: string[] = [];

  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    imagePaths.push(match[2].trim());
  }

  return imagePaths;
};

export const replaceImagePathsInMarkdown = async (
  filePath: string,
  imagePathMap: Record<string, string>,
): Promise<void> => {
  let content = await fs.readFile(filePath, "utf-8");

  for (const [oldPath, newPath] of Object.entries(imagePathMap)) {
    content = content.replaceAll(oldPath, newPath);
  }

  await fs.writeFile(filePath, content, "utf-8");
};