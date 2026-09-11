# ⚡ Quick Start - Project Management System

Get up and running in 5 minutes!

---

## 🚀 Ultra-Fast Setup

### Option 1: Deploy Directly to Render (Recommended)

```bash
# 1. Fork/clone repo and push to GitHub
git clone https://github.com/yourusername/project-management-system.git
cd project-management-system
git push -u origin main

# 2. Go to https://render.com
# 3. Click "New Web Service" → Select your GitHub repo
# 4. Configure:
#    - Build: npm install
#    - Start: npm start
# 5. Add environment variables (see below)
# 6. Deploy!
```

### Option 2: Local Development

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env and add GITHUB_TOKEN

# 3. Start backend (port 5000)
npm start

# 4. In another terminal, start frontend
cd frontend
npm start
# Visit http://localhost:3000
```

---

## 🔑 Essential Environment Variables

```
GITHUB_TOKEN=ghp_your_token_here
REACT_APP_API_URL=https://your-api.onrender.com
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.onrender.com
```

---

## 📊 System Architecture at a Glance

```
┌─────────────────────────────────────────────────────┐
│           React Frontend (onrender.com)             │
│  Dashboard | Gantt | GitHub | Team | Documents     │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS
┌──────────────────▼──────────────────────────────────┐
│        Express API Backend (onrender.com)           │
│  /api/projects /api/tasks /api/github /api/documents
└──────────────────┬──────────────────────────────────┘
                   │ SQL
┌──────────────────▼──────────────────────────────────┐
│      PostgreSQL Database (Render Managed)           │
│  Projects | Tasks | Teams | Documents | Budget      │
└─────────────────────────────────────────────────────┘
                   │
          ┌────────▼────────┐
          │ GitHub API (OAuth)
          │ Issues, PRs, Repos
          └──────────────────┘
```

---

## 📝 File Structure

```
project-management-system/
├── server.js                    # 🔴 Express backend
├── App.jsx                      # ⚛️  React frontend
├── App.css                      # 🎨 Styling
├── database-schema.sql          # 🗄️  PostgreSQL schema
├── package.json                 # 📦 Dependencies
├── render.yaml                  # 🚀 Deployment config
├── .env.example                 # 📋 Environment template
├── README.md                    # 📖 Full documentation
├── DEPLOYMENT_GUIDE.md          # 📚 Step-by-step guide
└── QUICK_START.md               # ⚡ This file
```

---

## 🎯 Core Features

| Feature | Purpose | Status |
|---------|---------|--------|
| **Projects** | Create & manage projects | ✅ Ready |
| **Tasks** | Assign work to team members | ✅ Ready |
| **Gantt Charts** | Visual timeline | ✅ Ready |
| **GitHub Integration** | Sync issues & PRs | ✅ Ready |
| **Team Management** | Add members, assign roles | ✅ Ready |
| **Documents** | Store RFQs, proposals, contracts | ✅ Ready |
| **Budget Tracking** | Monitor costs (in-memory) | ✅ Ready |
| **User Auth** | Login/logout | 🚧 DB only |
| **Real-time Sync** | WebSocket updates | 🚧 Future |
| **Notifications** | Email alerts | 🚧 Future |

---

## 🔴 Example: Create a Tender Project

```javascript
// POST http://localhost:5000/api/projects
{
  "name": "Dynamic APAC Q4 2024 Platform RFQ",
  "description": "Engineering services tender",
  "startDate": "2024-10-01",
  "endDate": "2024-12-31",
  "budget": 50000,
  "owner": "Philip Wong",
  "githubRepo": "dynamic-apac/platform-2024"
}

// Response:
{
  "id": "1726012345",
  "name": "Dynamic APAC Q4 2024 Platform RFQ",
  "status": "active",
  "tasks": [],
  "teamMembers": [],
  "documents": [],
  "createdAt": "2024-09-11T10:30:00Z"
}
```

---

## 📱 Dashboard Views

### 1️⃣ Dashboard Tab
- Project overview
- Progress bar
- Task statistics
- Team member list
- Recent activities

### 2️⃣ Gantt Chart Tab
- Visual timeline
- Task duration bars
- Color-coded status
- Date range display
- Milestone tracking

### 3️⃣ GitHub Tab
- Issues list (open/closed)
- Pull requests (in-review/merged)
- Issue-to-task linking
- Direct GitHub links

### 4️⃣ Team Tab
- Team member cards
- Role assignment
- Task allocation
- Hours tracking

### 5️⃣ Documents Tab
- Upload documents
- Version control
- Document types (RFQ, Proposal, Contract)
- File management

---

## 🔗 API Quick Reference

### Projects
```bash
POST   /api/projects           # Create project
GET    /api/projects           # List all
GET    /api/projects/:id       # Get details
PUT    /api/projects/:id       # Update
```

### Tasks
```bash
POST   /api/projects/:id/tasks           # Create task
GET    /api/projects/:id/tasks           # Get Gantt data
PUT    /api/projects/:id/tasks/:taskId   # Update task
```

### GitHub
```bash
GET    /api/github/:owner/:repo           # Repo info
GET    /api/github/:owner/:repo/issues    # Get issues
GET    /api/github/:owner/:repo/pulls     # Get PRs
```

### Team
```bash
POST   /api/projects/:id/team     # Add member
GET    /api/projects/:id/team     # List team
```

### Documents
```bash
POST   /api/projects/:id/documents   # Upload
GET    /api/projects/:id/documents   # List
```

---

## ✅ Deployment Checklist

- [ ] GitHub repo created & pushed
- [ ] Render account created
- [ ] GitHub token generated (`Settings` → `Developer settings` → `Tokens`)
- [ ] Backend service created on Render
- [ ] Frontend service created on Render
- [ ] PostgreSQL database created
- [ ] Environment variables added (Backend & Frontend)
- [ ] Database schema initialized
- [ ] Health check passes (`/health` endpoint)
- [ ] Frontend loads successfully
- [ ] Can create first project

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| API not responding | Check backend logs: Service → Logs |
| Frontend blank | Browser console (F12) for errors |
| GitHub issues not loading | Verify GITHUB_TOKEN in env vars |
| Database connection fails | Check DATABASE_URL format |
| CORS errors | Update CORS_ORIGIN to match frontend URL |
| Can't login | Create user in database first |

---

## 📞 Need Help?

1. **Local issues**: Check terminal output, run `npm start` again
2. **Render issues**: Dashboard → Service → Logs
3. **GitHub API issues**: Check rate limits (60/hour unauthenticated)
4. **Database issues**: Connect via `psql` and check schema

---

## 🎓 Learning Path

1. **Week 1**: Set up locally, create test projects
2. **Week 2**: Deploy to Render, test GitHub integration
3. **Week 3**: Add team members, create tasks
4. **Week 4**: Upload documents, track budget

---

## 🚀 Next-Level Features (TODO)

```javascript
// User Authentication
// - JWT tokens
// - GitHub OAuth
// - Role-based access

// Real-time Features
// - WebSocket connections
// - Live notifications
// - Collaborative editing

// Analytics
// - Project completion rates
// - Budget variance analysis
// - Team productivity metrics

// Integrations
// - Slack notifications
// - Email summaries
// - Calendar sync
```

---

## 📚 Documentation Tree

- `README.md` - Full documentation
- `DEPLOYMENT_GUIDE.md` - Step-by-step Render setup
- `QUICK_START.md` - This file
- `database-schema.sql` - PostgreSQL tables
- `server.js` - Backend API code
- `App.jsx` - Frontend React code

---

## 🎯 Success Metrics

Your deployment is successful when:
- ✅ Frontend loads at HTTPS URL
- ✅ Backend API responds to requests
- ✅ Can fetch GitHub issues
- ✅ Can create projects and tasks
- ✅ Gantt chart renders timeline
- ✅ Team members can be added
- ✅ Documents can be uploaded

---

## 🎉 You're Ready!

1. Deploy to Render (5 minutes)
2. Create first project (2 minutes)
3. Add GitHub repo (1 minute)
4. Add team member (1 minute)
5. Create tasks (5 minutes)

**Total: 15 minutes to full functionality! 🚀**

---

**Built for Dynamic APAC Co., Ltd**
Tender & Project Management Excellence

*Questions? Check README.md or DEPLOYMENT_GUIDE.md*
