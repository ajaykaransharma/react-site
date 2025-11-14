// Authentication utility functions

// Simple password hashing (for demo purposes - use proper hashing in production)
const hashPassword = (password) => {
  // Simple hash function for demo - in production use bcrypt or similar
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString()
}

// Register a new user
export const registerUser = (userData) => {
  const users = getUsers()
  
  // Check if user already exists
  const existingUser = users.find(u => u.email === userData.email)
  if (existingUser) {
    return { success: false, message: 'User with this email already exists' }
  }

  // Create new user
  const newUser = {
    id: Date.now(),
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    password: hashPassword(userData.password), // Hash password
    type: userData.type,
    profession: userData.type === 'professional' ? userData.profession : null,
    createdAt: new Date().toISOString()
  }

  users.push(newUser)
  localStorage.setItem('users', JSON.stringify(users))
  
  return { success: true, user: newUser }
}

// Login user
export const loginUser = (email, password) => {
  const users = getUsers()
  const hashedPassword = hashPassword(password)
  
  const user = users.find(u => u.email === email && u.password === hashedPassword)
  
  if (!user) {
    return { success: false, message: 'Invalid email or password' }
  }

  // Return user data without password
  const { password: _, ...userWithoutPassword } = user
  return { success: true, user: userWithoutPassword }
}

// Get all users from localStorage
export const getUsers = () => {
  const users = localStorage.getItem('users')
  return users ? JSON.parse(users) : []
}

// Get current logged in user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('user')
}

