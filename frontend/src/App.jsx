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

  const
