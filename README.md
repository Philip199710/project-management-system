# 🎯 Project Management System

A comprehensive, full-stack project management platform built on **Node.js + React**, with **GitHub integration**, **Gantt charts**, **team collaboration**, and **tender management** features.

**Deploy to Render in minutes** • **Built for Dynamic APAC** • **GitHub-native workflows**

---

## 🌟 Features

### 📊 Core Features
- **Projects Dashboard**: Overview of all active projects with progress tracking
- **Gantt Charts**: Visual timeline representation of tasks and milestones
- **Team Collaboration**: Assign team members, track deliverables
- **Document Management**: Store and version project documents
- **Budget Tracking**: Monitor project budgets and costs

### 🐙 GitHub Integration
- Link GitHub repositories to projects
- Real-time issue and pull request tracking
- Sync GitHub milestones with project tasks
- Automatic issue-to-task mapping

### 📈 Tender/RFQ Management
- Create tenders as projects
- Assign team members to specific tasks/sections
- Track deliverable uploads by team member
- Budget breakdown (labor, materials, contingency)
- Document versioning and approval workflow

### 👥 Team Management
- Team member profiles and roles
- Task assignment and tracking
- Contribution visibility
- Email notifications

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (required)
- npm or yarn
- GitHub account (for OAuth/API integration)
- Render account (for deployment)

### Local Development

#### 1. Clone and Setup
```bash
git clone https://github.com/yourusername/project-management-system.git
cd project-management-system

# Install backend dependencies
npm install

# Install frontend dependencies (in a separate terminal or folder)
npm install -g create-react-app
cd frontend
npm install
```

#### 2. Environment Configuration
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your GitHub token
# Get token from: https://github.com/settings/tokens
# Required scopes: repo, read:user
GITHUB_TOKEN=ghp_your_token_here
```

#### 3. Run Locally
```bash
# Terminal 1 - Backend (port 5000)
npm start

# Terminal 2 - Frontend (port 3000)
cd frontend
npm start
```

Visit: http://localhost:3000

---

## 📦 Deployment to Render

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Project Management System"
git remote add origin https://github.com/yourusername/project-management-system.git
git push -u origin main
```

### Step 2: Create Render Services

#### Backend Service (Node.js + Express)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect GitHub repository
4. Configure:
   - **Name**: `project-management-api`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or Starter for production)

#### Frontend Service (React)
1. Click **New +** → **Static Site**
2. Connect GitHub repository
3. Configure:
   - **Name**: `project-management-frontend`
   - **Build Command**: `npm install && npm run build` (if using separate frontend folder: `cd frontend && npm install && npm run build`)
   - **Publish Directory**: `build` (or `frontend/build`)
   - **Plan**: Free

#### Database (PostgreSQL)
1. Click **New +** → **PostgreSQL**
2. Configure:
   - **Name**: `project-management-db`
   - **Database**: `projects_db`
   - **Plan**: Free

### Step 3: Set Environment Variables

**For Backend Service:**
1. Go to Backend Service → Environment
2. Add variables:
   ```
   NODE_ENV=production
   GITHUB_TOKEN=ghp_your_token_here
   DATABASE_URL=(copy from PostgreSQL service)
   CORS_ORIGIN=https://project-management-frontend.onrender.com
   PORT=5000
   ```

**For Frontend Service:**
1. Go to Frontend Service → Environment
2. Add variables:
   ```
   REACT_APP_API_URL=https://project-management-api.onrender.com
   ```

### Step 4: Deploy
- Both services will auto-deploy on git push to `main`
- View deployment logs in Render Dashboard
- Access your app at: `https://project-management-frontend.onrender.com`

---

## 📊 API Endpoints

### Projects
```
POST   /api/projects              # Create project
GET    /api/projects              # Get all projects
GET    /api/projects/:id          # Get project details
PUT    /api/projects/:id          # Update project
```

### Tasks & Deliverables
```
POST   /api/projects/:id/tasks    # Add task
GET    /api/projects/:id/tasks    # Get project tasks (Gantt)
PUT    /api/projects/:id/tasks/:taskId  # Update task
```

### GitHub Integration
```
GET    /api/github/:owner/:repo                # Get repo info
GET    /api/github/:owner/:repo/issues         # Get issues
GET    /api/github/:owner/:repo/pulls          # Get pull requests
POST   /api/projects/:id/tasks/:taskId/github-issue  # Link issue to task
```

### Team
```
POST   /api/projects/:id/team     # Add team member
GET    /api/projects/:id/team     # Get team members
```

### Documents
```
POST   /api/projects/:id/documents  # Upload document
GET    /api/projects/:id/documents  # Get documents
```

### Budget
```
GET    /api/projects/:id/budget   # Get budget summary
```

---

## 🏗️ Architecture

```
project-management-system/
├── server.js                 # Express backend
├── App.jsx                   # React frontend
├── App.css                   # Styling
├── package.json              # Backend dependencies
├── package-frontend.json     # Frontend dependencies
├── render.yaml              # Render deployment config
├── .env.example             # Environment variables template
└── README.md                # This file
```

### Tech Stack
- **Backend**: Node.js + Express
- **Frontend**: React 18 + CSS3
- **Database**: PostgreSQL (Render)
- **API**: GitHub REST API (Octokit)
- **Deployment**: Render
- **Version Control**: Git + GitHub

---

## 🔐 Security Considerations

1. **GitHub Token**: Keep your token secure
   - Never commit `.env` to repository
   - Use GitHub's token management page to revoke if needed
   - Use minimal required scopes

2. **Database**: 
   - Enable SSL connections in production
   - Set up regular backups on Render
   - Use strong passwords

3. **CORS**: Configure allowed origins in `.env`

4. **Authentication** (future):
   - JWT tokens implemented in backend
   - OAuth2 integration with GitHub
   - Role-based access control (RBAC)

---

## 📝 Usage Examples

### Create a Tender Project
```javascript
POST /api/projects
{
  "name": "Dynamic APAC Q4 2024 RFQ",
  "description": "Platform services tender",
  "startDate": "2024-10-01",
  "endDate": "2024-12-31",
  "budget": 50000,
  "owner": "Philip Wong",
  "githubRepo": "dynamic-apac/platform-services"
}
```

### Add Team Member
```javascript
POST /api/projects/123/team
{
  "name": "Alice Johnson",
  "email": "alice@dynamic-apac.com",
  "role": "Technical Lead"
}
```

### Create Task with Deliverable
```javascript
POST /api/projects/123/tasks
{
  "title": "Technical Specification",
  "description": "Write platform architecture doc",
  "assignee": "Alice Johnson",
  "startDate": "2024-10-01",
  "endDate": "2024-10-15",
  "status": "pending",
  "priority": "high"
}
```

---

## 🔄 GitHub Workflow Integration

The system automatically:
1. Fetches issues from linked GitHub repos
2. Displays open PRs for code review
3. Maps GitHub milestones to project tasks
4. Allows linking issues to tender deliverables

**Example**: Link a GitHub issue to a tender task:
```javascript
POST /api/projects/123/tasks/456/github-issue
{
  "id": 789,
  "title": "Implement user authentication",
  "url": "https://github.com/owner/repo/issues/789"
}
```

---

## 📈 Roadmap

### Phase 2
- [ ] PostgreSQL integration (move from in-memory)
- [ ] User authentication & roles
- [ ] Real-time collaboration (WebSockets)
- [ ] Notifications & reminders
- [ ] Budget variance analysis
- [ ] Advanced reporting & analytics

### Phase 3
- [ ] Mobile app (React Native)
- [ ] Slack/Teams integration
- [ ] Email automation
- [ ] Time tracking
- [ ] Resource allocation optimizer
- [ ] Custom workflows

---

## 🐛 Troubleshooting

### "GITHUB_TOKEN not found"
- Ensure `.env` file exists and contains `GITHUB_TOKEN`
- Restart backend server after adding token

### Frontend can't reach API
- Check CORS_ORIGIN in backend .env
- Ensure API URL matches in frontend .env
- Both services must be running/deployed

### Render deployment fails
- Check build logs in Render Dashboard
- Ensure Node 18+ specified in `package.json`
- Verify all dependencies are listed

### Database connection errors
- Copy DATABASE_URL from Render PostgreSQL service
- Check connection string format
- Verify firewall rules allow connections

---

## 📚 Documentation

- [Render Documentation](https://render.com/docs)
- [GitHub API Docs](https://docs.github.com/en/rest)
- [Express.js Guide](https://expressjs.com/en/starter/basic-routing.html)
- [React Documentation](https://react.dev)

---

## 💡 Tips for Dynamic APAC

1. **Vendor Management**: Use the team feature to manage vendors
2. **RFQ Tracking**: Create a project per RFQ, tasks for each section
3. **Document Versioning**: Upload RFQ, proposal, contract in Documents tab
4. **Budget Planning**: Leverage the budget tracking for cost estimation
5. **GitHub Sync**: Link to your engineering repos for technical requirements

---

## 📄 License

MIT License - feel free to use this for your projects

---

## 🤝 Contributing

Have improvements? Send a pull request or open an issue on GitHub!

---

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review Render logs on Dashboard
3. Check GitHub API rate limits
4. Open an issue on GitHub

---

**Built with ❤️ for Dynamic APAC Co., Ltd**

**Version**: 1.0.0  
**Last Updated**: 2026-09-11
