import React, { useState, useEffect, useCallback } from 'react'
import './Dashboard.css'

const CustomerDashboard = ({ user, onLogout }) => {
  const [jobs, setJobs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    serviceType: '',
    address: '',
    budget: ''
  })

  const loadJobs = useCallback(() => {
    const savedJobs = localStorage.getItem('jobs')
    if (savedJobs) {
      try {
        const parsedJobs = JSON.parse(savedJobs)
        setJobs(parsedJobs)
      } catch (error) {
        console.error('Error loading jobs:', error)
        setJobs([])
      }
    } else {
      setJobs([])
    }
  }, [])

  // Load jobs from localStorage on mount and when user changes
  useEffect(() => {
    loadJobs()
    // Set up interval to check for job updates (every 2 seconds)
    const interval = setInterval(loadJobs, 2000)
    return () => clearInterval(interval)
  }, [user, loadJobs])

  const saveJobs = (updatedJobs) => {
    setJobs(updatedJobs)
    localStorage.setItem('jobs', JSON.stringify(updatedJobs))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate budget
    if (isNaN(formData.budget) || parseFloat(formData.budget) <= 0) {
      alert('Please enter a valid budget amount')
      return
    }

    const newJob = {
      id: Date.now(),
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      title: formData.title,
      description: formData.description,
      serviceType: formData.serviceType,
      address: formData.address,
      budget: parseFloat(formData.budget),
      status: 'open',
      createdAt: new Date().toISOString(),
      acceptedBy: null
    }
    
    const updatedJobs = [...jobs, newJob]
    saveJobs(updatedJobs)
    
    // Show success message
    setSuccessMessage(`Job "${formData.title}" posted successfully!`)
    setTimeout(() => {
      setSuccessMessage('')
    }, 5000)
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      serviceType: '',
      address: '',
      budget: ''
    })
    setShowForm(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const myJobs = jobs.filter(job => job.customerId === user.id)
  const openJobs = myJobs.filter(job => job.status === 'open')
  const inProgressJobs = myJobs.filter(job => job.status === 'in-progress')
  const completedJobs = myJobs.filter(job => job.status === 'completed')

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return '#4CAF50'
      case 'in-progress': return '#FF9800'
      case 'completed': return '#2196F3'
      default: return '#666'
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Welcome, {user.name}!</h1>
          <p>Post your service requirements and get them done</p>
        </div>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </header>

      <div className="dashboard-content">
        {successMessage && (
          <div className="success-message">
            <span>✓</span> {successMessage}
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card">
            <h3>{openJobs.length}</h3>
            <p>Open Jobs</p>
          </div>
          <div className="stat-card">
            <h3>{inProgressJobs.length}</h3>
            <p>In Progress</p>
          </div>
          <div className="stat-card">
            <h3>{completedJobs.length}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="action-section">
          <button onClick={() => {
            setShowForm(!showForm)
            setSuccessMessage('')
          }} className="primary-btn">
            {showForm ? 'Cancel' : '+ Post New Job'}
          </button>
        </div>

        {showForm && (
          <div className="job-form-card">
            <h2>Post a New Job</h2>
            <form onSubmit={handleSubmit} className="job-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Job Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Fix leaking pipe"
                  />
                </div>
                <div className="form-group">
                  <label>Service Type</label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    required
                    className="select-input"
                  >
                    <option value="">Select service</option>
                    <option value="plumber">Plumber</option>
                    <option value="welder">Welder</option>
                    <option value="electrician">Electrician</option>
                    <option value="carpenter">Carpenter</option>
                    <option value="painter">Painter</option>
                    <option value="mechanic">Mechanic</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Describe your requirement in detail..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Your address"
                  />
                </div>
                <div className="form-group">
                  <label>Budget (Rs)</label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="100"
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn">Post Job</button>
            </form>
          </div>
        )}

        <div className="jobs-section">
          <h2>My Jobs</h2>
          {myJobs.length === 0 ? (
            <div className="empty-state">
              <p>No jobs posted yet. Post your first job to get started!</p>
            </div>
          ) : (
            <div className="jobs-grid">
              {myJobs.map(job => (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <h3>{job.title}</h3>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(job.status) }}
                    >
                      {job.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="job-service">Service: <strong>{job.serviceType}</strong></p>
                  <p className="job-description">{job.description}</p>
                  <div className="job-details">
                    <p><strong>Budget:</strong> Rs {job.budget}</p>
                    <p><strong>Address:</strong> {job.address}</p>
                    {job.acceptedBy && (
                      <p><strong>Accepted by:</strong> {job.acceptedBy.name} ({job.acceptedBy.profession})</p>
                    )}
                  </div>
                  {job.status === 'completed' && (
                    <div className="payment-info">
                      <p><strong>Platform Commission (10%):</strong> Rs {(job.budget * 0.1).toFixed(2)}</p>
                      <p><strong>Professional Payment:</strong> Rs {(job.budget * 0.9).toFixed(2)}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard

