import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { getCurrentUser } from '../utils/auth'
import './Navbar.css'

const Navbar = () => {
  const [user, setUser] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
    setIsMenuOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setIsMenuOpen(false)}>
          <span className="logo-icon">🔧</span>
          <span className="logo-text">ServiceHub</span>
        </Link>

        <button 
          className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
          <Link 
            to="/" 
            className={`navbar-link ${isActive('/')}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Browse Jobs
          </Link>

          {user ? (
            <>
              {user.type === 'customer' ? (
                <Link 
                  to="/customer" 
                  className={`navbar-link ${isActive('/customer')}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Dashboard
                </Link>
              ) : (
                <Link 
                  to="/professional" 
                  className={`navbar-link ${isActive('/professional')}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Dashboard
                </Link>
              )}
              <div className="navbar-user">
                <span className="user-name">👤 {user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="navbar-link logout-btn"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`navbar-link ${isActive('/login')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className={`navbar-link signup-link ${isActive('/signup')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

