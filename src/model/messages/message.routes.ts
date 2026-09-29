import express from "express";
import messageController from "./message.controller.js";

const messageRouter = express.Router();
messageRouter.post("/", messageController.createMessage);
messageRouter.put("/:id", messageController.updateMessageStatus);
messageRouter.get("/", messageController.getAllMessages);
messageRouter.get("/:id", messageController.getMessageById);
export default messageRouter;