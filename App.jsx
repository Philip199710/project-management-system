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
            <h3>Pull Requests ({pulls.length})</h3>
            <div className="pulls-list">
              {pulls.slice(0, 10).map(pull => (
                <div key={pull.id} className="pull-item">
                  <div className="pull-header">
                    <h4>{pull.title}</h4>
                    <span className={`label label-${pull.state}`}>{pull.state}</span>
                  </div>
                  <p className="pull-info">by {pull.user.login}</p>
                  <a href={pull.html_url} target="_blank" rel="noopener noreferrer" className="pull-link">
                    Review on GitHub →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============ TEAM VIEW ============

function TeamView({ project }) {
  const [team, setTeam] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, [project.id]);

  const fetchTeam = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects/${project.id}/team`);
      const data = await response.json();
      setTeam(data);
    } catch (error) {
      console.error('Failed to fetch team:', error);
    }
  };

  const addTeamMember = async (member) => {
    try {
      const response = await fetch(`${API_URL}/api/projects/${project.id}/team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      });
      const newMember = await response.json();
      setTeam([...team, newMember]);
      setShowAddMember(false);
    } catch (error) {
      console.error('Failed to add team member:', error);
    }
  };

  return (
    <div className="team-view">
      <div className="team-header">
        <h2>Team Members ({team.length})</h2>
        <button className="btn btn-secondary" onClick={() => setShowAddMember(true)}>
          + Add Member
        </button>
      </div>

      {showAddMember && (
        <AddMemberForm
          onSubmit={addTeamMember}
          onCancel={() => setShowAddMember(false)}
        />
      )}

      <div className="team-grid">
        {team.map(member => (
          <div key={member.id} className="member-card">
            <div className="member-avatar">{member.name.charAt(0)}</div>
            <h3>{member.name}</h3>
            <p className="member-email">{member.email}</p>
            <span className="member-role">{member.role}</span>
            <p className="member-tasks">Tasks assigned: {member.assignedTasks?.length || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ DOCUMENTS VIEW ============

function DocumentsView({ project }) {
  const [documents, setDocuments] = useState([]);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [project.id]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects/${project.id}/documents`);
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
  };

  const uploadDocument = async (docData) => {
    try {
      const response = await fetch(`${API_URL}/api/projects/${project.id}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docData)
      });
      const newDoc = await response.json();
      setDocuments([...documents, newDoc]);
      setShowUpload(false);
    } catch (error) {
      console.error('Failed to upload document:', error);
    }
  };

  return (
    <div className="documents-view">
      <div className="docs-header">
        <h2>Project Documents</h2>
        <button className="btn btn-secondary" onClick={() => setShowUpload(true)}>
          + Upload Document
        </button>
      </div>

      {showUpload && (
        <UploadDocumentForm
          onSubmit={uploadDocument}
          onCancel={() => setShowUpload(false)}
        />
      )}

      <div className="documents-list">
        {documents.length === 0 ? (
          <p className="empty">No documents uploaded yet</p>
        ) : (
          documents.map(doc => (
            <div key={doc.id} className="document-item">
              <div className="doc-icon">📄</div>
              <div className="doc-info">
                <h4>{doc.name}</h4>
                <p className="doc-type">{doc.type}</p>
                <small>Uploaded by {doc.uploadedBy} on {new Date(doc.uploadedAt).toLocaleDateString()}</small>
              </div>
              {doc.url && (
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="doc-link">
                  Open →
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============ HELPER COMPONENTS ============

function StatCard({ title, value, color }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <h3>{title}</h3>
      <div className="stat-value">{value}</div>
    </div>
  );
}

function NewProjectForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    budget: '',
    owner: '',
    githubRepo: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      budget: formData.budget ? parseFloat(formData.budget) : 0
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>New Project</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Project Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <input
            type="date"
            required
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
          <input
            type="date"
            required
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
          <input
            type="number"
            placeholder="Budget"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          />
          <input
            type="text"
            placeholder="Owner"
            value={formData.owner}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
          />
          <input
            type="text"
            placeholder="GitHub Repo (e.g., owner/repo)"
            value={formData.githubRepo}
            onChange={(e) => setFormData({ ...formData, githubRepo: e.target.value })}
          />
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Create Project</button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddMemberForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Developer'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Team Member</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
            <option>Developer</option>
            <option>Designer</option>
            <option>Manager</option>
            <option>Lead</option>
          </select>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Add Member</button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UploadDocumentForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Other',
    url: '',
    uploadedBy: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Upload Document</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Document Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
            <option>RFQ</option>
            <option>Proposal</option>
            <option>Contract</option>
            <option>Report</option>
            <option>Other</option>
          </select>
          <input
            type="url"
            placeholder="Document URL"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          />
          <input
            type="text"
            placeholder="Uploaded By"
            value={formData.uploadedBy}
            onChange={(e) => setFormData({ ...formData, uploadedBy: e.target.value })}
          />
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Upload</button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
