import { render, screen, fireEvent } from '@testing-library/react'
import AccountCard from '../../components/AccountCard'
import { vi } from 'vitest'

describe('AccountCard Component', () => {
  const mockAccount = {
    id: 1,
    account_number: 'DUB-1234',
    account_type: 'Current',
    balance: '1500.00',
    nickname: 'Primary Account',
    status: 'Active'
  }

  test('renders account details correctly', () => {
    render(<AccountCard account={mockAccount} onEditNickname={() => {}} />)
    expect(screen.getByText('Primary Account')).toBeDefined()
    expect(screen.getByText('DUB-1234')).toBeDefined()
    expect(screen.getByText('€1500.00')).toBeDefined()
  })

  test('calls onEditNickname when button clicked', () => {
    const handleEdit = vi.fn()
    render(<AccountCard account={mockAccount} onEditNickname={handleEdit} />)
    fireEvent.click(screen.getByText('Edit Nickname'))
    expect(handleEdit).toHaveBeenCalledWith(mockAccount)
  })
})
