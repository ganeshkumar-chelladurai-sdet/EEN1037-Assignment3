import { render, screen } from '@testing-library/react'
import TransactionTable from '../../components/TransactionTable'

describe('TransactionTable Component', () => {
  const mockTransactions = [
    { id: 1, account_number: 'DUB-1', transaction_type: 'Deposit', amount: '100.00', status: 'Completed', created_at: '2025-01-01' },
    { id: 2, account_number: 'DUB-1', transaction_type: 'Transfer Out', amount: '20.00', status: 'Completed', created_at: '2025-01-02' },
  ]

  test('renders multiple transaction rows', () => {
    render(<TransactionTable transactions={mockTransactions} />)
    expect(screen.getByText('Deposit')).toBeDefined()
    expect(screen.getByText('Transfer Out')).toBeDefined()
    expect(screen.getByText('€100.00')).toBeDefined()
    expect(screen.getByText('€20.00')).toBeDefined()
  })

  test('renders empty message when no transactions', () => {
    render(<TransactionTable transactions={[]} />)
    expect(screen.getByText(/No transactions found/i)).toBeDefined()
  })
})
