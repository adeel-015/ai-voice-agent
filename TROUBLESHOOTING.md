# Troubleshooting Guide

Common issues and their solutions for the AI Chat Agent.

## 🔴 Backend Issues

### Issue: "Cannot connect to database"

**Symptoms:**

```
Error: Can't reach database server at `localhost:5432`
```

**Solutions:**

1. **Check if PostgreSQL is running:**

   ```bash
   # macOS with Homebrew
   brew services list

   # Start PostgreSQL if needed
   brew services start postgresql@15
   ```

2. **Verify database exists:**

   ```bash
   psql postgres
   \l                    # List databases
   CREATE DATABASE chatdb;  # If it doesn't exist
   \q
   ```

3. **Check DATABASE_URL format:**

   ```env
   # Correct format
   DATABASE_URL="postgresql://username:password@localhost:5432/chatdb?schema=public"

   # Common mistakes:
   # - Missing schema parameter
   # - Wrong username/password
   # - Wrong database name
   ```

4. **Test connection:**
   ```bash
   cd backend
   npx prisma db pull
   ```

---

### Issue: "Invalid API key configuration"

**Symptoms:**

```
Error: Invalid API key configuration
```

**Solutions:**

1. **Check .env file:**

   ```bash
   cd backend
   cat .env | grep GEMINI
   ```

2. **Verify API key is valid:**

   - Go to https://makersuite.google.com/app/apikey
   - Generate new key if needed
   - Copy without extra spaces

3. **Correct format in .env:**

   ```env
   GEMINI_API_KEY=AIza...your_key_here
   # NO quotes, NO spaces
   ```

4. **Restart server after changing .env:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

---

### Issue: "Port 3001 already in use"

**Symptoms:**

```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solutions:**

1. **Find process using port:**

   ```bash
   lsof -i :3001
   ```

2. **Kill the process:**

   ```bash
   kill -9 <PID>
   ```

3. **Or use different port:**

   ```env
   # In backend/.env
   PORT=3002
   ```

   ```env
   # Update frontend/.env
   PUBLIC_API_URL=http://localhost:3002
   ```

---

### Issue: "Prisma client not generated"

**Symptoms:**

```
Error: Cannot find module '@prisma/client'
```

**Solutions:**

```bash
cd backend
npm install
npm run prisma:generate
```

---

### Issue: "Migration failed"

**Symptoms:**

```
Error: Migration failed to apply cleanly
```

**Solutions:**

1. **Reset database (WARNING: Deletes all data):**

   ```bash
   cd backend
   npx prisma migrate reset
   ```

2. **Create new migration:**

   ```bash
   npx prisma migrate dev --name init
   ```

3. **Force push schema (dev only):**
   ```bash
   npx prisma db push
   ```

---

## 🟡 Frontend Issues

### Issue: "Cannot read properties of undefined"

**Symptoms:**

```
Cannot read properties of undefined (reading 'data')
```

**Solutions:**

1. **Check if backend is running:**

   ```bash
   curl http://localhost:3001/health
   ```

2. **Verify API URL:**

   ```bash
   cd frontend
   cat .env
   # Should be: PUBLIC_API_URL=http://localhost:3001
   ```

3. **Check browser console:**
   - Open DevTools (F12)
   - Look for network errors
   - Check if requests are being sent

---

### Issue: "CORS error"

**Symptoms:**

```
Access to fetch at 'http://localhost:3001/api/chat/message' from origin
'http://localhost:5173' has been blocked by CORS policy
```

**Solutions:**

1. **Verify backend CORS config:**
   Edit `backend/src/server.ts`:

   ```typescript
   app.use(
     cors({
       origin: "http://localhost:5173", // Must match frontend URL
       credentials: true,
     })
   );
   ```

2. **Restart backend server**

3. **Check if frontend URL is correct:**
   - Should be exactly `http://localhost:5173`
   - No trailing slash

---

### Issue: "Module not found: $env/static/public"

**Symptoms:**

```
Error: Cannot find module '$env/static/public'
```

**Solutions:**

1. **Ensure .env exists:**

   ```bash
   cd frontend
   ls -la .env
   ```

2. **Run dev server (generates .svelte-kit):**

   ```bash
   npm run dev
   ```

3. **Clean and reinstall:**
   ```bash
   rm -rf .svelte-kit node_modules
   npm install
   npm run dev
   ```

---

### Issue: "Chat widget not showing"

**Symptoms:**

- Button not visible
- Widget doesn't open

**Solutions:**

1. **Check if ChatWidget is imported:**
   Verify `frontend/src/routes/+layout.svelte`:

   ```svelte
   <script lang="ts">
     import ChatWidget from '$lib/components/ChatWidget.svelte';
   </script>

   <slot />
   <ChatWidget />
   ```

2. **Check browser console for errors**

3. **Verify z-index:**
   Widget should have `z-50` class

4. **Clear browser cache:**
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

---

### Issue: "Messages not persisting"

**Symptoms:**

- Messages disappear on refresh
- History not loading

**Solutions:**

1. **Check localStorage:**

   ```javascript
   // In browser console
   localStorage.getItem("chat_session_id");
   ```

2. **Verify session ID is being set:**

   - Open DevTools
   - Application tab → Local Storage
   - Should see `chat_session_id`

3. **Check network requests:**
   - Network tab in DevTools
   - Verify `/api/chat/history/:sessionId` is being called
   - Check response

---

## 🟢 General Issues

### Issue: "npm install fails"

**Symptoms:**

```
npm ERR! code ERESOLVE
```

**Solutions:**

1. **Use correct Node version:**

   ```bash
   node --version  # Should be 18 or higher
   ```

2. **Clear npm cache:**

   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Try with legacy peer deps:**
   ```bash
   npm install --legacy-peer-deps
   ```

---

### Issue: "TypeScript errors"

**Symptoms:**

```
TS2304: Cannot find name 'X'
```

**Solutions:**

1. **Restart TypeScript server:**

   - VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"

2. **Check tsconfig.json exists**

3. **Reinstall dependencies:**
   ```bash
   npm install
   ```

---

## 🔍 Debugging Tips

### Enable Verbose Logging

**Backend:**

```typescript
// In backend/src/config/database.ts
const prisma = new PrismaClient({
  log: ["query", "error", "warn", "info"], // More detailed logs
});
```

**Frontend:**

```javascript
// In browser console
localStorage.setItem("debug", "*");
```

---

### Check API Responses

**Using cURL:**

```bash
# Health check
curl http://localhost:3001/health

# Create session
curl -X POST http://localhost:3001/api/chat/session

# Send message
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-uuid","message":"hello"}'
```

---

### Database Inspection

**Using Prisma Studio:**

```bash
cd backend
npm run prisma:studio
```

Opens GUI at http://localhost:5555

**Using psql:**

```bash
psql chatdb
\dt                    # List tables
SELECT * FROM "Conversation";
SELECT * FROM "Message";
\q
```

---

## 📊 Performance Issues

### Issue: "Slow AI responses"

**Solutions:**

1. **Check internet connection**
2. **Verify Gemini API status**
3. **Reduce context window:**
   ```typescript
   // In backend/src/services/gemini.service.ts
   .slice(-5)  // Use last 5 messages instead of 10
   ```

---

### Issue: "Database queries slow"

**Solutions:**

1. **Add database indexes:**

   ```prisma
   // In prisma/schema.prisma
   @@index([sessionId])
   @@index([createdAt])
   ```

2. **Limit message history:**
   ```typescript
   // In backend/src/services/chat.service.ts
   take: 50,  // Reduce from 20 to fewer messages
   ```

---

## 🆘 Still Having Issues?

### Collect Information

1. **Node version:**

   ```bash
   node --version
   npm --version
   ```

2. **OS information:**

   ```bash
   uname -a  # macOS/Linux
   ```

3. **Error logs:**

   - Backend: Check terminal output
   - Frontend: Check browser console (F12)

4. **Database status:**
   ```bash
   psql -c "SELECT version();"
   ```

### Reset Everything (Last Resort)

```bash
# Stop all servers

# Backend
cd backend
rm -rf node_modules dist
npm install
rm -rf prisma/migrations
npx prisma migrate dev --name init
npm run dev

# Frontend
cd ../frontend
rm -rf node_modules .svelte-kit build
npm install
npm run dev
```

---

## ✅ Verification Checklist

Before reporting an issue, verify:

- [ ] PostgreSQL is running
- [ ] backend/.env has correct values
- [ ] frontend/.env exists
- [ ] Both backend and frontend dependencies installed
- [ ] Prisma client generated
- [ ] Database migrations run
- [ ] Backend server running on 3001
- [ ] Frontend server running on 5173
- [ ] No errors in terminal
- [ ] No errors in browser console
- [ ] Correct Node.js version (18+)

---

## 💡 Best Practices

1. **Always check both terminals** (backend and frontend)
2. **Clear browser cache** when changing environment variables
3. **Restart servers** after .env changes
4. **Check Network tab** in DevTools for API errors
5. **Read error messages carefully** - they usually tell you what's wrong
6. **Use git** to track changes and revert if needed

---

## 📞 Getting Help

If you're still stuck:

1. Check the main [README.md](README.md)
2. Review [SETUP_GUIDE.md](SETUP_GUIDE.md)
3. Check [API_REFERENCE.md](API_REFERENCE.md)
4. Search for the error message online
5. Check project GitHub issues (if applicable)
