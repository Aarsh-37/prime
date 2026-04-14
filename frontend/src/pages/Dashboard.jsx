import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Edit2, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'pending' });
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    fetchTasks();
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/tasks');
      setTasks(res.data.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError('Failed to load tasks');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const openModal = (task = null) => {
    if (task) {
      setCurrentTask(task);
      setFormData({ title: task.title, description: task.description, status: task.status });
    } else {
      setCurrentTask(null);
      setFormData({ title: '', description: '', status: 'pending' });
    }
    setShowModal(true);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    try {
      if (currentTask) {
        await apiClient.put(`/tasks/${currentTask._id}`, formData);
      } else {
        await apiClient.post('/tasks', formData);
      }
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await apiClient.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting task');
      }
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <header className="flex justify-between items-center mb-8 card">
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Welcome, {user.name}</h1>
          <span className={`status-badge ${user.role === 'admin' ? 'status-in-progress' : 'status-completed'}`}>
            {user.role} Role
          </span>
        </div>
        <button onClick={handleLogout} className="btn btn-outline flex items-center gap-4" style={{ gap: '0.5rem' }}>
          <LogOut size={16} /> Logout
        </button>
      </header>

      <div className="flex justify-between items-center mb-4">
        <h2 style={{ fontSize: '1.25rem' }}>{user.role === 'admin' ? 'All System Tasks' : 'Your Tasks'}</h2>
        <button onClick={() => openModal()} className="btn btn-primary flex items-center" style={{ gap: '0.5rem' }}>
          <Plus size={16} /> New Task
        </button>
      </div>

      {error && <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</div>}

      {loading ? (
        <div className="text-center mt-8">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="card text-center mt-8 text-muted">
          <p>No tasks found. Create one to get started!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {tasks.map(task => (
            <div key={task._id} className="card">
              <div className="flex justify-between items-center mb-4">
                <span className={`status-badge status-${task.status}`}>{task.status.replace('-', ' ')}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => openModal(task)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Edit2 size={16} /></button>
                  <button onClick={() => handleDeleteTask(task._id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </div>
              </div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{task.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', minHeight: '3rem' }}>{task.description}</p>
              {task.user?.name && user.role === 'admin' && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
                  Assigned to: {task.user.name}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="mb-4">{currentTask ? 'Edit Task' : 'Create Task'}</h2>
            <form onSubmit={handleSaveTask}>
              <div className="input-group">
                <label>Task Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div className="input-group">
                <label>Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex justify-between mt-4">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{currentTask ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
