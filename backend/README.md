# AI Chat Agent Backend

Backend service for the AI Chat Agent built with Express.js, Prisma, and Google Gemini AI.

## Tech Stack

- **Express.js** - Web framework
- **Prisma** - ORM for database management
- **PostgreSQL** - Database
- **Google Gemini AI** - AI model for responses
- **TypeScript** - Type-safe development
- **Express Validator** - Request validation

## Features

- ✅ Layered architecture (Routes → Controllers → Services)
- ✅ Conversation history with Prisma
- ✅ AI-powered responses using Google Gemini
- ✅ Input validation and error handling
- ✅ CORS configured for frontend
- ✅ Session-based conversations

## API Endpoints

### POST /api/chat/message

Send a message and get AI response.

**Request:**

```json
{
  "sessionId": "uuid-v4-string",
  "message": "Your message here"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "reply": "AI response",
    "messageId": "message-uuid"
  }
}
```

### GET /api/chat/history/:sessionId

Get conversation history for a session.

**Response:**

```json
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "messages": [
      {
        "id": "msg-id",
        "role": "user",
        "content": "message content",
        "createdAt": "2025-12-24T..."
      }
    ]
  }
}
```

### POST /api/chat/session

Create a new chat session.

**Response:**

```json
{
  "success": true,
  "data": {
    "sessionId": "new-uuid"
  }
}
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google Gemini API key

### Installation

1. **Install dependencies:**

   ```bash
   cd backend
   npm install
   ```

2. **Configure environment:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your values:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/chatdb?schema=public"
   GEMINI_API_KEY="your_gemini_api_key_here"
   PORT=3001
   NODE_ENV=development
   ```

3. **Setup database:**

   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate
   ```

4. **Start development server:**

   ```bash
   npm run dev
   ```

   Server will run on http://localhost:3001

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # Prisma client
│   │   └── index.ts     # Environment config
│   ├── controllers/     # Request handlers
│   │   └── chat.controller.ts
│   ├── services/        # Business logic
│   │   ├── chat.service.ts
│   │   └── gemini.service.ts
│   ├── routes/          # API routes
│   │   └── chat.routes.ts
│   ├── middleware/      # Express middleware
│   │   ├── errorHandler.ts
│   │   └── validator.ts
│   └── server.ts        # App entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── package.json
└── tsconfig.json
```

## Database Schema

```prisma
model Conversation {
  id        String   @id @default(uuid())
  sessionId String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  messages  Message[]
}

model Message {
  id             String       @id @default(uuid())
  conversationId String
  conversation   Conversation @relation(...)
  role           String       // 'user' or 'assistant'
  content        String       @db.Text
  createdAt      DateTime     @default(now())
}
```

## Gemini AI Configuration

The AI assistant is configured with a system prompt that:

- Provides helpful and accurate responses
- Maintains conversational context
- Keeps responses concise and informative
- Uses proper formatting

Context window: Last 10 messages

## Error Handling

All errors are handled through centralized middleware:

- Validation errors → 400 Bad Request
- Not found → 404 Not Found
- Server errors → 500 Internal Server Error

## Development

### Useful Commands

```bash
# Start with auto-reload
npm run dev

# Generate Prisma client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio

# Build for production
npm run build
```

## Troubleshooting

**Database connection issues:**

- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

**Gemini API errors:**

- Verify GEMINI_API_KEY is valid
- Check API quota/limits
- Review error logs

**CORS errors:**

- Update FRONTEND_URL in server.ts if needed
- Verify frontend origin matches CORS config
