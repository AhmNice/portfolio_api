export interface CreateMessageDTO {
  name: string;
  email: string;
  subject: string;
  message: string;
}
export interface UpdateMessageDTO {
  status: MessageStatus;
}
export interface MessageDTO {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: Date;
}
export type MessageStatus = "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";