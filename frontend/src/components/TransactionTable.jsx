import React from 'react'

/**
 * TransactionTable component
 * Reusable table for displaying transaction history records.
 */
function TransactionTable({ transactions }) {
  if (transactions.length === 0) {
    return <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No transactions found.</p>
  }

  return (
    <div className="transaction-history-section">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Account</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{new Date(t.created_at).toLocaleDateString()}</td>
              <td>{t.account_number || t.account}</td>
              <td style={{ 
                color: t.transaction_type?.includes('In') || t.transaction_type === 'Deposit' ? 'var(--primary)' : '#ff4444',
                fontWeight: '500'
              }}>
                {t.transaction_type}
              </td>
              <td>€{parseFloat(t.amount).toFixed(2)}</td>
              <td style={{ fontSize: '0.85rem' }}>{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TransactionTable
