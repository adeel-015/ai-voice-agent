import { Request, Response, NextFunction } from "express";
import chatService from "../services/chat.service";
import { AppError } from "../middleware/errorHandler";

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId) {
      throw new AppError("Session ID is required", 400);
    }

    const result = await chatService.sendMessage({ sessionId, message });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getChatHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      throw new AppError("Session ID is required", 400);
    }

    const history = await chatService.getChatHistory(sessionId);

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

export const createSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = await chatService.createNewSession();

    res.status(201).json({
      success: true,
      data: { sessionId },
    });
  } catch (error) {
    next(error);
  }
};
