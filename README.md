# Full-Stack AI Chat Agent

A modern, full-stack AI-powered chat application with a floating widget interface. Built with SvelteKit, Express, Prisma, and Google Gemini AI.

## 🎯 Features

### Frontend

- **Floating Chat Widget** - Always accessible, bottom-right corner
- **Real-time Conversations** - Instant AI responses
- **Persistent Sessions** - localStorage-based session management
- **Auto-scroll** - Automatically scrolls to latest messages
- **Typing Indicators** - Visual feedback while AI generates responses
- **Error Handling** - User-friendly error messages
- **Responsive Design** - Works on all screen sizes
- **Smooth Animations** - Polished UI transitions

### Backend

- **Layered Architecture** - Clean separation of concerns
- **Prisma ORM** - Type-safe database access
- **Google Gemini AI** - Advanced AI responses
- **Conversation History** - Persistent chat storage
- **Input Validation** - Express-validator middleware
- **Error Middleware** - Centralized error handling
- **Session Management** - UUID-based sessions

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (SvelteKit)                │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │ Chat Widget │──│ API Client   │──│ Session Store  │ │
│  └─────────────┘  └──────────────┘  └────────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/REST
┌────────────────────────┴────────────────────────────────┐
│                  Backend (Express + Prisma)              │
│  ┌─────────┐  ┌────────────┐  ┌────────────────────┐   │
│  │ Routes  │──│ Controllers │──│ Services           │   │
│  └─────────┘  └────────────┘  │ - Chat Service     │   │
│                                │ - Gemini Service   │   │
│                                └────────────────────┘   │
│                                         │                │
│                                  ┌──────┴─────┐         │
│                                  │   Prisma   │         │
│                                  └──────┬─────┘         │
└─────────────────────────────────────────┼───────────────┘
                                          │
                                  ┌───────┴────────┐
                                  │  PostgreSQL    │
                                  └────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/chatdb?schema=public"
   GEMINI_API_KEY="your_actual_gemini_api_key"
   PORT=3001
   NODE_ENV=development
   ```

4. **Setup database:**

   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Create database and run migrations
   npm run prisma:migrate
   ```

5. **Start backend:**

   ```bash
   npm run dev
   ```

   Backend will run on http://localhost:3001

### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```env
   PUBLIC_API_URL=http://localhost:3001
   ```

4. **Start frontend:**

   ```bash
   npm run dev
   ```

   Frontend will run on http://localhost:5173

### Test the Application

1. Open http://localhost:5173 in your browser
2. Click the blue chat button in the bottom-right corner
3. Start chatting with the AI!

## 📁 Project Structure

```
spur/
├── backend/                 # Express + Prisma backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   └── server.ts       # Entry point
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
│
└── frontend/               # SvelteKit frontend
    ├── src/
    │   ├── lib/
    │   │   ├── api/       # API clients
    │   │   ├── components/# Svelte components
    │   │   └── stores/    # State management
    │   └── routes/        # Pages
    └── package.json
```

## 🔌 API Endpoints

### POST /api/chat/message

Send message and get AI response

```json
{
  "sessionId": "uuid",
  "message": "Hello!"
}
```

### GET /api/chat/history/:sessionId

Get conversation history

```json
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "messages": [...]
  }
}
```

### POST /api/chat/session

Create new session

```json
{
  "success": true,
  "data": {
    "sessionId": "new-uuid"
  }
}
```

## 🗄️ Database Schema

```sql
-- Conversation table
CREATE TABLE "Conversation" (
  id UUID PRIMARY KEY,
  sessionId UUID UNIQUE,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Message table
CREATE TABLE "Message" (
  id UUID PRIMARY KEY,
  conversationId UUID REFERENCES "Conversation"(id),
  role VARCHAR(20),  -- 'user' or 'assistant'
  content TEXT,
  createdAt TIMESTAMP
);
```

## 🎨 Tech Stack

### Frontend

- **SvelteKit** - Full-stack Svelte framework
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool

### Backend

- **Express.js** - Minimalist web framework
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Robust relational database
- **Google Gemini AI** - Advanced AI model
- **TypeScript** - Type-safe JavaScript
- **Express Validator** - Validation middleware

## 🔧 Development

### Backend Commands

```bash
npm run dev            # Start development server
npm run build          # Build for production
npm start              # Start production server
npm run prisma:studio  # Open Prisma Studio
```

### Frontend Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run check    # Type checking
```

## 📝 Environment Variables

### Backend (.env)

```env
DATABASE_URL="postgresql://..."
GEMINI_API_KEY="your_key"
PORT=3001
NODE_ENV=development
```

### Frontend (.env)

```env
PUBLIC_API_URL=http://localhost:3001
```

## 🚢 Deployment

### Backend Deployment

1. Set production environment variables
2. Build: `npm run build`
3. Run migrations: `npm run prisma:migrate`
4. Start: `npm start`

### Frontend Deployment

1. Set PUBLIC_API_URL to production backend URL
2. Build: `npm run build`
3. Deploy `build/` directory to hosting service

### Hosting Recommendations

- **Backend:** Railway, Render, Heroku, AWS
- **Frontend:** Vercel, Netlify, Cloudflare Pages
- **Database:** Railway, Supabase, Neon

## 🔒 Security Considerations

- API key stored in environment variables
- Input validation on all endpoints
- CORS configured for specific origins
- SQL injection protected by Prisma
- XSS protection with proper escaping

## 🐛 Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists

### Gemini API Errors

- Verify API key is correct
- Check API quota limits
- Review error logs

### CORS Errors

- Check PUBLIC_API_URL matches backend
- Verify backend CORS configuration
- Check browser console for details

## 📚 Additional Documentation

- [Backend README](backend/README.md) - Detailed backend documentation
- [Frontend README](frontend/README.md) - Detailed frontend documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ for learning and demonstration purposes.

---

**Need Help?** Check the individual README files in [backend/](backend/README.md) and [frontend/](frontend/README.md) for more detailed documentation.
