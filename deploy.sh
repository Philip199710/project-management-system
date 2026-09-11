#!/bin/bash

# ============================================================================
# 🚀 Project Management System - Automated Deployment Script
# ============================================================================
# This script automates GitHub repo creation and Render deployment
# Run this ONCE after creating empty GitHub repo
#
# Prerequisites:
# 1. GitHub account with SSH or HTTPS configured
# 2. Render account at https://render.com
# ============================================================================

set -e  # Exit on error

echo ""
echo "════════════════════════════════════════════════════════════════════"
echo "  🎯 Project Management System - Deployment Setup"
echo "════════════════════════════════════════════════════════════════════"
echo ""

# ============ STEP 1: Verify Prerequisites ============

echo "📋 Checking prerequisites..."

if ! command -v git &> /dev/null; then
    echo "❌ Git not found. Please install Git from https://git-scm.com"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install from https://nodejs.org"
    exit 1
fi

echo "✅ Git and Node.js found"
echo ""

# ============ STEP 2: Get User Input ============

echo "📝 Please provide the following information:"
echo ""

read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter repository name (default: project-management-system): " REPO_NAME
REPO_NAME=${REPO_NAME:-"project-management-system"}

read -p "Enter your GitHub HTTPS URL (or press Enter to auto-generate): " GITHUB_URL
if [ -z "$GITHUB_URL" ]; then
    GITHUB_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
fi

echo ""
echo "📦 Repository Details:"
echo "  GitHub User: $GITHUB_USERNAME"
echo "  Repository: $REPO_NAME"
echo "  URL: $GITHUB_URL"
echo ""

read -p "Is this correct? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled. Please run script again."
    exit 1
fi

echo ""

# ============ STEP 3: Initialize Git Repository ============

echo "🔧 Setting up Git repository..."

if [ -d ".git" ]; then
    echo "⚠️  Git repo already initialized. Skipping..."
else
    git init
    git config user.name "$GITHUB_USERNAME" 2>/dev/null || true
    git add .
    git commit -m "Initial commit: Project Management System with GitHub & Render integration"
fi

echo "✅ Git repository initialized"
echo ""

# ============ STEP 4: Add Remote and Push ============

echo "📤 Connecting to GitHub..."

# Remove existing remote if present
git remote remove origin 2>/dev/null || true

git remote add origin "$GITHUB_URL"
git branch -M main

echo "Pushing to GitHub..."
echo "(You may be prompted to authenticate)"

git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Code pushed to GitHub successfully"
else
    echo "❌ Failed to push to GitHub"
    echo "   Make sure:"
    echo "   1. Repository exists at $GITHUB_URL"
    echo "   2. You have push permissions"
    echo "   3. GitHub credentials are configured (SSH or HTTPS)"
    exit 1
fi

echo ""

# ============ STEP 5: Generate Deployment Guide ============

cat > DEPLOYMENT_CHECKLIST.md << 'EOF'
# ✅ Post-GitHub Deployment Checklist

## You've completed:
- [x] Code pushed to GitHub
- [ ] Render backend service created
- [ ] Render frontend service created
- [ ] PostgreSQL database created
- [ ] Environment variables configured
- [ ] Database schema initialized
- [ ] Deployment tested

## Next Steps:

### 1. Create GitHub Token
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: `project-management-api`
4. Scopes: Select `repo` only
5. Copy the token (you'll only see it once!)

### 2. Create Render Services

#### Backend Service:
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: `project-management-api`
   - Branch: `main`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free

#### Frontend Service:
1. Click "New +" → "Static Site"
2. Connect repository
3. Configure:
   - Name: `project-management-frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`
   - Plan: Free

#### PostgreSQL Database:
1. Click "New +" → "PostgreSQL"
2. Configure:
   - Name: `project-management-db`
   - Plan: Free

### 3. Set Environment Variables

**For Backend:**
- `NODE_ENV` = `production`
- `GITHUB_TOKEN` = (your token from Step 1)
- `DATABASE_URL` = (copy from PostgreSQL service details)
- `CORS_ORIGIN` = `https://project-management-frontend.onrender.com`
- `JWT_SECRET` = (any random string, 32+ chars)
- `PORT` = `5000`

**For Frontend:**
- `REACT_APP_API_URL` = `https://project-management-api.onrender.com`

### 4. Initialize Database
```bash
# Connect to PostgreSQL from Render dashboard
psql postgresql://user:password@host:5432/projects_db

# Run schema
\i database-schema.sql
```

### 5. Test Deployment
- Visit frontend URL → Should load dashboard
- Check backend health: `https://your-api.onrender.com/health`
- Test GitHub integration: Create project with GitHub repo

## Support
- Backend issues? Check Render logs → Logs tab
- GitHub auth? Verify GITHUB_TOKEN in env vars
- Database errors? Check PostgreSQL connection URL

**You're almost there! 🎉**
EOF

echo "✅ Deployment checklist created: DEPLOYMENT_CHECKLIST.md"
echo ""

# ============ STEP 6: Summary ============

echo "════════════════════════════════════════════════════════════════════"
echo "  ✅ GitHub Setup Complete!"
echo "════════════════════════════════════════════════════════════════════"
echo ""
echo "📊 Next Steps:"
echo ""
echo "1. 🔐 Generate GitHub Token (for Render)"
echo "   → https://github.com/settings/tokens"
echo ""
echo "2. 🚀 Create Render Services"
echo "   → https://dashboard.render.com"
echo "   → Follow DEPLOYMENT_CHECKLIST.md"
echo ""
echo "3. 🗄️  Initialize Database"
echo "   → Run: psql ... -f database-schema.sql"
echo ""
echo "4. ✨ Deploy!"
echo "   → Services auto-deploy on git push"
echo ""
echo "📚 Documentation:"
echo "   • QUICK_START.md - 5-minute guide"
echo "   • DEPLOYMENT_GUIDE.md - Step-by-step"
echo "   • README.md - Full documentation"
echo ""
echo "📍 Repository URL:"
echo "   $GITHUB_URL"
echo ""
echo "════════════════════════════════════════════════════════════════════"
echo ""

read -p "Open deployment guide? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Try to open DEPLOYMENT_CHECKLIST.md
    if command -v xdg-open &> /dev/null; then
        xdg-open DEPLOYMENT_CHECKLIST.md
    elif command -v open &> /dev/null; then
        open DEPLOYMENT_CHECKLIST.md
    else
        echo "Please open DEPLOYMENT_CHECKLIST.md manually"
    fi
fi

echo ""
echo "🎉 Setup complete! Your code is now on GitHub."
echo ""
