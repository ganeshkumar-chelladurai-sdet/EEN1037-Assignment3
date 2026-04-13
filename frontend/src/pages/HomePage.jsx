import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import '../styles/style.css'

// Homepage: introduces the DUB Bank application with a cover image and description
function HomePage() {
  const { user } = useAuth()

  return (
    <main>
      {/* Homepage hero section */}
      <section className="hero-section" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '20px', lineHeight: '1.2' }}>
          Secure Banking <br />
          <span style={{ color: 'var(--primary)' }}>Simplified.</span>
        </h1>
        
        <p className="site-description" style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 40px' }}>
          Welcome to DUB Bank. Manage your accounts, transfer funds instantly, 
          and track your expenses with our state-of-the-art digital platform.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '60px' }}>
          {user ? (
            <Link to="/dashboard" className="btn-transfer" style={{ textDecoration: 'none', padding: '15px 40px' }}>
              Access Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-transfer" style={{ textDecoration: 'none', padding: '15px 40px' }}>
                Sign In
              </Link>
              <Link to="/register" style={{ textDecoration: 'none', padding: '15px 40px', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}>
                Join Now
              </Link>
            </>
          )}
        </div>

        {/* Cover image representing the banking application */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            className="site-cover-photo"
            src="/dark_banking_hero_1776105318337.png"
            alt="DUB Bank Interface preview"
            style={{ width: '100%', maxWidth: '900px', height: 'auto' }}
          />
        </div>
      </section>

      {/* Features summary section */}
      <section className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', margin: '60px auto' }}>
        <div className="feature-card" style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '15px' }}>Instant Transfers</h3>
          <p style={{ color: 'var(--text-muted)' }}>Move money between accounts or to friends instantly with zero fees.</p>
        </div>
        <div className="feature-card" style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '15px' }}>Smart Dashboard</h3>
          <p style={{ color: 'var(--text-muted)' }}>Get a 360-degree view of your finances with our intuitive analytics.</p>
        </div>
        <div className="feature-card" style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '15px' }}>Global Security</h3>
          <p style={{ color: 'var(--text-muted)' }}>Multi-factor authentication and AES-256 encryption keep your data safe.</p>
        </div>
      </section>
    </main>
  )
}

export default HomePage
