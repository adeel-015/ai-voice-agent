import { PUBLIC_API_URL } from "$env/static/public";

const API_URL = PUBLIC_API_URL || "http://localhost:3001";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface SendMessageResponse {
  success: boolean;
  data: {
    reply: string;
    messageId: string;
  };
}

export interface ChatHistoryResponse {
  success: boolean;
  data: {
    sessionId: string;
    messages: Message[];
  };
}

export interface CreateSessionResponse {
  success: boolean;
  data: {
    sessionId: string;
  };
}

class ChatAPI {
  async sendMessage(
    sessionId: string,
    message: string
  ): Promise<SendMessageResponse> {
    const response = await fetch(`${API_URL}/api/chat/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId, message }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send message");
    }

    return response.json();
  }

  async getChatHistory(sessionId: string): Promise<ChatHistoryResponse> {
    const response = await fetch(`${API_URL}/api/chat/history/${sessionId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to get chat history");
    }

    return response.json();
  }

  async createSession(): Promise<CreateSessionResponse> {
    const response = await fetch(`${API_URL}/api/chat/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create session");
    }

    return response.json();
  }
}

export const chatAPI = new ChatAPI();
