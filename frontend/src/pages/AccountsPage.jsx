import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import api from '../api/client'
import AccountCard from '../components/AccountCard'
import '../styles/style.css'

// AccountsPage: provides a detailed view of all accounts belonging to the user
function AccountsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // State to hold list of accounts
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAccounts = () => {
    api.get('/api/accounts/')
      .then((data) => setAccounts(data))
      .catch(() => setAccounts([]))
      .finally(() => setLoading(false))
  }

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchAccounts()
  }, [user, navigate])

  // STAFF ONLY: Create Account (POST method)
  async function handleCreateAccount() {
    const account_number = window.prompt("Enter new Account Number (e.g. DUB-XXXX):")
    if (!account_number) return
    const account_type = window.prompt("Enter Account Type (Current/Savings):", "Current")
    const username = window.prompt("Enter target Username for this account:", user.username)

    try {
      await api.post('/api/accounts/', {
        account_number,
        account_type,
        username,
        balance: 0.00,
        status: 'Active'
      })
      alert('Account created successfully!')
      fetchAccounts()
    } catch (err) {
      alert('Failed to create account. Ensure you have staff permissions.')
    }
  }

  // STAFF ONLY: Delete Account (DELETE method)
  async function handleDeleteAccount(id) {
    if (!window.confirm('Are you sure you want to delete this account?')) return
    try {
      await api.delete(`/api/accounts/${id}/`)
      setAccounts(accounts.filter(a => a.id !== id))
    } catch {
      alert('Failed to delete account. Only staff can perform this action.')
    }
  }

  if (loading) return <p style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)' }}>Loading accounts...</p>

  return (
    <main>
      <section className="accounts-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h2 className="accounts-title">My Accounts</h2>
          {user?.is_staff && (
            <button className="btn-transfer" onClick={handleCreateAccount} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              + Create Account (Staff)
            </button>
          )}
        </div>
        
        <p className="accounts-description">
          Review your individual account balances and account numbers. Use the dashboard for a high-level summary.
        </p>

        <section className="dashboard-cards">
          {accounts.map(account => (
             <div key={account.id} style={{ position: 'relative' }}>
                <AccountCard account={account} onEditNickname={() => {}} />
                {user?.is_staff && (
                  <button 
                    onClick={() => handleDeleteAccount(account.id)}
                    style={{ 
                      position: 'absolute', top: '10px', right: '10px', 
                      background: '#ff444422', color: '#ff4444', border: 'none',
                      padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem'
                    }}
                  >
                    Delete
                  </button>
                )}
             </div>
          ))}
        </section>

        {accounts.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
            No accounts associated with your profile.
          </p>
        )}
      </section>
    </main>
  )
}

export default AccountsPage
