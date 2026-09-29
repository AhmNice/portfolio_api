import { CreateMessageDTO, MessageDTO, MessageStatus } from "@/interface/message.dto.js";
import { prisma } from "@/lib/prisma.js";
export interface IMessageRepository {
  createMessage(data: CreateMessageDTO): Promise<MessageDTO>;
  getMessageById(id: string): Promise<MessageDTO | null>;
  getAllMessages(): Promise<MessageDTO[]>;
  deleteMessage(id: string): Promise<void>;
  deleteAllMessages(): Promise<void>;
  updateMessageStatus(id: string, status: MessageStatus): Promise<MessageDTO | null>;
}
export class MessageRepository implements IMessageRepository {
  async createMessage(data: CreateMessageDTO): Promise<MessageDTO> {
    const message = await prisma.messages.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      },
    });
    return message;
  }
  async getAllMessages(): Promise<MessageDTO[]> {
    return await prisma.messages.findMany();
  }
  async getMessageById(id: string): Promise<MessageDTO | null> {
    return await prisma.messages.findUnique({
      where: {
        id,
      },
    });
  }
  async deleteMessage(id: string): Promise<void> {
    await prisma.messages.delete({
      where: {
        id,
      },
    });
  }
  async deleteAllMessages(): Promise<void> {
    await prisma.messages.deleteMany();
  }
  async updateMessageStatus(id: string, status: MessageStatus): Promise<MessageDTO | null> {
    return await prisma.messages.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }
}
const messageRepository = new MessageRepository();
export default messageRepository;