# ⚡ Quick Start Checklist

Get your AI Chat Agent running in minutes!

## 📋 Pre-flight Checklist

### System Requirements

- [ ] Node.js 18+ installed
- [ ] npm installed
- [ ] PostgreSQL installed and running
- [ ] Google Gemini API key obtained

### Verify Installations

```bash
# Check Node.js (should be 18+)
node --version

# Check npm
npm --version

# Check PostgreSQL (should connect)
psql --version

# Check if PostgreSQL is running (macOS)
brew services list | grep postgresql
```

---

## 🚀 Setup Steps

### Step 1: Backend Configuration ⏱️ 5 minutes

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Edit .env with your credentials
# Required fields:
#   - DATABASE_URL (PostgreSQL connection)
#   - GEMINI_API_KEY (from Google AI Studio)
```

**Edit `backend/.env`:**

```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/chatdb?schema=public"
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
PORT=3001
NODE_ENV=development
```

**Generate Prisma and setup database:**

```bash
npm run prisma:generate
npm run prisma:migrate
```

✅ **Test backend:**

```bash
npm run dev
# Should see: "🚀 Server running on port 3001"
```

---

### Step 2: Frontend Configuration ⏱️ 2 minutes

**Open new terminal:**

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Environment is already configured (.env exists)
```

✅ **Test frontend:**

```bash
npm run dev
# Should see: "Local: http://localhost:5173"
```

---

### Step 3: Verify Everything Works ⏱️ 1 minute

1. **Open browser:** http://localhost:5173
2. **Click chat button** (blue circle, bottom-right)
3. **Send test message:** "Hello!"
4. **Wait for AI response**
5. **Refresh page** - history should persist

✅ **Success!** You now have a working AI chat agent!

---

## 🎯 Common First-Time Issues

### Issue 1: PostgreSQL not running

```bash
# macOS
brew services start postgresql@15

# Create database
createdb chatdb
```

### Issue 2: Wrong Gemini API key

1. Go to https://makersuite.google.com/app/apikey
2. Create/copy API key
3. Update `backend/.env`
4. Restart backend: `npm run dev`

### Issue 3: Port already in use

```bash
# Find and kill process on port 3001
lsof -i :3001
kill -9 <PID>

# Or use different port in backend/.env
PORT=3002
```

---

## 📁 Quick Reference

### File Locations

```
/Users/adeeljaved/Documents/assignment/spur/
├── backend/.env              ← Configure this!
├── frontend/.env             ← Already configured
├── setup.sh                  ← Automated setup
├── README.md                 ← Main docs
├── SETUP_GUIDE.md           ← Detailed guide
├── TROUBLESHOOTING.md       ← Problem solving
├── API_REFERENCE.md         ← API docs
└── ARCHITECTURE.md          ← System design
```

### Important Commands

**Backend:**

```bash
cd backend
npm run dev              # Start dev server
npm run prisma:studio    # Open database GUI
npm run prisma:migrate   # Run migrations
```

**Frontend:**

```bash
cd frontend
npm run dev              # Start dev server
npm run build            # Build for production
```

---

## ✅ Final Verification

Run these tests to ensure everything works:

### 1. Backend Health Check

```bash
curl http://localhost:3001/health
# Expected: {"status":"ok","timestamp":"..."}
```

### 2. Create Session

```bash
curl -X POST http://localhost:3001/api/chat/session
# Expected: {"success":true,"data":{"sessionId":"..."}}
```

### 3. Send Message

```bash
# Use sessionId from step 2
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"YOUR_SESSION_ID","message":"test"}'
# Expected: {"success":true,"data":{"reply":"...","messageId":"..."}}
```

### 4. Frontend Test

1. Open http://localhost:5173
2. Click chat button
3. Send "Hello"
4. Verify AI response appears
5. Refresh page
6. Verify history persists

---

## 🎓 Next Steps

### Learn the Codebase

1. **Read documentation:**

   - Start with [README.md](README.md)
   - Review [ARCHITECTURE.md](ARCHITECTURE.md)
   - Check [API_REFERENCE.md](API_REFERENCE.md)

2. **Explore code:**

   - Backend: `backend/src/`
   - Frontend: `frontend/src/`
   - Database: `backend/prisma/schema.prisma`

3. **Customize:**
   - Change AI prompt: `backend/src/services/gemini.service.ts`
   - Modify UI: `frontend/src/lib/components/ChatWidget.svelte`
   - Add features: Follow existing patterns

### Suggested Improvements

- [ ] Add user authentication
- [ ] Implement rate limiting
- [ ] Add message editing
- [ ] Support file uploads
- [ ] Add conversation topics
- [ ] Implement conversation search
- [ ] Add export conversation feature
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Mobile app version

---

## 📚 Documentation Overview

| Document                                 | Purpose           | When to Use             |
| ---------------------------------------- | ----------------- | ----------------------- |
| [README.md](README.md)                   | Project overview  | First time setup        |
| [SETUP_GUIDE.md](SETUP_GUIDE.md)         | Detailed setup    | Comprehensive guide     |
| [API_REFERENCE.md](API_REFERENCE.md)     | API documentation | Building integrations   |
| [ARCHITECTURE.md](ARCHITECTURE.md)       | System design     | Understanding structure |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Problem solving   | When issues occur       |
| **THIS FILE**                            | Quick start       | Getting running fast    |

---

## 🆘 Getting Help

**If something doesn't work:**

1. ✅ Check this checklist again
2. 📖 Read [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. 🔍 Check terminal for error messages
4. 🌐 Check browser console (F12)
5. 📊 Verify database with Prisma Studio

**Still stuck?**

- Review error messages carefully
- Check all environment variables
- Restart both servers
- Clear browser cache
- Try the automated setup: `./setup.sh`

---

## ⚡ Speed Run (for experienced developers)

```bash
# Backend
cd backend && npm i && cp .env.example .env
# Edit .env with DB + API key
npm run prisma:generate && npm run prisma:migrate && npm run dev &

# Frontend
cd ../frontend && npm i && npm run dev &

# Open
open http://localhost:5173
```

---

## 🎉 You're All Set!

Your AI Chat Agent is now running. Features:

- ✅ Floating chat widget
- ✅ AI-powered responses
- ✅ Persistent conversations
- ✅ Auto-scrolling messages
- ✅ Typing indicators
- ✅ Error handling
- ✅ Session management

**Enjoy building with your AI chat agent!** 🚀

---

## 📊 Success Indicators

You'll know everything is working when:

- ✅ Backend terminal shows "Server running on port 3001"
- ✅ Frontend terminal shows "Local: http://localhost:5173"
- ✅ Browser shows the demo page
- ✅ Chat button is visible (bottom-right)
- ✅ Clicking button opens chat widget
- ✅ Messages send successfully
- ✅ AI responds within 2-5 seconds
- ✅ History persists on page refresh
- ✅ No errors in browser console
- ✅ No errors in terminal

**All green? Perfect! You're ready to go! 🎯**
