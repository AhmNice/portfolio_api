import express from "express";

import { uploadController } from "@/controller/upload.controller.js";

const uploadRouter = express.Router();

uploadRouter.post("/signature", uploadController.generateSignature);

export default uploadRouter;
