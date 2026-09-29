import { CreateMessageDTO, MessageDTO, MessageStatus } from "@/interface/message.dto.js";
import messageRepository, { IMessageRepository } from "./message.repo.js";

export interface IMessageService {
  createMessage(data: CreateMessageDTO): Promise<MessageDTO>;
  getAllMessages(): Promise<MessageDTO[]>;
  getMessageById(id: string): Promise<MessageDTO | null>;
  deleteMessage(id: string): Promise<void>;
  deleteAllMessages(): Promise<void>;
  updateMessageStatus(id: string, status: MessageStatus): Promise<MessageDTO | null>;
}

export class MessageService implements IMessageService {
  constructor(private readonly messageRepository: IMessageRepository) {}
  async createMessage(data: CreateMessageDTO): Promise<MessageDTO> {
    return this.messageRepository.createMessage(data);
  }
  async getAllMessages(): Promise<MessageDTO[]> {
    return this.messageRepository.getAllMessages();
  }
  async getMessageById(id: string): Promise<MessageDTO | null> {
    return this.messageRepository.getMessageById(id);
  }
  async deleteMessage(id: string): Promise<void> {
    return this.messageRepository.deleteMessage(id);
  }
  async deleteAllMessages(): Promise<void> {
    return this.messageRepository.deleteAllMessages();
  }
  async updateMessageStatus(id: string, status: MessageStatus): Promise<MessageDTO | null> {
    return this.messageRepository.updateMessageStatus(id, status);
  }
}
const messageService = new MessageService(messageRepository);
export default messageService;