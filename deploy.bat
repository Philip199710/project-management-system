@echo off
REM ============================================================================
REM  Project Management System - Windows Deployment Script
REM ============================================================================
REM  This script automates GitHub repo creation and Render deployment
REM  
REM  Prerequisites:
REM  1. Git installed (https://git-scm.com)
REM  2. Node.js installed (https://nodejs.org)
REM  3. GitHub account
REM  4. Render account (https://render.com)
REM ============================================================================

setlocal enabledelayedexpansion

cls
echo.
echo ========================================================================
echo   Project Management System - Deployment Setup
echo ========================================================================
echo.

REM Check for Git
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Git not found. Please install from https://git-scm.com
    pause
    exit /b 1
)

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js not found. Please install from https://nodejs.org
    pause
    exit /b 1
)

echo OK: Git and Node.js found
echo.

REM Get user input
set /p GITHUB_USERNAME="Enter your GitHub username: "
set /p REPO_NAME="Enter repository name (default: project-management-system): "

if "!REPO_NAME!"=="" (
    set REPO_NAME=project-management-system
)

set /p GITHUB_URL="Enter GitHub HTTPS URL (or press Enter to auto-generate): "

if "!GITHUB_URL!"=="" (
    set GITHUB_URL=https://github.com/!GITHUB_USERNAME!/!REPO_NAME!.git
)

echo.
echo Repository Details:
echo   GitHub User: !GITHUB_USERNAME!
echo   Repository: !REPO_NAME!
echo   URL: !GITHUB_URL!
echo.

set /p CONFIRM="Is this correct? (y/n): "

if /i not "!CONFIRM!"=="y" (
    echo Cancelled.
    pause
    exit /b 1
)

echo.
echo Setting up Git repository...

REM Initialize git if not already done
if not exist .git (
    call git init
    call git config user.name "!GITHUB_USERNAME!" 2>nul
    call git add .
    call git commit -m "Initial commit: Project Management System with GitHub ^& Render integration"
) else (
    echo Warning: Git repo already initialized. Skipping...
)

echo OK: Git repository initialized
echo.

echo Connecting to GitHub...

REM Remove existing remote
for /f %%i in ('git remote') do (
    if "%%i"=="origin" (
        call git remote remove origin
    )
)

call git remote add origin !GITHUB_URL!
call git branch -M main

echo Pushing to GitHub...
echo (You may be prompted to authenticate)
echo.

call git push -u origin main

if %ERRORLEVEL% neq 0 (
    echo.
    echo Error: Failed to push to GitHub
    echo Make sure:
    echo   1. Repository exists at !GITHUB_URL!
    echo   2. You have push permissions
    echo   3. GitHub credentials are configured
    pause
    exit /b 1
)

echo OK: Code pushed to GitHub successfully
echo.

REM Create deployment checklist
(
echo # Deployment Checklist
echo.
echo ## You've completed:
echo - [x] Code pushed to GitHub
echo - [ ] Render backend service created
echo - [ ] Render frontend service created
echo - [ ] PostgreSQL database created
echo - [ ] Environment variables configured
echo - [ ] Database schema initialized
echo.
echo ## Next Steps:
echo.
echo ### 1. Create GitHub Token
echo 1. Go to https://github.com/settings/tokens
echo 2. Click "Generate new token (classic)"
echo 3. Name: `project-management-api`
echo 4. Scopes: Select `repo` only
echo 5. Copy token and save somewhere safe
echo.
echo ### 2. Create Render Services
echo - Backend: https://dashboard.render.com ^(Web Service^)
echo - Frontend: https://dashboard.render.com ^(Static Site^)
echo - Database: https://dashboard.render.com ^(PostgreSQL^)
echo.
echo ### 3. Set Environment Variables
echo **Backend:**
echo - NODE_ENV = production
echo - GITHUB_TOKEN = your_token_here
echo - DATABASE_URL = from PostgreSQL service
echo - CORS_ORIGIN = https://project-management-frontend.onrender.com
echo.
echo **Frontend:**
echo - REACT_APP_API_URL = https://project-management-api.onrender.com
echo.
echo See DEPLOYMENT_GUIDE.md for detailed steps
) > DEPLOYMENT_CHECKLIST.md

echo OK: Deployment checklist created
echo.

echo ========================================================================
echo   GitHub Setup Complete!
echo ========================================================================
echo.
echo Next Steps:
echo.
echo 1. Generate GitHub Token
echo    https://github.com/settings/tokens
echo.
echo 2. Create Render Services
echo    https://dashboard.render.com
echo.
echo 3. Initialize Database
echo    Run: psql -f database-schema.sql
echo.
echo Repository URL:
echo   !GITHUB_URL!
echo.
echo Documentation:
echo   - QUICK_START.md (5 minutes)
echo   - DEPLOYMENT_GUIDE.md (step-by-step)
echo   - README.md (full docs)
echo.
echo ========================================================================
echo.

pause
