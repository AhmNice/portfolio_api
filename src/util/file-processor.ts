import AdmZip from "adm-zip";
import fs from "fs/promises";
import path from "node:path";

export const deleteUploadedFiles = async (files: any) => {
  if (!files) return;

  const deletions = Object.values(files).flatMap((fileArray: any) =>
    fileArray.map((file: any) => fs.unlink(file.path).catch(() => {})),
  );

  await Promise.all(deletions);
};

export const extractFile = (filePath: string) => {
  const zip = new AdmZip(filePath);
  zip.extractAllTo("src/temp/articles/extracted", true);
};

export const extractImagePaths = async (
  filePath: string,
): Promise<string[]> => {
  const content = await fs.readFile(filePath, "utf-8");

  const regex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const imagePaths: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    imagePaths.push(match[2]);
  }
  return imagePaths;
};

export const resolveImagePaths = (
  imagePaths: string[],
  extractedPath: string,
): string[] => {
  const basePath = path.resolve(extractedPath);
  return imagePaths.map((imagePath) => {
    const resolvedPath = path.resolve(basePath, imagePath);

    if (
      resolvedPath !== basePath &&
      !resolvedPath.startsWith(`${basePath}${path.sep}`)
    ) {
      throw new Error("Invalid image path");
    }

    return resolvedPath;
  });
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
export const processFile = () => {};
