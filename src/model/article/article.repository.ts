import {
  ArticleDTO,
  CreateArticleDTO,
  MinimalArticleDTO,
} from "@/interface/article.dto.js";
import { prisma } from "@/lib/prisma.js";

export interface IArticleRepository {
  createArticle(articleData: CreateArticleDTO): Promise<any>;
  getAllArticles(): Promise<MinimalArticleDTO[]>;
  getAllPublishedArticles(): Promise<MinimalArticleDTO[]>;
  getArticleById(articleId: string): Promise<ArticleDTO | null>;
  getArticleBySlug(slug: string): Promise<ArticleDTO | null>;
  updateArticle(
    articleId: string,
    articleData: CreateArticleDTO,
  ): Promise<ArticleDTO>;
  deleteArticle(articleId: string): Promise<any>;
}
export class ArticleRepository implements IArticleRepository {
  async createArticle(articleData: CreateArticleDTO): Promise<any> {
    return prisma.article.create({
      data: articleData,
    });
  }
  async getAllArticles(): Promise<ArticleDTO[]> {
    return prisma.article.findMany({});
  }
  async getArticleById(articleId: string): Promise<ArticleDTO | null> {
    return prisma.article.findUnique({
      where: { id: articleId },
    });
  }
  async getAllPublishedArticles(): Promise<MinimalArticleDTO[]> {
    return prisma.article.findMany({
      where: { status: "PUBLISHED" },
    });
  }
  async getArticleBySlug(slug: string): Promise<ArticleDTO | null> {
    return prisma.article.findUnique({
      where: { slug },
    });
  }
  async updateArticle(
    articleId: string,
    articleData: CreateArticleDTO,
  ): Promise<ArticleDTO> {
    return prisma.article.update({
      where: { id: articleId },
      data: articleData,
    });
  }
  async deleteArticle(articleId: string): Promise<any> {
    return prisma.article.delete({
      where: { id: articleId },
    });
  }
}

const articleRepository = new ArticleRepository();
export default articleRepository;
