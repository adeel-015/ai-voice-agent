# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User's Browser                           │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              SvelteKit Frontend (Port 5173)             │    │
│  │                                                          │    │
│  │  ┌──────────────────┐        ┌──────────────────┐     │    │
│  │  │   +page.svelte   │        │  +layout.svelte  │     │    │
│  │  │  (Demo Page)     │        │  (App Layout)    │     │    │
│  │  └──────────────────┘        └────────┬─────────┘     │    │
│  │                                        │               │    │
│  │                      ┌─────────────────┴────────┐     │    │
│  │                      │  ChatWidget.svelte       │     │    │
│  │                      │  - Floating button       │     │    │
│  │                      │  - Chat interface        │     │    │
│  │                      │  - Message list          │     │    │
│  │                      │  - Input field           │     │    │
│  │                      └─────────┬────────────────┘     │    │
│  │                                │                       │    │
│  │         ┌──────────────────────┼──────────────┐       │    │
│  │         │                      │              │       │    │
│  │    ┌────▼─────┐         ┌─────▼──────┐  ┌───▼────┐  │    │
│  │    │ chat.ts  │         │ session.ts │  │ Stores │  │    │
│  │    │ (API)    │         │ (Store)    │  │        │  │    │
│  │    └────┬─────┘         └────────────┘  └────────┘  │    │
│  └─────────┼────────────────────────────────────────────┘    │
│            │ HTTP/REST                                        │
│            │ (JSON)                                           │
└────────────┼──────────────────────────────────────────────────┘
             │
             │ POST /api/chat/message
             │ GET  /api/chat/history/:sessionId
             │ POST /api/chat/session
             │
┌────────────▼──────────────────────────────────────────────────┐
│              Express Backend (Port 3001)                       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐     │
│  │                    Middleware Layer                   │     │
│  │  ┌──────────┐  ┌───────────┐  ┌─────────────────┐   │     │
│  │  │   CORS   │─▶│ Body      │─▶│ Error Handler   │   │     │
│  │  │          │  │ Parser    │  │                 │   │     │
│  │  └──────────┘  └───────────┘  └─────────────────┘   │     │
│  └──────────────────────────────────────────────────────┘     │
│                              │                                 │
│  ┌──────────────────────────▼───────────────────────────┐     │
│  │                     Routes Layer                      │     │
│  │              /api/chat (chat.routes.ts)              │     │
│  │  ┌────────────────────────────────────────────┐     │     │
│  │  │  POST   /message                           │     │     │
│  │  │  GET    /history/:sessionId                │     │     │
│  │  │  POST   /session                           │     │     │
│  │  └────────────────┬───────────────────────────┘     │     │
│  └───────────────────┼─────────────────────────────────┘     │
│                      │                                         │
│                      │ + Validation                            │
│                      │                                         │
│  ┌───────────────────▼─────────────────────────────────┐     │
│  │                Controllers Layer                     │     │
│  │             (chat.controller.ts)                     │     │
│  │  ┌──────────────────────────────────────────┐       │     │
│  │  │  - sendMessage()                         │       │     │
│  │  │  - getChatHistory()                      │       │     │
│  │  │  - createSession()                       │       │     │
│  │  └────────────────┬─────────────────────────┘       │     │
│  └───────────────────┼─────────────────────────────────┘     │
│                      │                                         │
│  ┌───────────────────▼─────────────────────────────────┐     │
│  │                 Services Layer                       │     │
│  │                                                       │     │
│  │  ┌──────────────────────┐  ┌─────────────────────┐ │     │
│  │  │  chat.service.ts     │  │ gemini.service.ts   │ │     │
│  │  │                      │  │                     │ │     │
│  │  │ - sendMessage()      │  │ - generateResponse()│ │     │
│  │  │ - getChatHistory()   │  │ - buildContext()    │ │     │
│  │  │ - createNewSession() │  │ - getSystemPrompt() │ │     │
│  │  └──────────┬───────────┘  └───────┬─────────────┘ │     │
│  │             │                       │               │     │
│  │             │                       │               │     │
│  └─────────────┼───────────────────────┼───────────────┘     │
│                │                       │                     │
│                │                       │                     │
└────────────────┼───────────────────────┼─────────────────────┘
                 │                       │
        ┌────────▼────────┐     ┌───────▼──────────┐
        │  Prisma ORM     │     │  Google Gemini   │
        │                 │     │  AI API          │
        │  - Query        │     │                  │
        │  - Transactions │     │  - Generate      │
        │  - Migrations   │     │    Content       │
        └────────┬────────┘     └──────────────────┘
                 │
        ┌────────▼─────────┐
        │   PostgreSQL     │
        │   Database       │
        │                  │
        │  ┌─────────────┐ │
        │  │Conversation │ │
        │  │  - id       │ │
        │  │  - sessionId│ │
        │  │  - messages │ │
        │  └──────┬──────┘ │
        │         │        │
        │  ┌──────▼──────┐ │
        │  │  Message    │ │
        │  │  - id       │ │
        │  │  - role     │ │
        │  │  - content  │ │
        │  │  - createdAt│ │
        │  └─────────────┘ │
        └──────────────────┘
```

## Data Flow

### 1. Send Message Flow

```
User Types Message
       │
       ▼
ChatWidget Component
       │
       ├─▶ Update Local State (optimistic update)
       │
       ▼
chatAPI.sendMessage()
       │
       ▼
POST /api/chat/message
       │
       ▼
chat.routes.ts
       │
       ├─▶ Validation Middleware
       │
       ▼
chat.controller.sendMessage()
       │
       ▼
chat.service.sendMessage()
       │
       ├─▶ Find/Create Conversation (Prisma)
       │
       ├─▶ Save User Message (Prisma)
       │
       ├─▶ Get Conversation History (Prisma)
       │
       ├─▶ gemini.service.generateResponse()
       │       │
       │       ├─▶ Build Context (last 10 messages)
       │       │
       │       ├─▶ Create Prompt (system + context + user message)
       │       │
       │       ├─▶ Call Gemini API
       │       │
       │       └─▶ Return AI Response
       │
       ├─▶ Save Assistant Message (Prisma)
       │
       └─▶ Return Response to Frontend
               │
               ▼
       ChatWidget receives response
               │
               ├─▶ Add AI message to local state
               │
               └─▶ Auto-scroll to bottom
```

### 2. Load History Flow

```
Page Load / Refresh
       │
       ▼
ChatWidget.onMount()
       │
       ├─▶ Check localStorage for sessionId
       │
       ├─▶ If found:
       │       │
       │       ▼
       │   chatAPI.getChatHistory(sessionId)
       │       │
       │       ▼
       │   GET /api/chat/history/:sessionId
       │       │
       │       ▼
       │   chat.routes.ts
       │       │
       │       ▼
       │   chat.controller.getChatHistory()
       │       │
       │       ▼
       │   chat.service.getChatHistory()
       │       │
       │       ├─▶ Query Prisma for Conversation
       │       │
       │       └─▶ Return messages
       │               │
       │               ▼
       │       ChatWidget renders history
       │
       └─▶ If not found:
               │
               ▼
           chatAPI.createSession()
               │
               ▼
           POST /api/chat/session
               │
               ▼
           Generate UUID
               │
               ├─▶ Save to localStorage
               │
               └─▶ Ready for first message
```

## Component Breakdown

### Frontend Components

```
src/
├── routes/
│   ├── +layout.svelte         # Main layout wrapper
│   │   └── Includes ChatWidget globally
│   │
│   └── +page.svelte            # Demo/landing page
│       └── Just displays info
│
├── lib/
│   ├── components/
│   │   └── ChatWidget.svelte   # Main chat UI
│   │       ├── State Management:
│   │       │   - isOpen (boolean)
│   │       │   - messages (Message[])
│   │       │   - inputMessage (string)
│   │       │   - isTyping (boolean)
│   │       │   - error (string | null)
│   │       │   - sessionId (string | null)
│   │       │
│   │       ├── Functions:
│   │       │   - toggleChat()
│   │       │   - sendMessage()
│   │       │   - scrollToBottom()
│   │       │   - handleKeyPress()
│   │       │
│   │       └── UI Elements:
│   │           - Floating button
│   │           - Chat header
│   │           - Messages container
│   │           - Input field
│   │           - Send button
│   │
│   ├── api/
│   │   └── chat.ts             # API client
│   │       ├── chatAPI.sendMessage()
│   │       ├── chatAPI.getChatHistory()
│   │       └── chatAPI.createSession()
│   │
│   └── stores/
│       └── session.ts          # Session store
│           ├── Writable store for sessionId
│           └── localStorage sync
│
└── app.css                     # Tailwind imports
```

### Backend Components

```
src/
├── server.ts                   # Express app setup
│   ├── Middleware registration
│   ├── Route registration
│   └── Error handlers
│
├── routes/
│   └── chat.routes.ts          # Route definitions
│       ├── POST /message + validation
│       ├── GET /history/:sessionId + validation
│       └── POST /session
│
├── controllers/
│   └── chat.controller.ts      # Request handlers
│       ├── sendMessage()
│       ├── getChatHistory()
│       └── createSession()
│
├── services/
│   ├── chat.service.ts         # Business logic
│   │   ├── Database operations
│   │   ├── Message validation
│   │   └── Session management
│   │
│   └── gemini.service.ts       # AI integration
│       ├── Gemini API calls
│       ├── Context building
│       └── Prompt engineering
│
├── middleware/
│   ├── errorHandler.ts         # Error handling
│   │   ├── AppError class
│   │   ├── errorHandler()
│   │   └── notFoundHandler()
│   │
│   └── validator.ts            # Validation
│       └── validate() wrapper
│
└── config/
    ├── database.ts             # Prisma client
    └── index.ts                # Environment config
```

## Technology Decisions

### Why SvelteKit?

- ✅ Lightweight and fast
- ✅ Reactive by default
- ✅ Built-in routing
- ✅ Excellent TypeScript support
- ✅ Simple state management

### Why Express?

- ✅ Minimal and flexible
- ✅ Large ecosystem
- ✅ Well-documented
- ✅ Easy to layer architecture
- ✅ Excellent middleware support

### Why Prisma?

- ✅ Type-safe database access
- ✅ Automatic migrations
- ✅ Great developer experience
- ✅ Schema-first approach
- ✅ Built-in connection pooling

### Why PostgreSQL?

- ✅ Robust and reliable
- ✅ ACID compliant
- ✅ Great for relational data
- ✅ Excellent JSON support
- ✅ Wide hosting support

### Why Gemini?

- ✅ Free tier available
- ✅ Fast responses
- ✅ Good context understanding
- ✅ Simple API
- ✅ Reliable uptime

## Security Considerations

```
┌─────────────────────────────────────┐
│         Security Layers              │
├─────────────────────────────────────┤
│                                      │
│  Frontend:                           │
│  ✓ Input sanitization               │
│  ✓ XSS protection (Svelte escaping) │
│  ✓ HTTPS in production              │
│                                      │
│  Backend:                            │
│  ✓ CORS configuration               │
│  ✓ Input validation (express-validator) │
│  ✓ SQL injection protection (Prisma)│
│  ✓ Environment variables            │
│  ✓ Error message sanitization       │
│                                      │
│  Database:                           │
│  ✓ Parameterized queries            │
│  ✓ Connection string in .env        │
│  ✓ Indexes for performance          │
│                                      │
│  API:                                │
│  ✓ Rate limiting (TODO)             │
│  ✓ Authentication (TODO)            │
│  ✓ API versioning (TODO)            │
│                                      │
└─────────────────────────────────────┘
```

## Scalability Paths

### Current State

- Single server deployment
- Direct database connection
- In-memory session (localStorage)

### Future Improvements

```
┌──────────────────────────────────────┐
│       Load Balancer                   │
└────────────┬─────────────────────────┘
             │
      ┌──────┴──────┐
      ▼             ▼
┌──────────┐  ┌──────────┐
│  Server  │  │  Server  │  (Multiple instances)
│    1     │  │    2     │
└─────┬────┘  └────┬─────┘
      │            │
      └──────┬─────┘
             ▼
      ┌────────────┐
      │   Redis    │  (Session store + Cache)
      └────────────┘
             │
             ▼
      ┌────────────┐
      │ PostgreSQL │  (Primary)
      └─────┬──────┘
            │
      ┌─────┴──────┐
      ▼            ▼
┌──────────┐ ┌──────────┐
│ Read     │ │  Read    │  (Read replicas)
│ Replica 1│ │ Replica 2│
└──────────┘ └──────────┘
```

## Monitoring Points

```
Frontend:
  - Page load time
  - API response time
  - Error rate
  - User engagement

Backend:
  - Request rate
  - Response time
  - Error rate
  - Database query time
  - AI API latency

Database:
  - Connection pool usage
  - Query performance
  - Storage usage

AI Service:
  - API quota usage
  - Response time
  - Error rate
```
