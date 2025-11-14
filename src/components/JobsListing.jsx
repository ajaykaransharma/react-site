import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../utils/auth'
import './JobsListing.css'

const JobsListing = () => {
  const [jobs, setJobs] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const loadJobs = useCallback(() => {
    const savedJobs = localStorage.getItem('jobs')
    if (savedJobs) {
      try {
        const parsedJobs = JSON.parse(savedJobs)
        // Only show open jobs on public listing
        const openJobs = parsedJobs.filter(job => job.status === 'open')
        setJobs(openJobs)
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
    // Refresh jobs every 3 seconds
    const interval = setInterval(loadJobs, 3000)
    
    // Check if user is logged in
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }

    return () => clearInterval(interval)
  }, [loadJobs])

  const getFilteredJobs = () => {
    let filtered = jobs

    // Apply service type filter
    if (filter !== 'all') {
      filtered = filtered.filter(job => job.serviceType === filter)
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(term) ||
        job.description.toLowerCase().includes(term) ||
        job.address.toLowerCase().includes(term) ||
        job.serviceType.toLowerCase().includes(term)
      )
    }

    return filtered
  }

  const serviceTypes = ['all', 'plumber', 'welder', 'electrician', 'carpenter', 'painter', 'mechanic', 'other']
  const filteredJobs = getFilteredJobs()

  const handleGetStarted = () => {
    if (user) {
      navigate(user.type === 'customer' ? '/customer' : '/professional')
    } else {
      navigate('/signup')
    }
  }

  return (
    <div className="jobs-listing-page">
      <header className="listing-header">
        <div className="header-content">
          <h1>Service Management Platform</h1>
          <p className="header-subtitle">Find skilled professionals for your service needs</p>
          <div className="header-actions">
            {user ? (
              <div className="user-info">
                <span>Welcome, {user.name}!</span>
                <Link to={user.type === 'customer' ? '/customer' : '/professional'} className="dashboard-link">
                  Go to Dashboard
                </Link>
                <button
                  className="logout-link"
                  onClick={() => {
                    localStorage.removeItem('user')
                    setUser(null)
                    navigate('/')
                  }}
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="login-link">Sign In</Link>
                <Link to="/signup" className="signup-link">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="listing-content">
        <div className="stats-banner">
          <div className="stat-item">
            <h2>{jobs.length}</h2>
            <p>Available Jobs</p>
          </div>
          <div className="stat-item">
            <h2>{new Set(jobs.map(job => job.serviceType)).size}</h2>
            <p>Service Categories</p>
          </div>
          <div className="stat-item">
            <h2>Rs {jobs.reduce((sum, job) => sum + (job.budget || 0), 0).toLocaleString()}</h2>
            <p>Total Budget Available</p>
          </div>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search jobs by title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-buttons">
            {serviceTypes.map(type => (
              <button
                key={type}
                className={`filter-btn ${filter === type ? 'active' : ''}`}
                onClick={() => setFilter(type)}
              >
                {type === 'all' ? 'All Jobs' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="jobs-section">
          <div className="section-header">
            <h2>
              {filter === 'all' ? 'All Available Jobs' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Jobs`}
              {searchTerm && ` - "${searchTerm}"`}
            </h2>
            <p className="results-count">{filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found</p>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No jobs found</h3>
              <p>
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Be the first to post a job! Get started by signing up.'}
              </p>
              {!user && (
                <button onClick={handleGetStarted} className="cta-button">
                  Get Started
                </button>
              )}
            </div>
          ) : (
            <div className="jobs-grid">
              {filteredJobs.map(job => (
                <div key={job.id} className="job-card-public">
                  <div className="job-card-header">
                    <div className="job-type-badge">
                      {job.serviceType.charAt(0).toUpperCase() + job.serviceType.slice(1)}
                    </div>
                    <div className="job-budget">
                      <span className="budget-label">Budget</span>
                      <span className="budget-amount">Rs {job.budget.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-description">{job.description}</p>
                  
                  <div className="job-details">
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span>{job.address}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">👤</span>
                      <span>{job.customerName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="payment-breakdown">
                    <p><strong>Payment Breakdown:</strong></p>
                    <p>Platform Commission (10%): Rs {(job.budget * 0.1).toFixed(2)}</p>
                    <p className="earnings">Professional Earnings: Rs {(job.budget * 0.9).toFixed(2)}</p>
                  </div>

                  <div className="job-card-actions">
                    {user ? (
                      user.type === 'professional' ? (
                        <Link to="/professional" className="action-btn primary">
                          View & Accept
                        </Link>
                      ) : (
                        <Link to="/customer" className="action-btn secondary">
                          View Dashboard
                        </Link>
                      )
                    ) : (
                      <>
                        <Link to="/signup" className="action-btn primary">
                          Sign Up to Apply
                        </Link>
                        <Link to="/login" className="action-btn secondary">
                          Sign In
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!user && filteredJobs.length > 0 && (
          <div className="cta-section">
            <h2>Ready to Get Started?</h2>
            <p>Join our platform to post jobs or find work opportunities</p>
            <div className="cta-buttons">
              <Link to="/signup" className="cta-button primary">
                Sign Up Now
              </Link>
              <Link to="/login" className="cta-button secondary">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobsListing

