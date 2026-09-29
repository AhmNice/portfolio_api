import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const TEMP_ARTICLE_DIR = path.resolve(
  "src/temp/articles",
);
const TEMP_PROJECT_DIR = path.resolve(
  "src/temp/projects",
);
export const createArticleTempDirectory = async (): Promise<string> => {
  const directory = path.join(
    TEMP_ARTICLE_DIR,
    crypto.randomUUID(),
  );

  await fs.mkdir(directory, {
    recursive: true,
  });

  return directory;
};
export const createProjectTempDirectory = async (): Promise<string> => {
  const directory = path.join(
    TEMP_PROJECT_DIR,
    crypto.randomUUID(),
  );

  await fs.mkdir(directory, {
    recursive: true,
  });

  return directory;
};

export const removeTempDirectory = async (
  directory: string,
): Promise<void> => {
  await fs.rm(directory, {
    recursive: true,
    force: true,
  });
};

export const deleteUploadedFile = async (
  filePath: string,
): Promise<void> => {
  await fs.rm(filePath, {
    force: true,
  });
};