import express from "express";

const ArticleRouter = express.Router();

import articleController from "./article.controller.js";
import { upload } from "@/config/multer.js";
import { validate } from "@/middleware/validation.js";
import { createArticleSchema, getArticleSchema, getArticleSchemaBySlug, updateArticleSchema } from "@/schema/article.schema.js";

ArticleRouter.post(
  "/",
  upload.single("article"),
  validate(createArticleSchema),
  articleController.createArticle,
);
ArticleRouter.patch("/:id",
  upload.single("article"),
  validate(updateArticleSchema),
  articleController.updateArticle,
);
ArticleRouter.get("/", articleController.getAllArticles);
ArticleRouter.get("/published", articleController.getAllPublishedArticles);
ArticleRouter.get("/:id",validate(getArticleSchema), articleController.getArticleById);
ArticleRouter.get("/slug/:slug", validate(getArticleSchemaBySlug), articleController.getArticleBySlug);
export default ArticleRouter;
