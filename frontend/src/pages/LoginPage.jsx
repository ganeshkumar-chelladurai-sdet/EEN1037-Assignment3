import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import '../styles/style.css'

// LoginPage: allows users to authenticate with their username and password
function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  // Form state for username and password fields
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  // Handles form submission — sends credentials to the backend via AuthContext
  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      await login(username, password)
      navigate('/dashboard')
    } catch {
      setError('Invalid username or password. Please try again.')
    }
  }

  return (
    <main>
      {/* Login container section */}
      <section className="login-section">

        {/* Page heading clearly indicating the purpose of this page */}
        <h2 className="page-title">Login to DUB Bank</h2>

        {/* Short explanation guiding the user on how to log in */}
        <p className="page-description">
          Please enter your registered username and password to securely
          access your DUB Bank online banking account.
        </p>

        {/* Display error message if login fails */}
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        {/* Login form — submits credentials to the backend */}
        <form className="login-form" onSubmit={handleSubmit} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px', 
          maxWidth: '400px', 
          margin: '0 auto',
          padding: '40px',
          background: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border)'
        }}>

          {/* Username input field */}
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password input field for user authentication */}
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit button that sends the login form data */}
          <button type="submit" className="login-button" style={{ 
            marginTop: '10px',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            padding: '14px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Sign In
          </button>

        </form>

        {/* Link to register page for new users */}
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Don&apos;t have an account? <Link to="/register">Register here</Link>
        </p>

      </section>
    </main>
  )
}

export default LoginPage
