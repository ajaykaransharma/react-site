import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../utils/auth'
import './Login.css'

const Signup = ({ onLogin }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    type: 'customer',
    profession: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('') // Clear error when user types
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate inputs
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    if (formData.type === 'professional' && !formData.profession) {
      setError('Please select your profession')
      setLoading(false)
      return
    }

    // Attempt registration
    const result = registerUser(formData)

    if (result.success) {
      // Auto-login after successful registration
      const { password: _, confirmPassword: __, ...userData } = result.user
      onLogin(userData)
      // Navigate to appropriate dashboard
      navigate(userData.type === 'customer' ? '/customer' : '/professional')
    } else {
      setError(result.message || 'Registration failed. Please try again.')
    }
    
    setLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Create Account</h1>
        <p className="subtitle">Sign up to get started</p>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password (min 6 characters)"
              disabled={loading}
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>I am a</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="select-input"
              disabled={loading}
            >
              <option value="customer">Customer / Householder</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          {formData.type === 'professional' && (
            <div className="form-group">
              <label>Profession</label>
              <select
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required
                className="select-input"
                disabled={loading}
              >
                <option value="">Select profession</option>
                <option value="plumber">Plumber</option>
                <option value="welder">Welder</option>
                <option value="electrician">Electrician</option>
                <option value="carpenter">Carpenter</option>
                <option value="painter">Painter</option>
                <option value="mechanic">Mechanic</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in here</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Signup

