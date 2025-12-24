# Quick Deployment Checklist

Use this as a quick reference when deploying. For detailed instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## ✅ Step-by-Step Deployment Process

### 1. Push to GitHub (5 minutes)

```bash
# If you haven't created a GitHub repo yet:
# 1. Go to https://github.com/new
# 2. Create a new repository (e.g., "ai-chat")
# 3. Copy the repository URL

# Add remote and push
cd /Users/adeeljaved/Documents/assignment/
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**✓ Verify**: Visit your GitHub repo URL and confirm files are there

---

### 2. Deploy Database on Render (3 minutes)

1. Go to: https://dashboard.render.com
2. Click: **"New +"** → **"PostgreSQL"**
3. Fill in:
   - Name: `chat-db`
   - Database: `ai-chat-agent`
   - Region: Select closest
   - Plan: **Free**
4. Click: **"Create Database"**
5. **IMPORTANT**: Copy the **Internal Database URL** (looks like: `postgresql://...`)

**✓ Verify**: Database status shows "Available"

---

### 3. Deploy Backend on Render (10 minutes)

1. Go to: https://dashboard.render.com
2. Click: **"New +"** → **"Web Service"**
3. Click: **"Connect a repository"** (authorize GitHub if needed)
4. Select your repository
5. Fill in:

   - **Name**: `chat-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. Click **"Advanced"** button
7. Add Environment Variables:

```
NODE_ENV = production
DATABASE_URL = [Paste Internal DB URL from Step 2]
GEMINI_API_KEY = [Your Gemini API Key - get from .env file]
PORT = 3001
```

8. Click: **"Create Web Service"**
9. Wait for "Live" status (5-10 minutes)
10. **IMPORTANT**: Copy your backend URL (e.g., `https://chat-backend.onrender.com`)

**✓ Verify**: Visit `https://YOUR-BACKEND.onrender.com/health` - should return `{"status":"ok"}`

---

### 4. Initialize Database (2 minutes)

1. On Render dashboard, click your backend service
2. Click **"Shell"** tab (top right)
3. Run this command:

```bash
npx prisma db push
```

4. Wait for success message

**✓ Verify**: Should see "Your database is now in sync"

---

### 5. Deploy Frontend on Netlify (5 minutes)

1. Go to: https://app.netlify.com
2. Click: **"Add new site"** → **"Import an existing project"**
3. Click: **"Deploy with GitHub"**
4. Select your repository
5. Fill in:

   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `build`

6. Click: **"Add environment variables"**
7. Add:

```
PUBLIC_API_URL = [Your Render backend URL from Step 3]
```

Example: `PUBLIC_API_URL = https://chat-backend.onrender.com`

8. Click: **"Deploy"**
9. Wait for deployment (2-5 minutes)
10. **IMPORTANT**: Copy your Netlify URL (e.g., `https://chat.netlify.app`)

**✓ Verify**: Visit your Netlify URL - page should load

---

### 6. Update CORS (2 minutes)

1. Go back to Render dashboard
2. Click your backend service
3. Click **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Add:

```
FRONTEND_URL = [Your Netlify URL from Step 5]
```

Example: `FRONTEND_URL = https://chat.netlify.app`

6. Click **"Save Changes"**
7. Wait for auto-redeploy (~2 minutes)

**✓ Verify**: Service shows "Live" again

---

### 7. Test Everything (2 minutes)

1. Open your Netlify URL
2. Click the blue chat button (bottom right)
3. Type "Hello" and send
4. Should get an AI response within a few seconds

**✓ Success**: Chat is working!

---

## 🔄 Future Updates

When you make code changes:

```bash
git add .
git commit -m "Your change description"
git push
```

Both Render and Netlify will automatically redeploy from GitHub.

---

## 🚨 Troubleshooting

### Issue: "Failed to process message"

- Check Render logs: Dashboard → Service → Logs tab
- Verify GEMINI_API_KEY is correct
- Ensure database is running

### Issue: CORS error in browser

- Verify FRONTEND_URL matches Netlify URL exactly
- No trailing slash in URL
- Include https://

### Issue: 500 error on backend

- Check DATABASE_URL is correct (use Internal URL)
- Run `npx prisma db push` in Render shell
- Check logs for specific error

---

## 📋 URLs Checklist

After deployment, you should have:

- [ ] GitHub Repo: `https://github.com/USERNAME/REPO`
- [ ] Render Backend: `https://BACKEND-NAME.onrender.com`
- [ ] Netlify Frontend: `https://APP-NAME.netlify.app`
- [ ] Database: Render PostgreSQL (Internal URL)

---

## 💰 Cost

Everything is **FREE**:

- GitHub: Free unlimited public repos
- Render: Free tier (spins down after 15 min inactivity)
- Netlify: Free tier (100GB bandwidth/month)
- PostgreSQL: Free for 90 days, then $7/month

---

## 📞 Support

If stuck, check:

1. [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed guide
2. [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues
3. Render docs: https://render.com/docs
4. Netlify docs: https://docs.netlify.com
