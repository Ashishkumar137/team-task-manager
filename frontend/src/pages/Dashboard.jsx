import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../context/projectStore';
import { taskService } from '../services/api';
import '../styles/dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { projects, fetchProjects } = useProjectStore();
  const [myTasks, setMyTasks] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchProjects();
    loadMyTasks();
  }, []);

  const loadMyTasks = async () => {
    try {
      const response = await taskService.getMyTasks({ limit: 10 });
      setMyTasks(response.data.tasks || []);

      // Calculate stats
      const overdue = response.data.tasks?.filter(
        (t) => new Date(t.due_date) < new Date() && t.status !== 'DONE'
      ) || [];
      const inProgress = response.data.tasks?.filter((t) => t.status === 'IN_PROGRESS') || [];
      const done = response.data.tasks?.filter((t) => t.status === 'DONE') || [];

      setStats({
        total: response.data.tasks?.length || 0,
        overdue: overdue.length,
        inProgress: inProgress.length,
        done: done.length,
      });
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = { LOW: '#ccc', MEDIUM: '#ffc107', HIGH: '#ff9800', URGENT: '#f44336' };
    return colors[priority] || '#ccc';
  };

  const getStatusColor = (status) => {
    const colors = {
      TODO: '#999',
      IN_PROGRESS: '#0099ff',
      IN_REVIEW: '#ff9800',
      DONE: '#4caf50',
    };
    return colors[status] || '#999';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats?.total || 0}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card warning" style={{ borderLeftColor: '#ff9800' }}>
          <div className="stat-number">{stats?.overdue || 0}</div>
          <div className="stat-label">Overdue</div>
        </div>
        <div className="stat-card info" style={{ borderLeftColor: '#0099ff' }}>
          <div className="stat-number">{stats?.inProgress || 0}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card success" style={{ borderLeftColor: '#4caf50' }}>
          <div className="stat-number">{stats?.done || 0}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="section">
          <h2>📋 My Tasks</h2>
          <div className="task-list">
            {myTasks.length > 0 ? (
              myTasks.map((task) => (
                <div key={task.id} className="task-card">
                  <div className="task-header">
                    <h3>{task.title}</h3>
                    <span
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <p className="task-description">{task.description}</p>
                  <div className="task-footer">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(task.status) }}
                    >
                      {task.status.replace(/_/g, ' ')}
                    </span>
                    {task.due_date && (
                      <span className="due-date">
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-state">No tasks assigned yet</p>
            )}
          </div>
        </div>

        <div className="section">
          <h2>🎯 My Projects</h2>
          <div className="projects-grid">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="project-card"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <button className="view-btn">View Project →</button>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No projects yet</p>
                <button
                  className="btn-primary"
                  onClick={() => navigate('/projects/new')}
                >
                  Create First Project
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
