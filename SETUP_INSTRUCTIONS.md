# 🎯 Setup Instructions - Project Management System

Complete walkthrough to get your system live on GitHub and Render in **15 minutes**.

---

## 📋 Prerequisites (5 minutes)

You'll need:

- ✅ **GitHub Account** (free) - https://github.com
- ✅ **Render Account** (free) - https://render.com
- ✅ **Git installed** - https://git-scm.com
- ✅ **Node.js 18+** - https://nodejs.org
- ✅ **This code** (already prepared for you)

### Verify Installation

```bash
# Terminal/Command Prompt
git --version
node --version

# Both should show version numbers
```

---

## 🚀 Phase 1: Create GitHub Repository (3 minutes)

### Step 1.1: Go to GitHub

1. Visit https://github.com/new
2. You'll see "Create a new repository" form

### Step 1.2: Fill in Details

| Field | Value |
|-------|-------|
| **Repository name** | `project-management-system` |
| **Description** | `Full-stack PM system with GitHub & Render integration` |
| **Visibility** | Public ✓ |
| **Initialize with** | ⚠️ **DO NOT CHECK** "Add a README" |

### Step 1.3: Create

Click **"Create repository"**

### Step 1.4: Copy Your Repository URL

You'll see a screen with:
```
https://github.com/YOUR_USERNAME/project-management-system.git
```

**Copy this URL** - you'll need it in Step 2

---

## 📤 Phase 2: Push Code to GitHub (3 minutes)

### Option A: Using Automated Script (Recommended)

#### On Mac/Linux:
```bash
# Download the files to your computer first
# Then in that folder, run:

chmod +x deploy.sh
./deploy.sh

# It will ask for:
# - GitHub username
# - Repository name
# - GitHub URL
# Then automatically push everything!
```

#### On Windows:
```bash
# Right-click folder → "Open PowerShell here"
# Or: Open Command Prompt in this folder

deploy.bat

# Follow the prompts
```

### Option B: Manual (if script doesn't work)

```bash
# 1. Navigate to folder with all the code
cd /path/to/project-management-system

# 2. Initialize git
git init
git add .
git commit -m "Initial commit: Project Management System"

# 3. Add GitHub remote (use the URL from Step 1.4)
git remote add origin https://github.com/YOUR_USERNAME/project-management-system.git
git branch -M main
git push -u origin main

# 4. GitHub may ask for credentials
#    If using HTTPS, you may need a Personal Access Token:
#    - Go to https://github.com/settings/tokens
#    - Create new token with "repo" scope
#    - Use token as password when prompted
```

### ✅ Verify
Go to your GitHub repo URL. You should see all files there! ✓

---

## 🔑 Phase 3: Create GitHub Token (2 minutes)

You need this for Render to access your GitHub repo.

### Step 3.1: Generate Token

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**

### Step 3.2: Configure Token

| Setting | Value |
|---------|-------|
| **Token name** | `project-management-api` |
| **Expiration** | 90 days (or No expiration) |
| **Scopes** | ✓ **repo** only |

### Step 3.3: Copy & Save

1. Click **"Generate token"**
2. **COPY the token immediately** (you only see it once!)
3. Save it somewhere safe (we'll need it in Phase 4)

**⚠️ Important**: Don't share this token! Treat it like a password.

---

## 🚀 Phase 4: Deploy to Render (5 minutes)

### Step 4.1: Create Backend Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect repository"**
4. Authorize Render with GitHub
5. Select `project-management-system`
6. Click **"Connect"**

### Step 4.2: Configure Backend

Fill in:

| Field | Value |
|-------|-------|
| **Name** | `project-management-api` |
| **Environment** | Node |
| **Region** | Ohio (or closest) |
| **Branch** | main |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | Free |

Click **"Create Web Service"**

**⏳ Wait for deployment** (2-3 minutes)

### Step 4.3: Create Frontend Service

1. Dashboard → **"New +"** → **"Static Site"**
2. Select your repository
3. Click **"Connect"**

Fill in:

| Field | Value |
|-------|-------|
| **Name** | `project-management-frontend` |
| **Branch** | main |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `build` |
| **Plan** | Free |

Click **"Create Static Site"**

**⏳ Wait for deployment** (2-3 minutes)

### Step 4.4: Create Database

1. Dashboard → **"New +"** → **"PostgreSQL"**

Fill in:

| Field | Value |
|-------|-------|
| **Name** | `project-management-db` |
| **Database** | `projects_db` |
| **User** | `postgres` |
| **Region** | Ohio (same as backend) |
| **Plan** | Free |

Click **"Create Database"**

**⏳ Wait for database creation** (1-2 minutes)

---

## ⚙️ Phase 5: Set Environment Variables (3 minutes)

### Step 5.1: Backend Environment Variables

1. Go to **project-management-api** service
2. Click **"Environment"** tab
3. Click **"+ Add Environment Variable"** for each:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `GITHUB_TOKEN` | Paste your token from Phase 3 |
| `CORS_ORIGIN` | `https://project-management-frontend.onrender.com` |
| `JWT_SECRET` | Any random string (32+ chars, e.g., `abc123xyz789...`) |
| `PORT` | `5000` |

4. Click **"Save Changes"**

### Step 5.2: Get Database URL

1. Go to **project-management-db** service
2. Copy the **External Database URL** 
3. Back to **project-management-api**
4. Add environment variable:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Paste the URL from project-management-db |

5. Click **"Save Changes"**

### Step 5.3: Frontend Environment Variables

1. Go to **project-management-frontend** service
2. Click **"Environment"** tab
3. Add:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://project-management-api.onrender.com` |

4. Click **"Save Changes"**

**⏳ Services will redeploy** (1-2 minutes)

---

## 🗄️ Phase 6: Initialize Database (2 minutes)

### Step 6.1: Connect to Database

1. Go to **project-management-db** service
2. Click **"Connections"** tab
3. Copy the **"psql" command**

### Step 6.2: Run Schema

In your terminal:

```bash
# Paste the psql command from Render
# Then run the schema file:

psql postgresql://user:password@host:5432/projects_db < database-schema.sql

# Or if using Render's interface:
# 1. Click "PostgreSQL Client" button in Render dashboard
# 2. Copy-paste from database-schema.sql file
# 3. Press Enter
```

### Step 6.3: Verify

```bash
# In psql prompt:
\dt

# Should show tables:
# users
# projects
# tasks
# team_members
# etc.
```

Type `\q` to exit psql.

---

## ✅ Phase 7: Test Everything (2 minutes)

### Test 7.1: Backend API

Open in browser:
```
https://project-management-api.onrender.com/health
```

Should show:
```json
{"status":"ok","timestamp":"..."}
```

### Test 7.2: Frontend

Visit:
```
https://project-management-frontend.onrender.com
```

Should load the dashboard with all tabs visible ✓

### Test 7.3: Create Test Project

In dashboard:
1. Click **"+ New Project"**
2. Fill in test project details
3. Click **"Create Project"**
4. Should appear in sidebar

### Test 7.4: GitHub Integration

1. Create new project with GitHub repo: `dynamic-apac/test-repo`
2. Go to **"GitHub"** tab
3. Should see issues from that repo (or "No issues" if repo is empty)

---

## 🎉 You're Done!

Your system is now **live and deployed**!

### 📍 Your URLs:

- **Frontend**: `https://project-management-frontend.onrender.com`
- **API**: `https://project-management-api.onrender.com`
- **GitHub Repo**: `https://github.com/YOUR_USERNAME/project-management-system`

### 🔄 Auto-Deployment

From now on:
1. Make changes locally
2. `git commit` and `git push`
3. Render auto-deploys within 2-3 minutes ✨

### 📚 Next Steps

1. **Customize**: Edit React components to match your branding
2. **Add Users**: Create user accounts in database
3. **Use It**: Create your first real tender project!

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Service failed to deploy"** | Check backend logs (Dashboard → Service → Logs) |
| **"Frontend is blank"** | Open browser console (F12) and check for errors |
| **"Can't connect to GitHub"** | Verify GITHUB_TOKEN in backend environment variables |
| **"Database connection error"** | Check DATABASE_URL format - should start with `postgresql://` |
| **CORS errors** | Verify CORS_ORIGIN matches your frontend URL exactly |
| **"psql: command not found"** | Install PostgreSQL client from https://postgresql.org/download |

---

## 📖 Documentation

After setup, read these for more details:

- **QUICK_START.md** - 5-minute overview
- **README.md** - Full feature documentation
- **API_REFERENCE.md** - All endpoints explained

---

## 🎓 What You Learned

✅ Created GitHub repository  
✅ Pushed code with Git  
✅ Deployed backend service  
✅ Deployed frontend service  
✅ Created PostgreSQL database  
✅ Configured environment variables  
✅ Initialized database schema  
✅ Tested live application  

**You now have a production-grade project management system! 🚀**

---

## 💡 Quick Tips

**For Future Deployments:**
```bash
# Make changes, then:
git add .
git commit -m "Description of changes"
git push origin main

# Render auto-deploys in 2-3 minutes!
```

**To Invite Team:**
1. Frontend URL → Share with team
2. They can create projects immediately
3. No login required (yet - you can add auth later)

**For Dynamic APAC:**
- Use for tender management
- Create project per RFQ
- Link to your GitHub repos for technical specs
- Track vendor responses

---

**Need help? Check logs in Render dashboard!** 📊

*Questions? Re-read the phase that's giving you trouble, or check documentation files.*

Good luck! 🎉
