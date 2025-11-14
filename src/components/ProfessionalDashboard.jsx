import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'

const ProfessionalDashboard = ({ user, onLogout }) => {
  const [jobs, setJobs] = useState([])
  const [filter, setFilter] = useState('all')

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

  const handleAcceptJob = (jobId) => {
    const updatedJobs = jobs.map(job => {
      if (job.id === jobId && job.status === 'open') {
        return {
          ...job,
          status: 'in-progress',
          acceptedBy: {
            id: user.id,
            name: user.name,
            profession: user.profession
          }
        }
      }
      return job
    })
    saveJobs(updatedJobs)
  }

  const handleCompleteJob = (jobId) => {
    const updatedJobs = jobs.map(job => {
      if (job.id === jobId && job.status === 'in-progress' && job.acceptedBy?.id === user.id) {
        return {
          ...job,
          status: 'completed'
        }
      }
      return job
    })
    saveJobs(updatedJobs)
  }

  const availableJobs = jobs.filter(job => 
    job.status === 'open' && 
    job.serviceType === user.profession
  )

  const myAcceptedJobs = jobs.filter(job => 
    job.acceptedBy?.id === user.id
  )

  const inProgressJobs = myAcceptedJobs.filter(job => job.status === 'in-progress')
  const completedJobs = myAcceptedJobs.filter(job => job.status === 'completed')

  const totalEarnings = completedJobs.reduce((sum, job) => sum + (job.budget * 0.9), 0)
  const totalCommission = completedJobs.reduce((sum, job) => sum + (job.budget * 0.1), 0)

  const getFilteredJobs = () => {
    switch(filter) {
      case 'available':
        return availableJobs
      case 'my-jobs':
        return myAcceptedJobs
      case 'in-progress':
        return inProgressJobs
      case 'completed':
        return completedJobs
      default:
        return availableJobs
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Welcome, {user.name}!</h1>
          <p>{user.profession.charAt(0).toUpperCase() + user.profession.slice(1)} Professional</p>
        </div>
        <div className="header-actions">
          <Link to="/" className="view-jobs-btn">Browse All Jobs</Link>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{availableJobs.length}</h3>
            <p>Available Jobs</p>
          </div>
          <div className="stat-card">
            <h3>{inProgressJobs.length}</h3>
            <p>In Progress</p>
          </div>
          <div className="stat-card">
            <h3>{completedJobs.length}</h3>
            <p>Completed</p>
          </div>
          <div className="stat-card earnings">
            <h3>Rs {totalEarnings.toFixed(2)}</h3>
            <p>Total Earnings</p>
            <small>Platform commission: Rs {totalCommission.toFixed(2)}</small>
          </div>
        </div>

        <div className="filter-section">
          <button 
            className={filter === 'available' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('available')}
          >
            Available Jobs
          </button>
          <button 
            className={filter === 'my-jobs' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('my-jobs')}
          >
            My Jobs
          </button>
          <button 
            className={filter === 'in-progress' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('in-progress')}
          >
            In Progress
          </button>
          <button 
            className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        <div className="jobs-section">
          <h2>
            {filter === 'available' && 'Available Jobs for You'}
            {filter === 'my-jobs' && 'My Accepted Jobs'}
            {filter === 'in-progress' && 'Jobs In Progress'}
            {filter === 'completed' && 'Completed Jobs'}
          </h2>
          
          {getFilteredJobs().length === 0 ? (
            <div className="empty-state">
              <p>
                {filter === 'available' && 'No available jobs matching your profession at the moment.'}
                {filter === 'my-jobs' && 'You haven\'t accepted any jobs yet.'}
                {filter === 'in-progress' && 'No jobs in progress.'}
                {filter === 'completed' && 'No completed jobs yet.'}
              </p>
            </div>
          ) : (
            <div className="jobs-grid">
              {getFilteredJobs().map(job => (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <h3>{job.title}</h3>
                    {job.status !== 'open' && (
                      <span 
                        className="status-badge"
                        style={{ 
                          backgroundColor: job.status === 'in-progress' ? '#FF9800' : '#2196F3'
                        }}
                      >
                        {job.status.replace('-', ' ').toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="job-service">Service: <strong>{job.serviceType}</strong></p>
                  <p className="job-description">{job.description}</p>
                  <div className="job-details">
                    <p><strong>Budget:</strong> Rs {job.budget}</p>
                    <p><strong>Address:</strong> {job.address}</p>
                    <p><strong>Customer:</strong> {job.customerName}</p>
                  </div>
                  
                  {job.status === 'open' && (
                    <div className="payment-breakdown">
                      <p><strong>Payment Breakdown:</strong></p>
                      <p>Platform Commission (10%): Rs {(job.budget * 0.1).toFixed(2)}</p>
                      <p>Your Earnings: Rs {(job.budget * 0.9).toFixed(2)}</p>
                    </div>
                  )}

                  {job.status === 'completed' && (
                    <div className="payment-info">
                      <p><strong>Payment Received:</strong></p>
                      <p>Platform Commission (10%): Rs {(job.budget * 0.1).toFixed(2)}</p>
                      <p className="earnings-highlight">Your Earnings: Rs {(job.budget * 0.9).toFixed(2)}</p>
                    </div>
                  )}

                  <div className="job-actions">
                    {job.status === 'open' && (
                      <button 
                        onClick={() => handleAcceptJob(job.id)}
                        className="accept-btn"
                      >
                        Accept Job
                      </button>
                    )}
                    {job.status === 'in-progress' && job.acceptedBy?.id === user.id && (
                      <button 
                        onClick={() => handleCompleteJob(job.id)}
                        className="complete-btn"
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfessionalDashboard

