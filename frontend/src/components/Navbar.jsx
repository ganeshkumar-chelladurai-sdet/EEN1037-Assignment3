import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import '../styles/style.css'

// Navbar: provides site-wide navigation for DUB Bank
// Shows different links depending on whether the user is logged in or not
function Navbar() {
  const { user, loading: authLoading, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header>
      <nav>
        {/* Bank logo — also acts as a link back to the homepage */}
        <Link to="/" className="site-logo" style={{ textDecoration: 'none' }}>
           <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', letterSpacing: '-1.5px' }}>
            DUB<span style={{ color: 'var(--primary)' }}>BANK</span>
          </span>
        </Link>

        {/* Navigation links change depending on authentication status */}
        {authLoading ? (
          <span>Loading...</span>
        ) : user ? (
          /* Links available for logged-in users */
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/accounts">Accounts</Link>
            <Link to="/transfer">Transfer</Link>
            <Link to="/transactions">Transaction-History</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          /* Links shown when the user is not logged in */
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Navbar
