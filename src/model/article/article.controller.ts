import { Request, Response } from "express";

import { asyncHandler } from "@/lib/asyncHandler.js";
import articleService, { IArticleService } from "./article.service.js";
import { parseArticleInput } from "@/util/parse.js";
import { CreateArticleDTO } from "@/interface/article.dto.js";
import { ApiResponse } from "@/util/api.js";

export class ArticleController {
  constructor(private readonly articleService: IArticleService) {}

  readonly createArticle = asyncHandler(async (req: Request, res: Response) => {
    const articleData = req.body;
    const parsedDAta = parseArticleInput(articleData);
    const result = await this.articleService.createArticle(
      req,
      parsedDAta as CreateArticleDTO,
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  });

  readonly getAllArticles = asyncHandler(
    async (req: Request, res: Response) => {
      const result = await this.articleService.getAllArticles();
      res.status(200).json({
        success: true,
        data: result,
      });
    },
  );
  readonly getAllPublishedArticles = asyncHandler(
    async (req: Request, res: Response) => {
      const result = await this.articleService.getAllPublishedArticles();
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            "Published articles retrieved successfully",
            result,
          ),
        );
    },
  );
  readonly getArticleById = asyncHandler(
    async (req: Request, res: Response) => {
      const articleId = req.params.id;
      const result = await this.articleService.getArticleById(
        articleId as string,
      );
      res.status(200).json({
        success: true,
        data: result,
      });
    },
  );
  readonly updateArticle = asyncHandler(async (req: Request, res: Response) => {
    const articleId = req.params.id;
    const articleData = req.body;
    const parsedData = parseArticleInput(articleData);
    const result = await this.articleService.updateArticle(
      req,
      articleId as string,
      parsedData as CreateArticleDTO,
    );
    res
      .status(200)
      .json(new ApiResponse(200, "Article updated successfully", result));
  });
  readonly getArticleBySlug = asyncHandler(
    async (req: Request, res: Response) => {
      const slug = req.params.slug;
      const result = await this.articleService.getArticleBySlug(slug as string);
      res.status(200).json({
        success: true,
        data: result,
      });
    },
  );
}

const articleController = new ArticleController(articleService);
export default articleController;
