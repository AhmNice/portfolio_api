import projectRepository, {
  IProjectRepository,
} from "@/model/project/project.repo.js";
import _ from "lodash";
import {
  CreateProjectDTO,
  ProjectDTO,
  UpdateProjectDTO,
} from "@/interface/project.dto.js";
import { generateSlug } from "@/util/generator.js";
import {
  createProjectTempDirectory,
  removeTempDirectory,
} from "@/util/article-utils/temp-file.util.js";
import fs from "node:fs/promises";

import {
  extractZip,
  resolveImagePaths,
} from "@/util/article-utils/article-file.util.js";
import path from "node:path";
import { ApiError } from "@/util/errorHandler.js";
import {
  extractImagePaths,
  replaceImagePathsInMarkdown,
} from "@/util/article-utils/markdown.util.js";
import cloudinaryService, {
  ICloudinaryService,
} from "@/service/cloudinary.service.js";
import { Request } from "express";

export interface IProjectService {
  create(data: CreateProjectDTO, req: Request): Promise<ProjectDTO>;
  list(): Promise<ProjectDTO[]>;
  listPublished(): Promise<ProjectDTO[]>;
  getProject(id: string): Promise<ProjectDTO | null>;
  update(id: string, data: UpdateProjectDTO): Promise<ProjectDTO>;
  delete(id: string): Promise<ProjectDTO>;
  deleteAll(): Promise<void>;
}

export class ProjectService implements IProjectService {
  constructor(
    private readonly projectRepository: IProjectRepository,
    private readonly cloudStorageService: ICloudinaryService,
  ) {}
  private async processFile(zipFilePath: string) {
    const tempDir = await createProjectTempDirectory();
    try {
      extractZip(zipFilePath, tempDir);
      const contentMarkdownFilePath = path.join(tempDir, "content.md");
      try {
        await fs.access(contentMarkdownFilePath);
      } catch {
        throw new ApiError(400, "Project ZIP must contain a content.md file");
      }
      const imagePaths = await extractImagePaths(contentMarkdownFilePath);
      const uniqueImagePaths = Array.from(new Set(imagePaths));

      const resolvedImagePaths = await resolveImagePaths(
        uniqueImagePaths,
        tempDir,
      );
      const uploadedImageResults = await this.cloudStorageService.uploadMany(
        resolvedImagePaths,
        {
          folder: "portfolio/projects",
          resourceType: "image",
        },
      );

      const imagePathMap: Record<string, string> = {};
      for (let i = 0; i < uniqueImagePaths.length; i++) {
        const originalPath = uniqueImagePaths[i];
        const uploadedUrl = uploadedImageResults[i].secureUrl;

        imagePathMap[originalPath] = uploadedUrl;

        // Handle Windows backslash variants if relative paths use backslashes
        const normalizedPath = originalPath.replace(/\\/g, "/");
        imagePathMap[normalizedPath] = uploadedUrl;
      }
      console.log("Image path map:", imagePathMap);

      await replaceImagePathsInMarkdown(contentMarkdownFilePath, imagePathMap);

      return await fs.readFile(contentMarkdownFilePath, "utf-8");
    } finally {
      await Promise.allSettled([
        fs.rm(zipFilePath, { force: true }),
        removeTempDirectory(tempDir),
      ]);
    }
  }
  async create(data: CreateProjectDTO, req: Request): Promise<ProjectDTO> {
    const slug = await generateSlug(data.name, "PROJECT");
    const uploadedFile = req.file;
    if (!uploadedFile) {
      throw new ApiError(400, "Project ZIP file is required");
    }

    const parsedLinks =
      typeof data.links === "string" ? JSON.parse(data.links) : data.links;

    const content = await this.processFile(uploadedFile.path);
    const clean = {
      ...data,
      links: parsedLinks,
      content,
      slug,
    };
    return this.projectRepository.create(clean);
  }
  async list(): Promise<ProjectDTO[]> {
    return this.projectRepository.list();
  }
  async listPublished(): Promise<ProjectDTO[]> {
    return this.projectRepository.listPublished();
  }
  async getProject(id: string): Promise<ProjectDTO | null> {
    return this.projectRepository.get(id);
  }
  async getProjectBySlug(slug: string): Promise<ProjectDTO | null> {
    return this.projectRepository.getBySlug(slug);
  }
async update(id: string, data: UpdateProjectDTO): Promise<ProjectDTO> {
  console.log("Update data received:", data);
  if (_.isEmpty(data)) {
    throw new ApiError(400, "No update fields provided");
  }

  return this.projectRepository.update(id, data);
}
  async delete(id: string): Promise<ProjectDTO> {
    return this.projectRepository.delete(id);
  }
  async deleteAll(): Promise<void> {
    return this.projectRepository.deleteAll();
  }
}

const projectService = new ProjectService(projectRepository, cloudinaryService);

export default projectService;
