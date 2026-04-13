import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import api from '../api/client'
import AccountCard from '../components/AccountCard'
import '../styles/style.css'

// DashboardPage: shows a summary of the user's account balances and recent activity
function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // State to hold account data fetched from the REST API
  const [accounts, setAccounts] = useState([])
  const [txCount, setTxCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch data function
  const fetchData = () => {
    // Fetch accounts from the backend REST API
    api.get('/api/accounts/')
      .then((data) => setAccounts(data))
      .catch(() => setAccounts([]))

    // Fetch transaction count from the backend REST API
    api.get('/api/transactions/')
      .then((data) => setTxCount(data.length))
      .catch(() => setTxCount(0))
      .finally(() => setLoading(false))
  }

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchData()
  }, [user, navigate])

  // Handle Nickname Update (PUT method)
  async function handleEditNickname(account) {
    const newNickname = window.prompt('Enter new nickname for this account:', account.nickname || '')
    if (newNickname === null) return

    try {
      await api.put(`/api/accounts/${account.id}/`, {
        ...account,
        nickname: newNickname
      })
      fetchData() // Refresh UI
    } catch (err) {
      alert('Failed to update nickname: ' + (err.message || 'Error'))
    }
  }

  if (loading) return <p style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)' }}>Loading dashboard...</p>

  // Calculate total balance across all user accounts
  const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0)

  return (
    <main>
      {/* Dashboard overview container */}
      <section className="dashboard-section">

        {/* Main heading for the dashboard page */}
        <h2 className="dashboard-title">Welcome back, {user?.username}</h2>

        {/* Short explanation describing the purpose of the dashboard */}
        <p className="dashboard-description">
          Monitor your balances, manage your accounts, and track your recent activity from your DUB Bank dashboard.
        </p>

        {/* Summary Stats Card */}
        <article className="dashboard-card" style={{ marginBottom: '30px', background: 'linear-gradient(135deg, var(--bg-card), rgba(16, 185, 129, 0.1))' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div>
               <p className="dashboard-label">Total Liquid Assets</p>
               <p className="dashboard-value" style={{ fontSize: '3rem' }}>€{totalBalance.toFixed(2)}</p>
             </div>
             <div style={{ textAlign: 'right' }}>
               <p className="dashboard-label">Total Active Accounts</p>
               <p className="dashboard-value" style={{ fontSize: '1.8rem' }}>{accounts.length}</p>
             </div>
           </div>
        </article>

        <h3 style={{ marginBottom: '20px', fontSize: '1.4rem' }}>My Accounts</h3>
        {/* Container for the dashboard summary cards */}
        <section className="dashboard-cards">
          {accounts.map(account => (
            <AccountCard 
              key={account.id} 
              account={account} 
              onEditNickname={handleEditNickname}
            />
          ))}
          {accounts.length === 0 && <p className="dashboard-label">No accounts found. Contact staff to open one.</p>}
        </section>

      </section>
    </main>
  )
}

export default DashboardPage
