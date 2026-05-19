import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../context/projectStore';
import { taskService } from '../services/api';
import '../styles/project-detail.css';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const {
    currentProject,
    tasks,
    members,
    fetchProjectById,
    fetchTasks,
    fetchMembers,
    updateTask,
    deleteTask,
  } = useProjectStore();

  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
  });

  useEffect(() => {
    fetchProjectById(projectId);
    fetchTasks(projectId, filters);
    fetchMembers(projectId);
  }, [projectId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskService.create(projectId, newTask);
      setNewTask({ title: '', description: '', priority: 'MEDIUM', dueDate: '' });
      setShowNewTaskForm(false);
      fetchTasks(projectId, filters);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      fetchTasks(projectId, filters);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
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
    <div className="project-detail">
      <div className="project-header-section">
        <button className="btn-back" onClick={() => navigate('/projects')}>
          ← Back to Projects
        </button>
        <div className="project-title">
          <h1>{currentProject?.name}</h1>
          <p>{currentProject?.description}</p>
        </div>
      </div>

      <div className="project-content">
        <div className="main-section">
          <div className="tasks-section">
            <div className="section-header">
              <h2>📋 Tasks</h2>
              <button
                className="btn-primary"
                onClick={() => setShowNewTaskForm(!showNewTaskForm)}
              >
                + New Task
              </button>
            </div>

            {showNewTaskForm && (
              <form className="task-form" onSubmit={handleCreateTask}>
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                  <option value="URGENT">Urgent</option>
                </select>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    Create Task
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowNewTaskForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="task-list">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div key={task.id} className="task-item">
                    <div className="task-content">
                      <h4>{task.title}</h4>
                      <p>{task.description}</p>
                      <div className="task-meta">
                        <span className="priority">{task.priority}</span>
                        {task.due_date && (
                          <span className="due-date">
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="task-actions">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        style={{
                          borderLeftColor: getStatusColor(task.status),
                        }}
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="IN_REVIEW">In Review</option>
                        <option value="DONE">Done</option>
                      </select>
                      <button
                        className="btn-delete"
                        onClick={() => deleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-state">No tasks yet. Create one to get started!</p>
              )}
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="members-section">
            <h3>👥 Team Members</h3>
            <div className="members-list">
              {members.length > 0 ? (
                members.map((member) => (
                  <div key={member.user_id} className="member-item">
                    <div className="member-info">
                      <p className="member-name">
                        {member.first_name} {member.last_name}
                      </p>
                      <p className="member-email">{member.email}</p>
                    </div>
                    <span className="role-badge">{member.role}</span>
                  </div>
                ))
              ) : (
                <p className="empty-state">No members yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
