# 🚀 Deployment Guide - Project Management System to Render

Complete step-by-step guide to deploy the application to Render with GitHub integration.

---

## 📋 Pre-Deployment Checklist

- [ ] GitHub repository created
- [ ] Code pushed to main branch
- [ ] Render account created (https://render.com)
- [ ] GitHub token generated
- [ ] Environment variables prepared
- [ ] Database schema ready

---

## Step 1: Prepare GitHub Repository

### 1.1 Create .gitignore
```bash
# Create .gitignore in root
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo "*.log" >> .gitignore
echo ".DS_Store" >> .gitignore
echo "build/" >> .gitignore
echo "dist/" >> .gitignore
```

### 1.2 Create GitHub Repository
```bash
git init
git add .
git commit -m "Initial commit: Project Management System"
git branch -M main
git remote add origin https://github.com/yourusername/project-management-system.git
git push -u origin main
```

### 1.3 Generate GitHub Token
1. Go to https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Name: `project-management-api`
4. Scopes: Select `repo` (full control of private repositories)
5. Copy the token (you'll only see it once!)
6. Store safely - you'll need it for environment variables

---

## Step 2: Create Render Services

### 2.1 Deploy Backend API

**Go to:** https://dashboard.render.com

1. Click **New +** button → **Web Service**
2. **Connect Repository**
   - Click "Connect repository"
   - Authorize Render with GitHub
   - Select your `project-management-system` repo
   - Click "Connect"

3. **Configure Service**
   - **Name**: `project-management-api`
   - **Environment**: Node
   - **Region**: Ohio (or closest to you)
   - **Branch**: main
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (upgrade later if needed)

4. Click **Create Web Service**

5. **Wait for deployment** (this may take 2-3 minutes)

### 2.2 Deploy Frontend (Static Site)

1. Back to dashboard → Click **New +** → **Static Site**
2. **Connect Repository**
   - Select the same repo
   - Click "Connect"

3. **Configure Service**
   - **Name**: `project-management-frontend`
   - **Root Directory**: Leave blank (or set to `public` if using CRA)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Plan**: Free

4. Click **Create Static Site**

> Note: If your frontend is in a separate folder:
> - Root Directory: `frontend`
> - Build Command: `cd frontend && npm install && npm run build`
> - Publish Directory: `frontend/build`

### 2.3 Create PostgreSQL Database

1. Dashboard → **New +** → **PostgreSQL**
2. **Configure Database**
   - **Name**: `project-management-db`
   - **Database**: `projects_db`
   - **User**: `postgres`
   - **Region**: Ohio (same as backend)
   - **Plan**: Free

3. Click **Create Database**
4. **Copy the connection string** - you'll need this

---

## Step 3: Configure Environment Variables

### 3.1 Backend Environment Variables

1. Go to **project-management-api** service
2. Click **Environment** tab
3. Add each variable (click **+ Add Environment Variable**):

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `GITHUB_TOKEN` | `ghp_xxxxxxxxxxxxx` (your GitHub token) |
| `DATABASE_URL` | (copy from PostgreSQL service) |
| `CORS_ORIGIN` | `https://project-management-frontend.onrender.com` |
| `JWT_SECRET` | Generate random string (32+ chars) |
| `PORT` | `5000` |

4. Click **Save Changes**

### 3.2 Frontend Environment Variables

1. Go to **project-management-frontend** service
2. Click **Environment** tab
3. Add variable:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://project-management-api.onrender.com` |

4. Click **Save Changes**

---

## Step 4: Initialize Database

### 4.1 Connect to PostgreSQL

1. Go to **project-management-db** service
2. Copy **External Database URL**
3. Open terminal and connect:

```bash
# Install PostgreSQL client (if not installed)
# macOS: brew install postgresql
# Windows: Download from https://www.postgresql.org/download/windows/
# Linux: sudo apt-get install postgresql-client

# Connect to database
psql postgresql://user:password@host:5432/projects_db
```

### 4.2 Run Schema

```bash
# Option 1: From psql prompt
\i database-schema.sql

# Option 2: From terminal
psql postgresql://user:password@host:5432/projects_db -f database-schema.sql

# Verify tables created
\dt
```

---

## Step 5: Test Deployment

### 5.1 Check Service Status

1. Go to each service dashboard
2. Look for green checkmark ✅
3. If red ❌, check deployment logs

### 5.2 Test Backend API

```bash
# Replace with your Render backend URL
curl https://project-management-api.onrender.com/health

# Should return:
# {"status":"ok","timestamp":"2024-09-11T..."}
```

### 5.3 Test Frontend

1. Visit: `https://project-management-frontend.onrender.com`
2. Should load dashboard
3. Check browser console for errors (F12)

### 5.4 Test GitHub Integration

1. In dashboard, create new project
2. Add a GitHub repo: `username/repo-name`
3. Check if issues load in GitHub tab

---

## Step 6: Configure Auto-Deployments

By default, Render auto-deploys on git push to main.

To verify:
1. Backend service → **Deployments** tab
2. Should see "Auto-deploy enabled"
3. Same for frontend

---

## 🔧 Troubleshooting

### Backend Deployment Fails

**Error**: "Cannot find module 'express'"
- **Solution**: Ensure `package.json` is in root directory
- Run locally: `npm install` should work

**Error**: "PORT is not defined"
- **Solution**: Check environment variables in Render
- Add `PORT=5000` in Environment tab

### Frontend Deployment Fails

**Error**: "Cannot find ./build directory"
- **Solution**: Build command must create `build/` folder
- Use: `npm install && npm run build`

**Error**: "REACT_APP_API_URL is not defined"
- **Solution**: Add to Frontend Environment Variables
- Format: `https://project-management-api.onrender.com`

### Database Connection Errors

**Error**: "connect ECONNREFUSED"
- **Solution**: 
  1. Check DATABASE_URL is correct
  2. Ensure PostgreSQL service is running (green checkmark)
  3. Wait 5 minutes after creating database
  4. Verify IP allowlist (should be empty for Render internal)

**Error**: "SSL: CERTIFICATE_VERIFY_FAILED"
- **Solution**: 
  1. Add `?sslmode=require` to connection string
  2. Or disable SSL locally, enable in production

### Frontend Can't Connect to API

**Error**: CORS error in console
- **Solution**:
  1. Check CORS_ORIGIN in backend environment
  2. Must be exact URL: `https://project-management-frontend.onrender.com`
  3. Restart backend after changing variables

**Error**: "Failed to fetch from API"
- **Solution**:
  1. Verify backend is running (visit `/health` endpoint)
  2. Check REACT_APP_API_URL in frontend environment
  3. Clear browser cache (Ctrl+Shift+Delete)

### GitHub Integration Not Working

**Error**: "401 Unauthorized"
- **Solution**:
  1. Check GITHUB_TOKEN is valid
  2. Verify token has correct scopes
  3. Generate new token if needed

**Error**: "404 Repository not found"
- **Solution**:
  1. Check repo format: `owner/repo-name`
  2. Verify repo is public (or token has private access)
  3. Check token permissions

---

## 📊 Monitoring & Maintenance

### View Logs

**Backend Logs:**
1. Service → **Logs** tab
2. Filter by date/time
3. Search for errors

**Frontend Logs:**
1. Service → **Logs** tab
2. Or open browser console (F12)

### Performance Monitoring

1. Service → **Metrics** tab
2. Monitor:
   - CPU usage
   - Memory usage
   - Response time
   - Error rate

### Restart Services

If something breaks:
1. Service → **Settings** tab
2. Click **Restart** button
3. Wait for redeployment

---

## 🚀 Advanced Configurations

### Enable HTTPS (Auto)

Render automatically provides SSL/TLS certificates. Your service is already HTTPS-enabled!

### Custom Domain

1. Service → **Settings** tab
2. **Custom Domain** section
3. Add your domain (e.g., `api.yourdomain.com`)
4. Follow DNS configuration instructions

### Scheduled Tasks

For database cleanup or backups:

1. Dashboard → **New +** → **Cron Job**
2. **Schedule**: `0 2 * * *` (2 AM daily)
3. **Command**: `npm run backup`
4. **Image**: `node:18-alpine`

### Environment-Specific Configs

Create different deployments for staging/production:

1. **Staging**: Deploy from `develop` branch
2. **Production**: Deploy from `main` branch
3. Different environment variables for each

---

## 📝 Post-Deployment Checklist

- [ ] Backend health check passes
- [ ] Frontend loads successfully
- [ ] Database connection works
- [ ] GitHub integration working (can fetch issues)
- [ ] Can create new project
- [ ] Can add team members
- [ ] Can upload documents
- [ ] Gantt chart renders
- [ ] Auto-deployment enabled
- [ ] Monitoring setup (optional)

---

## 🔒 Security Hardening (Optional)

### 1. IP Allowlist (Database)
If using Render PostgreSQL:
- Database → Settings → Firewall
- Add: `0.0.0.0/0` (for Render internal use)

### 2. Environment Secrets
Never commit `.env` file!
- Render stores secrets securely
- Each deployment gets fresh secrets
- Old secrets are not exposed

### 3. HTTPS Enforcement
Already enabled by Render. All traffic is encrypted.

### 4. Regular Updates
- Update dependencies monthly
- Check for security patches
- Run: `npm audit fix` before deploying

---

## 📞 Support Resources

**Render Support:**
- Dashboard → **Help** → **Support Chat**
- Email: support@render.com

**Application Issues:**
- Check logs in Render dashboard
- Review GitHub issues in repository
- Test locally with `npm start`

**GitHub API Issues:**
- GitHub API docs: https://docs.github.com/en/rest
- Check rate limits (60 requests/hour for unauthenticated)

---

## 🎯 Next Steps

1. **Customize Settings**
   - Update project name in `package.json`
   - Customize branding in React components

2. **Add User Authentication**
   - Implement JWT tokens
   - Add login page
   - Protect API routes

3. **Connect to Real Database**
   - Run full schema with data validation
   - Implement backup strategy
   - Set up monitoring

4. **Add More Features**
   - Real-time notifications
   - Email integration
   - Advanced analytics

---

## 📚 Documentation

- [Render Documentation](https://render.com/docs)
- [Node.js Best Practices](https://nodejs.org/en/docs/)
- [PostgreSQL Deployment](https://www.postgresql.org/docs/)
- [React Deployment](https://react.dev/learn)

---

**Deployment Complete! 🎉**

Your Project Management System is now live on Render!

**URLs:**
- **Frontend**: `https://project-management-frontend.onrender.com`
- **API**: `https://project-management-api.onrender.com`
- **Database**: Connected via environment variables

---

*Last Updated: 2026-09-11*
