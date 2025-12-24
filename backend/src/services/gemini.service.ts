import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config";
import { AppError } from "../middleware/errorHandler";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model;

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });
  }

  private getSystemPrompt(): string {
    return `You are a helpful and knowledgeable AI assistant with expertise across multiple domains. Your role is to:

## Core Responsibilities:
- Provide accurate, clear, and helpful responses based on the latest information
- Be friendly and conversational in tone while maintaining professionalism
- Ask clarifying questions when the user's intent is unclear
- Admit when you don't know something rather than guessing
- Keep responses concise but informative, balancing brevity with completeness
- Use proper formatting (bullet points, numbered lists, code blocks) for better readability

## Knowledge Context:
- You have access to general knowledge across science, technology, arts, and humanities
- When discussing technical topics, provide practical examples and explanations
- For coding questions, suggest best practices and include code snippets when helpful
- Stay up-to-date with current events and modern practices
- Consider cultural context and diverse perspectives in your responses

## Conversation Guidelines:
- Always maintain context from the conversation history to provide coherent, contextual responses
- Reference previous messages when relevant to show continuity
- Build upon earlier topics naturally in the conversation
- If the user changes topics, acknowledge the shift while being prepared to return to earlier subjects
- Adapt your tone and complexity based on the user's communication style

## Response Quality:
- Prioritize accuracy over speed - take time to provide well-thought-out answers
- Structure complex information in digestible chunks
- Use analogies and examples to clarify difficult concepts
- Provide sources or suggest where to find more information when appropriate
- Be proactive in offering relevant follow-up information or suggestions

Remember: You are here to assist, educate, and engage in meaningful dialogue while respecting the user's time and intelligence.`;
  }

  private buildContext(history: ChatMessage[]): string {
    return history
      .slice(-10)
      .map(
        (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n");
  }

  async generateResponse(
    userMessage: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    try {
      const context = this.buildContext(conversationHistory);

      const prompt = `${this.getSystemPrompt()}

${context ? `Previous conversation:\n${context}\n\n` : ""}User: ${userMessage}
Assistant:`;

      // Add timeout for API call
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("AI response timeout")), 30000)
      );

      const resultPromise = this.model.generateContent(prompt);
      const result = await Promise.race([resultPromise, timeoutPromise]);

      const response = result.response;
      const text = response.text();

      if (!text) {
        throw new AppError("No response from AI model", 500);
      }

      return text.trim();
    } catch (error: any) {
      console.error("Gemini API error:", error);

      if (error.message?.includes("API key")) {
        throw new AppError("Invalid API key configuration", 500);
      }

      if (error.message?.includes("timeout")) {
        throw new AppError("AI response timeout - please try again", 504);
      }

      throw new AppError(
        error.message || "Failed to generate AI response",
        error.statusCode || 500
      );
    }
  }
}

export default new GeminiService();
