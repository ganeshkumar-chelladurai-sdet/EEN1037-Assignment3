import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import '../styles/style.css'

// RegisterPage: allows new users to create a DUB Bank account
function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  // Form state for all registration fields
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)

  // Handles form submission — validates passwords match then calls register
  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    // Client-side validation: passwords must match before submitting
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      await register(username, email, password)
      navigate('/dashboard')
    } catch {
      setError('Registration failed. Username or email may already be in use.')
    }
  }

  return (
    <main>
      {/* Registration container section */}
      <section className="register-section">

        {/* Page heading explaining the purpose of the page */}
        <h2 className="register-title">Create Your DUB Bank Account</h2>

        {/* Short description guiding new users */}
        <p className="register-description">
          Register for a new DUB Bank account to access secure online banking,
          manage your finances, and perform transactions with ease.
        </p>

        {/* Display error message if registration fails */}
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        {/* Registration form */}
        <form className="register-form" onSubmit={handleSubmit} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px', 
          maxWidth: '450px', 
          margin: '0 auto',
          padding: '40px',
          background: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border)'
        }}>

          {/* Username field */}
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email input field */}
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password field */}
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Password confirmation field */}
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit button */}
          <button type="submit" className="register-button" style={{ 
            marginTop: '10px',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            padding: '14px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Create Account
          </button>

        </form>

        {/* Section providing a link to the login page for existing users */}
        <div className="register-extra">
          <p>
            Already have an account?{' '}
            <Link to="/login">Login here</Link>
          </p>
        </div>

      </section>
    </main>
  )
}

export default RegisterPage
