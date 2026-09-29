import { asyncHandler } from "@/lib/asyncHandler.js";
import messageService, { IMessageService } from "./message.service.js";
import { ApiResponse } from "@/util/api.js";

export class MessageController {
  constructor(private readonly messageService: IMessageService) {}
  readonly createMessage = asyncHandler(async (req, res) => {
    const data = req.body;
    const message = await this.messageService.createMessage(data);
    res
      .status(201)
      .json(new ApiResponse(201, "Message sent successfully", message));
  });
  readonly getAllMessages = asyncHandler(async (req, res) => {
    const messages = await this.messageService.getAllMessages();
    res
      .status(200)
      .json(new ApiResponse(200, "Messages retrieved successfully", messages));
  });
  readonly getMessageById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const message = await this.messageService.getMessageById(String(id));
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res
      .status(200)
      .json(new ApiResponse(200, "Message retrieved successfully", message));
  });
  readonly updateMessageStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const message = await this.messageService.getMessageById(String(id));
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    const updatedMessage = await this.messageService.updateMessageStatus(String(id), status);
    res
      .status(200)
      .json(new ApiResponse(200, "Message status updated successfully", updatedMessage));
  });
}
const messageController = new MessageController(messageService);
export default messageController;
