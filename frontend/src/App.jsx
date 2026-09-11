import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [view, setView] = useState('dashboard');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);

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
            {projects.length === 0 ? (
              <p style={{ padding: '1rem', color: '#9ca3af' }}>No projects yet</p>
            ) : (
              projects.map(project => (
                <div
                  key={project.id}
                  className={`project-item ${selectedProject?.id === project.id ? 'active' : ''}`}
                  onClick={() => setSelectedProject(project)}
                >
                  <span className="project-name">{project.name}</span>
                  <span className="project-status">{project.status}</span>
                </div>
              ))
            )}
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
                  📈 Gantt
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
                  📄 Docs
                </button>
              </div>

              {view === 'dashboard' && <DashboardView project={selectedProject} />}
              {view === 'gantt' && <GanttView project={selectedProject} />}
              {view === 'github' && <GitHubView project={selectedProject} />}
              {view === 'team' && <TeamView project={selectedProject} />}
              {view === 'documents' && <DocumentsView project={selectedProject} />}
            </>
          ) : (
            <div className="empty-state">
              <h2>No project selected</h2>
              <p>Select a project or create a new one</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function DashboardView({ project }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_URL}/api/projects/${project.id}/tasks`);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };
    fetchTasks();
  }, [project.id]);

  const completed = tasks.filter(t => t.status === 'completed').length;
  const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="dashboard">
      <div className="project-header">
        <h2>{project.name}</h2>
        <p>{project.description || 'No description'}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <h3>Total Tasks</h3>
          <div className="stat-value">{tasks.length}</div>
        </div>
        <div className="stat-card stat-green">
          <h3>Completed</h3>
          <div className="stat-value">{completed}</div>
        </div>
        <div className="stat-card stat-orange">
          <h3>Progress</h3>
          <div className="stat-value">{progress}%</div>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-info">
          <h3>Overall Progress</h3>
          <span className="progress-percent">{progress}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="timeline-info">
        <p><strong>Start:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
        <p><strong>End:</strong> {new Date(project.endDate).toLocaleDateString()}</p>
        <p><strong>Budget:</strong> ${project.budget?.toLocaleString() || '0'}</p>
      </div>
    </div>
  );
}

function GanttView({ project }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_URL}/api/projects/${project.id}/tasks`);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };
    fetchTasks();
  }, [project.id]);

  const startDate = new Date(project.startDate);
  const endDate = new Date(project.endDate);
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  return (
    <div className="gantt-view">
      <h2>Project Timeline</h2>
      {tasks.length === 0 ? (
        <p>No tasks yet</p>
      ) : (
        <div className="gantt-container">
          {tasks.map(task => {
            const taskStart = new Date(task.startDate);
            const taskEnd = new Date(task.endDate);
            const duration = Math.ceil((taskEnd - taskStart) / (1000 * 60 * 60 * 24));
            const offset = Math.ceil((taskStart - startDate) / (1000 * 60 * 60 * 24));
            const left = (offset / totalDays) * 100;
            const width = (duration / totalDays) * 100;

            return (
              <div key={task.id} className="gantt-row">
                <div className="gantt-task-name">{task.title}</div>
                <div className="gantt-bar-container">
                  <div
                    className={`gantt-bar status-${task.status}`}
                    style={{ left: `${left}%`, width: `${width}%` }}
                  >
                    {duration}d
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function GitHubView({ project }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!project.githubRepo) return;

    const fetchIssues = async () => {
      const [owner, repo] = project.githubRepo.split('/');
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/github/${owner}/${repo}/issues`);
        const data = await response.json();
        setIssues(data);
      } catch (error) {
        console.error('Failed to fetch issues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [project.githubRepo]);

  if (!project.githubRepo) {
    return <div className="empty-state"><p>No GitHub repo linked</p></div>;
  }

  return (
    <div className="github-view">
      <h2>GitHub Issues</h2>
      {loading ? (
        <p>Loading...</p>
      ) : issues.length === 0 ? (
        <p>No issues found</p>
      ) : (
        <div className="issues-list">
          {issues.slice(0, 10).map(issue => (
            <div key={issue.id} className="issue-item">
              <h4>{issue.title}</h4>
              <span className={`label label-${issue.state}`}>{issue.state}</span>
              <p>{issue.body?.substring(0, 80)}...</p>
              <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
                View →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TeamView({ project }) {
  const [team, setTeam] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(`${API_URL}/api/projects/${project.id}/team`);
        const data = await response.json();
        setTeam(data);
      } catch (error) {
        console.error('Failed to fetch team:', error);
      }
    };
    fetchTeam();
  }, [project.id]);

  const handleAddMember = async (member) => {
    try {
      const response = await fetch(`${API_URL}/api/projects/${project.id}/team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      });
      const newMember = await response.json();
      setTeam([...team, newMember]);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add member:', error);
    }
  };

  return (
    <div className="team-view">
      <div className="team-header">
        <h2>Team ({team.length})</h2>
        <button className="btn btn-secondary" onClick={() => setShowForm(true)}>
          + Add
        </button>
      </div>

      {showForm && (
        <AddMemberForm
          onSubmit={handleAddMember}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="team-grid">
        {team.map(member => (
          <div key={member.id} className="member-card">
            <div className="member-avatar">{member.name.charAt(0)}</div>
            <h3>{member.name}</h3>
            <p>{member.email}</p>
            <span className="member-role">{member.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentsView({ project }) {
  const [documents, setDocuments] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/projects/${project.id}/documents`);
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      }
    };
    fetchDocs();
  }, [project.id]);

  const handleUpload = async (doc) => {
    try {
      const response = await fetch(`${API_URL}/api/projects/${project.id}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc)
      });
      const newDoc = await response.json();
      setDocuments([...documents, newDoc]);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to upload:', error);
    }
  };

  return (
    <div className="documents-view">
      <div className="docs-header">
        <h2>Documents</h2>
        <button className="btn btn-secondary" onClick={() => setShowForm(true)}>
          + Upload
        </button>
      </div>

      {showForm && (
        <UploadForm
          onSubmit={handleUpload}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="documents-list">
        {documents.map(doc => (
          <div key={doc.id} className="document-item">
            <div className="doc-icon">📄</div>
            <div className="doc-info">
              <h4>{doc.name}</h4>
              <p>{doc.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewProjectForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
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
    onSubmit({ ...form, budget: form.budget ? parseFloat(form.budget) : 0 });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>New Project</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          <input type="date" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          <input type="number" placeholder="Budget" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
          <input type="text" placeholder="Owner" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
          <input type="text" placeholder="GitHub (owner/repo)" value={form.githubRepo} onChange={(e) => setForm({ ...form, githubRepo: e.target.value })} />
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Create</button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddMemberForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'Developer' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Team Member</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option>Developer</option>
            <option>Designer</option>
            <option>Manager</option>
          </select>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Add</button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UploadForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ name: '', type: 'Other', url: '', uploadedBy: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Upload Document</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option>RFQ</option>
            <option>Proposal</option>
            <option>Contract</option>
            <option>Report</option>
            <option>Other</option>
          </select>
          <input type="url" placeholder="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          <input type="text" placeholder="Uploaded By" value={form.uploadedBy} onChange={(e) => setForm({ ...form, uploadedBy: e.target.value })} />
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Upload</button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
