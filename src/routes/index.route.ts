import express from "express";
import authRouter from "@/model/authentication/auth.route.js";
import projectRouter from "@/model/project/project.route.js";
import ArticleRouter from "@/model/article/article.route.js";
import uploadRouter from "./upload.route.js";
import messageRouter from "@/model/messages/message.routes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/projects", projectRouter);
router.use("/articles", ArticleRouter);
router.use("/upload", uploadRouter);
router.use("/messages", messageRouter);

export default router;
