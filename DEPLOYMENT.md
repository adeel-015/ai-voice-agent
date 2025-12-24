# Deployment Guide

This guide provides step-by-step instructions for deploying the AI Chat Agent to GitHub, Render (backend), and Netlify (frontend).

## Prerequisites

- GitHub account
- Render account (https://render.com)
- Netlify account (https://netlify.com)
- PostgreSQL database (you can use Render's PostgreSQL service)
- Google Gemini API key

---

## Step 1: Push to GitHub

### 1.1 Initialize Git Repository (if not already done)

```bash
cd /Users/adeeljaved/Documents/assignment/spur
git init
```

### 1.2 Add Remote Repository

Create a new repository on GitHub (https://github.com/new), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### 1.3 Commit and Push

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit: AI Chat Agent with Express, Prisma, SvelteKit"

# Push to GitHub
git push -u origin main
```

If you're on master branch instead of main:
```bash
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

### 2.1 Create PostgreSQL Database

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: spur-chat-db
   - **Database**: spur
   - **User**: (auto-generated)
   - **Region**: Choose closest to you
   - **Plan**: Free
4. Click **"Create Database"**
5. **Copy the Internal Database URL** (starts with `postgresql://`)

### 2.2 Deploy Backend Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: spur-chat-backend
   - **Region**: Same as database
   - **Branch**: main
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Add Environment Variables**:
   Click **"Advanced"** → **"Add Environment Variable"**
   
   ```
   NODE_ENV = production
   DATABASE_URL = [Paste the Internal Database URL from Step 2.1]
   GEMINI_API_KEY = [Your Gemini API Key]
   PORT = 3001
   FRONTEND_URL = [Leave empty for now, add after frontend deployment]
   ```

6. Click **"Create Web Service"**

7. **Wait for deployment** (5-10 minutes)

8. **Copy the backend URL** (e.g., `https://spur-chat-backend.onrender.com`)

### 2.3 Run Database Migrations

After the first deployment:

1. Go to your service dashboard
2. Click **"Shell"** tab
3. Run: `npx prisma db push`

---

## Step 3: Deploy Frontend to Netlify

### 3.1 Update Frontend Environment

Before deploying, update the API URL in your frontend code:

1. Open `frontend/src/lib/api/chat.ts`
2. Change the `API_BASE_URL` to your Render backend URL:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://spur-chat-backend.onrender.com";
```

3. Commit and push:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

### 3.2 Deploy to Netlify

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Select your repository
5. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Branch**: main

6. **Add Environment Variables**:
   Click **"Site settings"** → **"Environment variables"** → **"Add a variable"**
   
   ```
   VITE_API_URL = [Your Render backend URL, e.g., https://spur-chat-backend.onrender.com]
   ```

7. Click **"Deploy site"**

8. **Wait for deployment** (2-5 minutes)

9. **Copy the frontend URL** (e.g., `https://spur-chat.netlify.app`)

---

## Step 4: Update CORS Settings

Now update the backend CORS to allow your frontend domain:

### 4.1 Update Environment Variable on Render

1. Go to your backend service on Render
2. Click **"Environment"** tab
3. Update **FRONTEND_URL**:
   ```
   FRONTEND_URL = https://your-app.netlify.app
   ```
4. Click **"Save Changes"**
5. Service will automatically redeploy

---

## Step 5: Verify Deployment

### 5.1 Test Backend

```bash
curl https://spur-chat-backend.onrender.com/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

### 5.2 Test Frontend

1. Open your Netlify URL in a browser
2. Click the chat button
3. Send a test message
4. Verify you get an AI response

---

## Quick Reference: Update & Redeploy

### Update Code and Redeploy

```bash
# Make your changes
git add .
git commit -m "Your change description"
git push

# Render and Netlify will auto-deploy from GitHub
```

### View Logs

- **Render**: Dashboard → Your Service → "Logs" tab
- **Netlify**: Dashboard → Your Site → "Deploys" → Click latest deploy → "Deploy log"

### Rollback

- **Render**: Dashboard → Your Service → "Events" → Click previous deploy → "Rollback to this version"
- **Netlify**: Dashboard → Your Site → "Deploys" → Click previous deploy → "Publish deploy"

---

## Common Issues

### Backend 500 Errors

1. Check Render logs
2. Verify DATABASE_URL is correct
3. Ensure `npx prisma db push` was run
4. Check GEMINI_API_KEY is valid

### Frontend CORS Errors

1. Verify FRONTEND_URL in Render matches your Netlify URL exactly
2. Include protocol (https://) and no trailing slash

### Database Connection Issues

1. Use **Internal Database URL** from Render PostgreSQL
2. Ensure database and service are in the same region
3. Check Render PostgreSQL is running (not paused)

---

## Cost Estimates

- **GitHub**: Free
- **Render Free Tier**:
  - Web Service: Free (750 hours/month, spins down after 15 min inactivity)
  - PostgreSQL: Free (90 days, then $7/month)
- **Netlify Free Tier**:
  - 100GB bandwidth/month
  - 300 build minutes/month

---

## Environment Variables Summary

### Backend (Render)
```env
NODE_ENV=production
DATABASE_URL=postgresql://...
GEMINI_API_KEY=AIzaSy...
PORT=3001
FRONTEND_URL=https://your-app.netlify.app
```

### Frontend (Netlify)
```env
VITE_API_URL=https://spur-chat-backend.onrender.com
```

---

## Support

For issues:
- Render Docs: https://render.com/docs
- Netlify Docs: https://docs.netlify.com
- GitHub Issues: Create an issue in your repository
