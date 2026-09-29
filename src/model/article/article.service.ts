import {
  createArticleTempDirectory,
  removeTempDirectory,
} from "@/util/article-utils/temp-file.util.js";
import articleRepository, { IArticleRepository } from "./article.repository.js";
import {
  extractZip,
  resolveImagePaths,
} from "@/util/article-utils/article-file.util.js";
import path from "node:path";
import {
  extractImagePaths,
  replaceImagePathsInMarkdown,
} from "@/util/article-utils/markdown.util.js";
import cloudinaryService, {
  ICloudinaryService,
} from "@/service/cloudinary.service.js";
import fs from "node:fs/promises";
import {
  ArticleDTO,
  CreateArticleDTO,
  MinimalArticleDTO,
} from "@/interface/article.dto.js";
import { Request } from "express";
import { ApiError } from "@/util/errorHandler.js";
import { generateSlug } from "@/util/generator.js";

export interface IArticleService {
  createArticle(
    req: Request,
    articleData: CreateArticleDTO,
  ): Promise<ArticleDTO>;

  getAllArticles(): Promise<MinimalArticleDTO[]>;
  updateArticle(
    req: Request,
    articleId: string,
    articleData: CreateArticleDTO,
  ): Promise<ArticleDTO>;
  getAllPublishedArticles(): Promise<MinimalArticleDTO[]>;
  updateArticle(
    req: Request,
    articleId: string,
    articleData: CreateArticleDTO,
  ): Promise<ArticleDTO>;
  getArticleById(articleId: string): Promise<ArticleDTO | null>;
  getArticleBySlug(slug: string): Promise<ArticleDTO | null>;
}
export class ArticleService implements IArticleService {
  constructor(
    private readonly articleRepository: IArticleRepository,
    private readonly cloudStorageService: ICloudinaryService,
  ) {}
  private async processFile(zipFilePath: string) {
    const tempDir = await createArticleTempDirectory();

    try {
      extractZip(zipFilePath, tempDir);

      const markdownFilePath = path.join(tempDir, "article.md");
      console.log("Markdown file path:", markdownFilePath);
      const files = await fs.readdir(tempDir, {
        recursive: true,
      });

      console.log(files);
      try {
        await fs.access(markdownFilePath);
      } catch {
        throw new ApiError(400, "Article ZIP must contain an article.md file");
      }

      // Extract original image references
      const imagePaths = await extractImagePaths(markdownFilePath);

      // Prevent duplicate uploads
      const uniqueImagePaths = [...new Set(imagePaths)];

      // Resolve Markdown paths to actual files
      const resolvedImagePaths = await resolveImagePaths(
        uniqueImagePaths,
        tempDir,
      );

      // Upload images
      const uploadedFiles = await this.cloudStorageService.uploadMany(
        resolvedImagePaths,
        {
          folder: "portfolio/articles",
          resourceType: "image",
        },
      );

      // Map Markdown path → Cloudinary URL
      const imagePathMap: Record<string, string> = {};

      for (let i = 0; i < uniqueImagePaths.length; i++) {
        imagePathMap[uniqueImagePaths[i]] = uploadedFiles[i].secureUrl;
      }

      // Replace local paths with Cloudinary URLs
      await replaceImagePathsInMarkdown(markdownFilePath, imagePathMap);

      // Read processed Markdown
      return await fs.readFile(markdownFilePath, "utf-8");
    } finally {
      await Promise.allSettled([
        fs.rm(zipFilePath, { force: true }),
        removeTempDirectory(tempDir),
      ]);
    }
  }
  async createArticle(
    req: Request,
    articleData: CreateArticleDTO,
  ): Promise<ArticleDTO> {
    const uploadedFile = req.file;

    if (!uploadedFile) {
      throw new ApiError(400, "No file uploaded");
    }

    const content = await this.processFile(uploadedFile.path);
    const slug = await generateSlug(articleData.title, "ARTICLE");
    const cleanedArticleData: CreateArticleDTO = Object.fromEntries(
      Object.entries(articleData).filter(
        ([_, value]) => value !== undefined && value !== null && value !== "",
      ),
    ) as CreateArticleDTO;
    return this.articleRepository.createArticle({
      ...cleanedArticleData,
      content,
      slug,
    });
  }
  async getAllArticles(): Promise<MinimalArticleDTO[]> {
    return this.articleRepository.getAllArticles();
  }
  async getAllPublishedArticles(): Promise<MinimalArticleDTO[]> {
    return this.articleRepository.getAllPublishedArticles();
  }
  async updateArticle(
    req: Request,
    articleId: string,
    articleData: CreateArticleDTO,
  ): Promise<ArticleDTO> {
    const uploadedFile = req.file;
    let content: string | undefined;
    if (uploadedFile) {
      content = await this.processFile(uploadedFile.path);
    }
    return this.articleRepository.updateArticle(articleId, {
      ...articleData,
      ...(content !== undefined ? { content } : {}),
    });
  }
  async getArticleById(articleId: string): Promise<ArticleDTO | null> {
    return this.articleRepository.getArticleById(articleId);
  }
  async getArticleBySlug(slug: string): Promise<ArticleDTO | null> {
    return this.articleRepository.getArticleBySlug(slug);
  }
}
const articleService = new ArticleService(articleRepository, cloudinaryService);
export default articleService;
