import prisma from "../config/database";
import geminiService, { ChatMessage } from "./gemini.service";
import { AppError } from "../middleware/errorHandler";
import { v4 as uuidv4 } from "uuid";

export interface SendMessageDTO {
  sessionId: string;
  message: string;
}

export interface ChatHistoryResponse {
  sessionId: string;
  messages: Array<{
    id: string;
    role: string;
    content: string;
    createdAt: Date;
  }>;
}

class ChatService {
  async sendMessage(
    data: SendMessageDTO
  ): Promise<{ reply: string; messageId: string }> {
    const { sessionId, message } = data;

    // Validate message
    if (!message || message.trim().length === 0) {
      throw new AppError("Message cannot be empty", 400);
    }

    if (message.length > 10000) {
      throw new AppError("Message is too long (max 10000 characters)", 400);
    }

    try {
      // Find or create conversation
      let conversation = await prisma.conversation.findUnique({
        where: { sessionId },
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 20, // Get latest 20 messages for context
          },
        },
      });

      // Reverse messages to get chronological order (oldest to newest)
      if (conversation?.messages) {
        conversation.messages = conversation.messages.reverse();
      }

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            sessionId,
          },
          include: { messages: true },
        });
      }

      // Save user message
      const userMessage = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: "user",
          content: message.trim(),
        },
      });

      // Prepare conversation history for AI
      const history: ChatMessage[] = conversation.messages.map((msg: { role: string; content: any; }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

      // Get AI response
      const aiReply = await geminiService.generateResponse(message, history);

      // Save assistant message
      const assistantMessage = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: "assistant",
          content: aiReply,
        },
      });

      return {
        reply: aiReply,
        messageId: assistantMessage.id,
      };
    } catch (error: any) {
      console.error("Chat service error:", error);
      throw error instanceof AppError
        ? error
        : new AppError("Failed to process message", 500);
    }
  }

  async getChatHistory(sessionId: string): Promise<ChatHistoryResponse> {
    try {
      const conversation = await prisma.conversation.findUnique({
        where: { sessionId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (!conversation) {
        return {
          sessionId,
          messages: [],
        };
      }

      return {
        sessionId,
        messages: conversation.messages.map((msg: { id: any; role: any; content: any; createdAt: any; }) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          createdAt: msg.createdAt,
        })),
      };
    } catch (error: any) {
      console.error("Get chat history error:", error);
      throw new AppError("Failed to retrieve chat history", 500);
    }
  }

  async createNewSession(): Promise<string> {
    return uuidv4();
  }
}

export default new ChatService();
