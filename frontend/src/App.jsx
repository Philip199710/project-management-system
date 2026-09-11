import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [view, setView] = useState('dashboard'); // dashboard, gantt, github, team, documents
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects`);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const createProject = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const project = await response.json();
      setProjects([...projects, project]);
      setShowNewProjectForm(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎯 Project Management System</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowNewProjectForm(true)}
        >
          + New Project
        </button>
      </header>

      {showNewProjectForm && (
        <NewProjectForm
          onSubmit={createProject}
          onCancel={() => setShowNewProjectForm(false)}
        />
      )}

      <div className="app-container">
        <aside className="sidebar">
          <div className="projects-list">
            <h2>Projects</h2>
            {projects.map(project => (
              <div
                key={project.id}
                className={`project-item ${selectedProject?.id === project.id ? 'active' : ''}`}
                onClick={() => setSelectedProject(project)}
              >
                <span className="project-name">{project.name}</span>
                <span className="project-status">{project.status}</span>
              </div>
            ))}
          </div>
        </aside>

        <main className="main-content">
          {selectedProject ? (
            <>
              <div className="view-tabs">
                <button
                  className={`tab ${view === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setView('dashboard')}
                >
                  📊 Dashboard
                </button>
                <button
                  className={`tab ${view === 'gantt' ? 'active' : ''}`}
                  onClick={() => setView('gantt')}
                >
                  📈 Gantt Chart
                </button>
                <button
                  className={`tab ${view === 'github' ? 'active' : ''}`}
                  onClick={() => setView('github')}
                >
                  🐙 GitHub
                </button>
                <button
                  className={`tab ${view === 'team' ? 'active' : ''}`}
                  onClick={() => setView('team')}
                >
                  👥 Team
                </button>
                <button
                  className={`tab ${view === 'documents' ? 'active' : ''}`}
                  onClick={() => setView('documents')}
                >
                  📄 Documents
                </button>
              </div>

              {view === 'dashboard' && <DashboardView project={selectedProject} onRefresh={fetchProjects} />}
              {view === 'gantt' && <GanttView project={selectedProject} />}
              {view === 'github' && <GitHubView project={selectedProject} />}
              {view === 'team' && <TeamView project={selectedProject} />}
              {view === 'documents' && <DocumentsView project={selectedProject} />}
            </>
          ) : (
            <div className="empty-state">
              <h2>No project selected</h2>
              <p>Select a project from the sidebar or create a new one to get started.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ============ DASHBOARD VIEW ============

function DashboardView({ project, onRefresh }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, [project.id]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects/${project.id}/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length
  };

  const progressPercent = taskStats.total ? Math.round((taskStats.completed / taskStats.total) * 100) : 0;

  return (
    <div className="dashboard">
      <div className="project-header">
        <h2>{project.name}</h2>
        <p>{project.description}</p>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Tasks" value={taskStats.total} color="blue" />
        <StatCard title="Completed" value={taskStats.completed} color="green" />
        <StatCard title="In Progress" value={taskStats.inProgress} color="orange" />
        <StatCard title="Pending" value={taskStats.pending} color="red" />
      </div>

      <div className="progress-section">
        <div className="progress-info">
          <h3>Project Progress</h3>
          <span className="progress-percent">{progressPercent}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="timeline-info">
        <p><strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}</p>
        <p><strong>Budget:</strong> ${project.budget?.toLocaleString() || 'N/A'}</p>
      </div>

      {project.githubRepo && (
        <div className="github-link">
          <span>🐙 GitHub Repository:</span>
          <a href={`https://github.com/${project.githubRepo}`} target="_blank" rel="noopener noreferrer">
            {project.githubRepo}
          </a>
        </div>
      )}

      <div className="recent-tasks">
        <h3>Recent Tasks</h3>
        <div className="task-list">
          {tasks.slice(0, 5).map(task => (
            <div key={task.id} className="task-item">
              <div className="task-info">
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <small>Assigned to: {task.assignee || 'Unassigned'}</small>
              </div>
              <div className="task-meta">
                <span className={`status status-${task.status}`}>{task.status}</span>
                <span className={`priority priority-${task.priority}`}>{task.priority}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ GANTT VIEW ============

function GanttView({ project }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, [project.id]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects/${project.id}/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const startDate = new Date(project.startDate);
  const endDate = new Date(project.endDate);
  const daysTotal = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  return (
    <div className="gantt-view">
      <h2>Project Timeline</h2>
      <div className="gantt-container">
        <div className="gantt-tasks">
          {tasks.map(task => {
            const taskStart = new Date(task.startDate);
            const taskEnd = new Date(task.endDate);
            const taskDuration = Math.ceil((taskEnd - taskStart) / (1000 * 60 * 60 * 24));
            const daysFromStart = Math.ceil((taskStart - startDate) / (1000 * 60 * 60 * 24));
            const leftPercent = (daysFromStart / daysTotal) * 100;
            const widthPercent = (taskDuration / daysTotal) * 100;

            return (
              <div key={task.id} className="gantt-row">
                <div className="gantt-task-name">{task.title}</div>
                <div className="gantt-bar-container">
                  <div
                    className={`gantt-bar status-${task.status}`}
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`
                    }}
                    title={`${task.title} (${taskDuration} days)`}
                  >
                    <span className="gantt-bar-label">{taskDuration}d</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============ GITHUB VIEW ============

function GitHubView({ project }) {
  const [issues, setIssues] = useState([]);
  const [pulls, setPulls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (project.githubRepo) {
      fetchGitHubData();
    }
  }, [project.id, project.githubRepo]);

  const fetchGitHubData = async () => {
    if (!project.githubRepo) return;

    const [owner, repo] = project.githubRepo.split('/');
    try {
      setLoading(true);
      const [issuesRes, pullsRes] = await Promise.all([
        fetch(`${API_URL}/api/github/${owner}/${repo}/issues`),
        fetch(`${API_URL}/api/github/${owner}/${repo}/pulls`)
      ]);

      const issuesData = await issuesRes.json();
      const pullsData = await pullsRes.json();

      setIssues(issuesData);
      setPulls(pullsData);
    } catch (error) {
      console.error('Failed to fetch GitHub data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!project.githubRepo) {
    return <div className="empty-state">No GitHub repository linked</div>;
  }

  return (
    <div className="github-view">
      <h2>GitHub Integration</h2>
      <p className="repo-link">
        Repository: <a href={`https://github.com/${project.githubRepo}`} target="_blank" rel="noopener noreferrer">
          {project.githubRepo}
        </a>
      </p>

      {loading ? (
        <p>Loading GitHub data...</p>
      ) : (
        <>
          <div className="github-section">
            <h3>Issues ({issues.length})</h3>
            <div className="issues-list">
              {issues.slice(0, 10).map(issue => (
                <div key={issue.id} className="issue-item">
                  <div className="issue-header">
                    <h4>{issue.title}</h4>
                    <span className={`label label-${issue.state}`}>{issue.state}</span>
                  </div>
                  <p className="issue-body">{issue.body?.substring(0, 100)}...</p>
                  <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className="issue-link">
                    View on GitHub →
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="github-section">
