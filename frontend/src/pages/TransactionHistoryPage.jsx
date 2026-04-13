import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import api from '../api/client'
import TransactionTable from '../components/TransactionTable'
import '../styles/style.css'

// TransactionHistoryPage: displays a detailed list of all financial transactions for the user
function TransactionHistoryPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // State to hold the transaction list fetched from the REST API
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    // Fetch transactions from the backend REST API
    api.get('/api/transactions/')
      .then((data) => {
        setTransactions(data)
      })
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false))
  }, [user, navigate])

  if (loading) return <p style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)' }}>Loading records...</p>

  return (
    <main>
      <section className="transaction-history-section-container">
        <h2 className="transaction-history-title">Transaction History</h2>
        
        <p className="transaction-description">
          Review your recent account activity, including transfers, deposits, and status changes.
        </p>

        {/* Use the modular TransactionTable component */}
        <TransactionTable transactions={transactions} />
      </section>
    </main>
  )
}

export default TransactionHistoryPage
