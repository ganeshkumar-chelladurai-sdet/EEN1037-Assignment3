import React from 'react'

/**
 * AccountCard component
 * Displays a summary of a single bank account with a premium look.
 */
function AccountCard({ account, onEditNickname }) {
  const isSavings = account.account_type?.toLowerCase().includes('saving')

  return (
    <article className="dashboard-card" style={{ 
      borderLeft: `5px solid ${isSavings ? 'var(--secondary)' : 'var(--primary)'}`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{ margin: 0 }}>{account.nickname || account.account_type}</h3>
          <span style={{ 
            fontSize: '0.7rem', 
            background: 'var(--glass-bg)', 
            padding: '2px 8px', 
            borderRadius: '10px',
            color: 'var(--text-muted)'
          }}>
            {account.status}
          </span>
        </div>
        <p className="dashboard-label" style={{ fontSize: '0.75rem', marginTop: '5px' }}>
          {account.account_number}
        </p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <p className="dashboard-value" style={{ fontSize: '1.8rem', margin: 0 }}>
          €{parseFloat(account.balance).toFixed(2)}
        </p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
           <button 
            onClick={() => onEditNickname(account)}
            style={{ 
              fontSize: '0.7rem', 
              padding: '4px 8px', 
              background: 'transparent', 
              border: '1px solid var(--border)',
              color: 'var(--text-muted)'
            }}
          >
            Edit Nickname
          </button>
        </div>
      </div>
    </article>
  )
}

export default AccountCard
