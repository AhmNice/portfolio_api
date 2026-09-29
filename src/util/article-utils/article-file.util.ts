import AdmZip from "adm-zip";
import fs from "node:fs/promises";
import path from "node:path";

export const extractZip = (
  zipPath: string,
  destination: string,
): void => {
  const zip = new AdmZip(zipPath);

  zip.extractAllTo(destination, true);
};

export const resolveImagePaths = async (
  imagePaths: string[],
  extractedPath: string,
): Promise<string[]> => {
  const basePath = path.resolve(extractedPath);

  const resolvedPaths = imagePaths.map((imagePath) => {
    const resolvedPath = path.resolve(basePath, imagePath);

    if (
      resolvedPath !== basePath &&
      !resolvedPath.startsWith(`${basePath}${path.sep}`)
    ) {
      throw new Error("Invalid image path");
    }

    return resolvedPath;
  });

  await Promise.all(
    resolvedPaths.map((filePath) => fs.access(filePath)),
  );

  return resolvedPaths;
};