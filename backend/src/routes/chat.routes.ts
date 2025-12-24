import { Router } from "express";
import { body, param } from "express-validator";
import * as chatController from "../controllers/chat.controller";
import { validate } from "../middleware/validator";

const router = Router();

// POST /chat/message - Send a message and get AI response
router.post(
  "/message",
  validate([
    body("sessionId")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Session ID is required")
      .isUUID()
      .withMessage("Session ID must be a valid UUID"),
    body("message")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Message is required")
      .isLength({ max: 10000 })
      .withMessage("Message must not exceed 10000 characters"),
  ]),
  chatController.sendMessage
);

// GET /chat/history/:sessionId - Get chat history for a session
router.get(
  "/history/:sessionId",
  validate([
    param("sessionId")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Session ID is required")
      .isUUID()
      .withMessage("Session ID must be a valid UUID"),
  ]),
  chatController.getChatHistory
);

// POST /chat/session - Create a new session
router.post("/session", chatController.createSession);

export default router;
