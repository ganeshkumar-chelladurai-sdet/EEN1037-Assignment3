import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import api from '../api/client'
import '../styles/style.css'

// TransferPage: allows users to transfer funds between accounts
function TransferPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [accounts, setAccounts] = useState([])
  const [transfers, setTransfers] = useState([])
  const [fromAccount, setFromAccount] = useState('')
  const [toAccount, setToAccount] = useState('')
  const [toAccountNumber, setToAccountNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [transferType, setTransferType] = useState('own')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const fetchData = async () => {
    try {
      const [accs, txs] = await Promise.all([
        api.get('/api/accounts/'),
        api.get('/api/transfers/')
      ])
      setAccounts(accs)
      setTransfers(txs)
    } catch (err) {
      console.error('Failed to fetch data')
    }
  }

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchData()
  }, [user, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const targetAccount = transferType === 'own' ? toAccount : toAccountNumber

    try {
      await api.post('/api/transfers/', {
        from_account: fromAccount,
        to_account_number: targetAccount,
        amount: parseFloat(amount),
        description: 'Online Transfer'
      })
      setSuccess('Transfer successful!')
      setAmount('')
      setToAccountNumber('')
      fetchData()
    } catch (err) {
      setError(err?.detail || 'Transfer failed. Check balance.')
    }
  }

  return (
    <main>
      <section className="transfer-section" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '40px' }}>
        
        <div>
          <h2 className="transfer-title">Transfer Funds</h2>
          <p className="transfer-description">Move money instantly to your own accounts or external banks.</p>
          
          {error && <p style={{ color: '#ff4444', marginBottom: '15px', textAlign: 'center' }}>{error}</p>}
          {success && <p style={{ color: 'var(--primary)', marginBottom: '15px', textAlign: 'center' }}>{success}</p>}

          <form onSubmit={handleSubmit} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px',
            background: 'var(--bg-card)',
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid var(--border)'
          }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label>From Account</label>
              <select value={fromAccount} onChange={(e) => setFromAccount(e.target.value)} required>
                <option value="">Select source account</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.nickname || acc.account_type} ({acc.account_number}) - €{acc.balance}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label>Transfer To</label>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '5px' }}>
                <label style={{ fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input type="radio" checked={transferType === 'own'} onChange={() => setTransferType('own')} /> My Accounts
                </label>
                <label style={{ fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input type="radio" checked={transferType === 'external'} onChange={() => setTransferType('external')} /> External
                </label>
              </div>

              {transferType === 'own' ? (
                <select value={toAccount} onChange={(e) => setToAccount(e.target.value)} required>
                  <option value="">Select destination</option>
                  {accounts.filter(a => String(a.id) !== String(fromAccount)).map(acc => (
                    <option key={acc.id} value={acc.account_number}>
                      {acc.nickname || acc.account_type} ({acc.account_number})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Recipient Account Number"
                  value={toAccountNumber}
                  onChange={(e) => setToAccountNumber(e.target.value)}
                  required
                />
              )}
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label>Amount (€)</label>
              <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required min="0.01" />
            </div>

            <button type="submit" className="btn-transfer" style={{ 
              background: 'var(--primary)', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' 
            }}>
              Execute Transfer
            </button>
          </form>
        </div>

        <div>
          <h3 style={{ marginBottom: '20px', fontSize: '1.4rem' }}>Recent Transfer Activity</h3>
          <div className="transaction-history-section" style={{ padding: 0, background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
             <table className="transaction-table" style={{ margin: 0 }}>
               <thead>
                 <tr>
                    <th>Date</th>
                    <th>Recipient</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                 </tr>
               </thead>
               <tbody>
                 {transfers.slice(0, 8).map(t => (
                   <tr key={t.id}>
                     <td>{new Date(t.created_at).toLocaleDateString()}</td>
                     <td>{t.to_account_number}</td>
                     <td style={{ textAlign: 'right' }}>€{parseFloat(t.amount).toFixed(2)}</td>
                   </tr>
                 ))}
                 {transfers.length === 0 && <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No recent transfers.</td></tr>}
               </tbody>
             </table>
          </div>
        </div>

      </section>
    </main>
  )
}

export default TransferPage
