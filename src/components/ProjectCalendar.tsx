import React, { useState, useEffect } from 'react';
import './ProjectCalendar.css';

interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

const ProjectCalendar: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'not-started'
  });

  // Load projects from localStorage on component mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: Date.now().toString(),
      name: formData.name || '',
      description: formData.description || '',
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
      status: formData.status as 'not-started' | 'in-progress' | 'completed'
    };
    setProjects(prev => [...prev, newProject]);
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'not-started'
    });
    setShowForm(false);
  };

  const handleStatusChange = (projectId: string, newStatus: Project['status']) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId ? { ...project, status: newStatus } : project
      )
    );
  };

  const handleDelete = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dayProjects = projects.filter(project => {
        const startDate = new Date(project.startDate);
        const endDate = new Date(project.endDate);
        return currentDate >= startDate && currentDate <= endDate;
      });

      days.push(
        <div key={day} className="calendar-day">
          <span className="day-number">{day}</span>
          <div className="day-projects">
            {dayProjects.map(project => (
              <div
                key={project.id}
                className={`project-indicator ${project.status}`}
                title={`${project.name} - ${project.status}`}
              >
                {project.name}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="calendar-view">
        <div className="calendar-header">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
            ←
          </button>
          <h2>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
            →
          </button>
        </div>
        <div className="calendar-grid">
          <div className="calendar-weekdays">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          <div className="calendar-days">
            {days}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <h1>Project Calendar</h1>
      
      <div className="calendar-header">
        <button className="add-project-btn" onClick={() => setShowForm(true)}>
          Add New Project
        </button>
      </div>

      {showForm && (
        <form className="add-project-form" onSubmit={handleSubmit}>
          <h2>Add New Project</h2>
          <div className="form-group">
            <label htmlFor="name">Project Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">Save Project</button>
            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {renderCalendar()}

      <div className="projects-list">
        <h2>All Projects</h2>
        {projects.length === 0 ? (
          <p className="no-projects">No projects added yet.</p>
        ) : (
          <div className="projects-timeline">
            {projects.map(project => (
              <div key={project.id} className={`project-card ${project.status}`}>
                <div className="project-header">
                  <h3>{project.name}</h3>
                  <div className="project-actions">
                    <select
                      value={project.status}
                      onChange={(e) => handleStatusChange(project.id, e.target.value as Project['status'])}
                      className="status-select"
                    >
                      <option value="not-started">Not Started</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="delete-btn"
                      title="Delete Project"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-dates">
                  <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                  <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCalendar; 