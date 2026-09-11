const express = require('express');
const cors = require('cors');
const { Octokit } = require("@octokit/rest");
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with PostgreSQL for production)
const projects = new Map();
const teams = new Map();
const documents = new Map();

// Initialize GitHub client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// ============ PROJECT ROUTES ============

// Create project
app.post('/api/projects', (req, res) => {
  const { name, description, startDate, endDate, budget, owner, githubRepo } = req.body;
  const id = Date.now().toString();
  
  const project = {
    id,
    name,
    description,
    startDate,
    endDate,
    budget,
    owner,
    githubRepo,
    status: 'active',
    tasks: [],
    teamMembers: [],
    documents: [],
    createdAt: new Date()
  };
  
  projects.set(id, project);
  res.json(project);
});

// Get all projects
app.get('/api/projects', (req, res) => {
  res.json(Array.from(projects.values()));
});

// Get single project
app.get('/api/projects/:id', (req, res) => {
  const project = projects.get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

// Update project
app.put('/api/projects/:id', (req, res) => {
  const project = projects.get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  
  Object.assign(project, req.body);
  res.json(project);
});

// ============ TASK ROUTES ============

// Add task to project
app.post('/api/projects/:id/tasks', (req, res) => {
  const project = projects.get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  
  const { title, description, assignee, startDate, endDate, status, priority } = req.body;
  const taskId = Date.now().toString();
  
  const task = {
    id: taskId,
    title,
    description,
    assignee,
    startDate,
    endDate,
    status: status || 'pending',
    priority: priority || 'medium',
    deliverables: [],
    createdAt: new Date()
  };
  
  project.tasks.push(task);
  res.json(task);
});

// Update task
app.put('/api/projects/:projectId/tasks/:taskId', (req, res) => {
  const project = projects.get(req.params.projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  
  const task = project.tasks.find(t => t.id === req.params.taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  
  Object.assign(task, req.body);
  res.json(task);
});

// Get tasks for project (Gantt data)
app.get('/api/projects/:id/tasks', (req, res) => {
  const project = projects.get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  
  res.json(project.tasks);
});

// ============ GITHUB INTEGRATION ============

// Get GitHub repository info
app.get('/api/github/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const repository = await octokit.repos.get({ owner, repo });
    res.json(repository.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get GitHub issues for project
app.get('/api/github/:owner/:repo/issues', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const issues = await octokit.issues.listForRepo({
      owner,
      repo,
      state: 'all',
      per_page: 100
    });
    res.json(issues.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get GitHub pull requests
app.get('/api/github/:owner/:repo/pulls', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const pulls = await octokit.pulls.list({
      owner,
      repo,
      state: 'all',
      per_page: 100
    });
    res.json(pulls.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Link GitHub issue to task
app.post('/api/projects/:projectId/tasks/:taskId/github-issue', (req, res) => {
  const project = projects.get(req.params.projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  
  const task = project.tasks.find(t => t.id === req.params.taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  
  task.githubIssue = req.body;
  res.json(task);
});

// ============ TEAM ROUTES ============

// Add team member
app.post('/api/projects/:id/team', (req, res) => {
  const project = projects.get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  
  const { name, email, role } = req.body;
  const member = {
    id: Date.now().toString(),
    name,
    email,
    role,
    assignedTasks: []
  };
  
  project.teamMembers.push(member);
  res.json(member);
});

// Get team members
app.get('/api/projects/:id/team', (req, res) => {
  const project = projects.get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  
  res.json(project.teamMembers);
});

// ============ DOCUMENT ROUTES ============

// Upload document
app.post('/api/projects/:id/documents', (req, res) => {
  const project = projects.get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  
  const { name, type, url, uploadedBy, taskId } = req.body;
  const docId = Date.now().toString();
  
  const doc = {
    id: docId,
    name,
    type,
    url,
    uploadedBy,
    taskId,
    uploadedAt: new Date()
  };
  
  project.documents.push(doc);
  documents.set(docId, doc);
  res.json(doc);
});

// Get project documents
app.get('/api/projects/:id/documents', (req, res) => {
  const project = projects.get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  
  res.json(project.documents);
});

// ============ BUDGET ROUTES ============

// Get project budget summary
app.get('/api/projects/:id/budget', (req, res) => {
  const project = projects.get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  
  const budgetData = {
    totalBudget: project.budget || 0,
    tasks: project.tasks.map(t => ({
      id: t.id,
      title: t.title,
      assignee: t.assignee,
      status: t.status
    })),
    costSummary: {
      labor: 0,
      materials: 0,
      contingency: 0
    }
  };
  
  res.json(budgetData);
});

// ============ HEALTH CHECK ============

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ============ START SERVER ============

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Project Management Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}`);
});

module.exports = app;
