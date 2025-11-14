import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import CustomerDashboard from './components/CustomerDashboard'
import ProfessionalDashboard from './components/ProfessionalDashboard'
import JobsListing from './components/JobsListing'
import './App.css'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
    // Keep jobs in localStorage so they persist across sessions
    // localStorage.removeItem('jobs')
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<JobsListing />} />
          <Route path="/jobs" element={<JobsListing />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to={user.type === 'customer' ? '/customer' : '/professional'} /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/signup" 
            element={user ? <Navigate to={user.type === 'customer' ? '/customer' : '/professional'} /> : <Signup onLogin={handleLogin} />} 
          />
          <Route 
            path="/customer" 
            element={user && user.type === 'customer' ? <CustomerDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/professional" 
            element={user && user.type === 'professional' ? <ProfessionalDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App

