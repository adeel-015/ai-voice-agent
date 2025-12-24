# API Quick Reference

## Base URL

```
http://localhost:3001/api
```

## Authentication

No authentication required (add if needed for production)

---

## Endpoints

### 1. Send Message

**POST** `/chat/message`

Send a message and receive AI response.

**Request Body:**

```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "What is machine learning?"
}
```

**Validation:**

- `sessionId`: Required, must be valid UUID
- `message`: Required, 1-10000 characters

**Success Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "reply": "Machine learning is a subset of artificial intelligence...",
    "messageId": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

**Error Response:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "message",
      "message": "Message is required"
    }
  ]
}
```

---

### 2. Get Chat History

**GET** `/chat/history/:sessionId`

Retrieve all messages for a session.

**URL Parameters:**

- `sessionId` (UUID): The session identifier

**Success Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "messages": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174001",
        "role": "user",
        "content": "Hello!",
        "createdAt": "2025-12-24T10:00:00.000Z"
      },
      {
        "id": "123e4567-e89b-12d3-a456-426614174002",
        "role": "assistant",
        "content": "Hello! How can I help you today?",
        "createdAt": "2025-12-24T10:00:01.000Z"
      }
    ]
  }
}
```

**Empty History:** `200 OK`

```json
{
  "success": true,
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "messages": []
  }
}
```

---

### 3. Create New Session

**POST** `/chat/session`

Generate a new session ID.

**Request Body:** None

**Success Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

## Error Codes

| Code | Description                     |
| ---- | ------------------------------- |
| 400  | Bad Request - Invalid input     |
| 404  | Not Found - Route doesn't exist |
| 500  | Internal Server Error           |

## Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "stack": "Stack trace (dev only)"
}
```

---

## Rate Limiting

Currently no rate limiting implemented. Add for production:

- Recommended: 100 requests per 15 minutes per IP
- Use `express-rate-limit` package

---

## CORS

Currently allows requests from:

- `http://localhost:5173` (frontend dev server)

Update in production to allow your frontend domain.

---

## Testing with cURL

### Create Session

```bash
curl -X POST http://localhost:3001/api/chat/session
```

### Send Message

```bash
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "YOUR_SESSION_ID",
    "message": "Hello, AI!"
  }'
```

### Get History

```bash
curl http://localhost:3001/api/chat/history/YOUR_SESSION_ID
```

---

## Testing with JavaScript

```javascript
// Create session
const sessionResponse = await fetch("http://localhost:3001/api/chat/session", {
  method: "POST",
});
const {
  data: { sessionId },
} = await sessionResponse.json();

// Send message
const messageResponse = await fetch("http://localhost:3001/api/chat/message", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    sessionId: sessionId,
    message: "What is AI?",
  }),
});
const { data } = await messageResponse.json();
console.log("AI Reply:", data.reply);

// Get history
const historyResponse = await fetch(
  `http://localhost:3001/api/chat/history/${sessionId}`
);
const { data: history } = await historyResponse.json();
console.log("Messages:", history.messages);
```

---

## Health Check

**GET** `/health`

Check if server is running.

**Response:** `200 OK`

```json
{
  "status": "ok",
  "timestamp": "2025-12-24T10:00:00.000Z"
}
```

---

## Database Models

### Conversation

```typescript
{
  id: string (UUID)
  sessionId: string (UUID, unique)
  createdAt: Date
  updatedAt: Date
  messages: Message[]
}
```

### Message

```typescript
{
  id: string(UUID);
  conversationId: string(UUID);
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}
```

---

## AI Configuration

**Model:** Google Gemini Pro
**Context Window:** Last 10 messages
**Max Message Length:** 10,000 characters

**System Prompt:**

```
You are a helpful and knowledgeable AI assistant. Your role is to:
- Provide accurate, clear, and helpful responses
- Be friendly and conversational in tone
- Ask clarifying questions when needed
- Admit when you don't know something
- Keep responses concise but informative
- Use proper formatting for better readability
```

---

## Production Checklist

Before deploying to production:

- [ ] Add authentication/authorization
- [ ] Implement rate limiting
- [ ] Set up proper CORS origins
- [ ] Add request logging
- [ ] Set up monitoring/alerting
- [ ] Add API versioning (/api/v1/...)
- [ ] Implement caching strategy
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Set up database connection pooling
- [ ] Configure proper error tracking
