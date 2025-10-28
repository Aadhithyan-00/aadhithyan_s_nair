const { useState, useEffect } = React;

// Initial task data
const initialTasks = [
  {
    id: 1,
    title: "Complete Project Documentation",
    description: "Write comprehensive README and API documentation for the task manager project",
    status: "Pending",
    createdAt: "2025-10-27T10:30:00Z"
  },
  {
    id: 2,
    title: "Review Pull Requests",
    description: "Review and merge pending PRs from team members",
    status: "Completed",
    createdAt: "2025-10-26T14:20:00Z"
  },
  {
    id: 3,
    title: "Setup CI/CD Pipeline",
    description: "Configure GitHub Actions for automated testing and deployment",
    status: "Pending",
    createdAt: "2025-10-25T09:15:00Z"
  },
  {
    id: 4,
    title: "Database Optimization",
    description: "Add indexes and optimize MongoDB queries for better performance",
    status: "Completed",
    createdAt: "2025-10-24T16:45:00Z"
  },
  {
    id: 5,
    title: "Update Dependencies",
    description: "Update all npm packages to latest stable versions",
    status: "Pending",
    createdAt: "2025-10-23T11:00:00Z"
  }
];

// Toast Notification Component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };

  return (
    <div className={`toast ${type}`}>
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-message">{message}</span>
    </div>
  );
}

// Toast Container Component
function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

// Confirmation Dialog Component
function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-dialog-header">
          <h3>⚠️ {title}</h3>
        </div>
        <div className="confirm-dialog-body">
          <p>{message}</p>
        </div>
        <div className="confirm-dialog-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Task Form Component (Add/Edit)
function TaskForm({ task, onSave, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'Pending'
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'Add New Task'}</h2>
          <button className="modal-close" onClick={onCancel}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">
                Title<span className="required">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="Enter task title"
                disabled={isLoading}
              />
              {errors.title && <div className="form-error">{errors.title}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Enter task description (optional)"
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
                disabled={isLoading}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : task ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Task Table Component
function TaskTable({ tasks, onEdit, onDelete, onToggleStatus }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (tasks.length === 0) {
    return (
      <div className="task-table">
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3>No tasks found</h3>
          <p>Start by adding your first task!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-table">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>
                <div className="task-title">{task.title}</div>
              </td>
              <td>
                <div className="task-description">
                  {task.description || 'No description'}
                </div>
              </td>
              <td>
                <span className={`status-badge ${task.status.toLowerCase()}`}>
                  {task.status}
                </span>
              </td>
              <td>
                <div className="task-date">{formatDate(task.createdAt)}</div>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => onToggleStatus(task)}
                    title={task.status === 'Pending' ? 'Mark as Completed' : 'Mark as Pending'}
                  >
                    {task.status === 'Pending' ? '✓ Complete' : '↻ Pending'}
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => onEdit(task)}
                    title="Edit task"
                  >
                    ✎ Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(task)}
                    title="Delete task"
                  >
                    🗑 Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Main App Component
function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filteredTasks, setFilteredTasks] = useState(initialTasks);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextId, setNextId] = useState(6);

  // Filter tasks based on status and search query
  useEffect(() => {
    let filtered = tasks;

    // Filter by status
    if (filterStatus !== 'All') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, filterStatus, searchQuery]);

  // Toast functions
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // CRUD Operations
  const handleAddTask = (formData) => {
    setIsLoading(true);
    setTimeout(() => {
      const newTask = {
        id: nextId,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        createdAt: new Date().toISOString()
      };
      setTasks(prev => [newTask, ...prev]);
      setNextId(prev => prev + 1);
      setShowForm(false);
      setIsLoading(false);
      addToast('Task added successfully!', 'success');
    }, 500);
  };

  const handleUpdateTask = (formData) => {
    setIsLoading(true);
    setTimeout(() => {
      setTasks(prev =>
        prev.map(task =>
          task.id === editingTask.id
            ? { ...task, ...formData }
            : task
        )
      );
      setEditingTask(null);
      setIsLoading(false);
      addToast('Task updated successfully!', 'success');
    }, 500);
  };

  const handleDeleteTask = (task) => {
    setDeleteConfirm(task);
  };

  const confirmDelete = () => {
    const task = deleteConfirm;
    setTasks(prev => prev.filter(t => t.id !== task.id));
    setDeleteConfirm(null);
    addToast('Task deleted successfully!', 'success');
  };

  const handleToggleStatus = (task) => {
    const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    setTasks(prev =>
      prev.map(t =>
        t.id === task.id ? { ...t, status: newStatus } : t
      )
    );
    addToast(`Task marked as ${newStatus}!`, 'success');
  };

  // Statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>📋 Task Manager</h1>
        <p>Organize and manage your tasks efficiently</p>
      </div>

      {/* Statistics */}
      <div className="stats-container">
        <div className="stat-card total">
          <h3>Total Tasks</h3>
          <div className="number">{totalTasks}</div>
        </div>
        <div className="stat-card completed">
          <h3>Completed</h3>
          <div className="number">{completedTasks}</div>
        </div>
        <div className="stat-card pending">
          <h3>Pending</h3>
          <div className="number">{pendingTasks}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls">
        <div className="controls-left">
          <button
            className={`btn-filter ${filterStatus === 'All' ? 'active' : ''}`}
            onClick={() => setFilterStatus('All')}
          >
            All ({totalTasks})
          </button>
          <button
            className={`btn-filter ${filterStatus === 'Pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('Pending')}
          >
            Pending ({pendingTasks})
          </button>
          <button
            className={`btn-filter ${filterStatus === 'Completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('Completed')}
          >
            Completed ({completedTasks})
          </button>
        </div>
        <div className="controls-right">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            ➕ Add Task
          </button>
        </div>
      </div>

      {/* Task Table */}
      <TaskTable
        tasks={filteredTasks}
        onEdit={setEditingTask}
        onDelete={handleDeleteTask}
        onToggleStatus={handleToggleStatus}
      />

      {/* Add/Edit Form Modal */}
      {(showForm || editingTask) && (
        <TaskForm
          task={editingTask}
          onSave={editingTask ? handleUpdateTask : handleAddTask}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
          isLoading={isLoading}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <ConfirmDialog
          title="Confirm Delete"
          message={`Are you sure you want to delete the task "${deleteConfirm.title}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);