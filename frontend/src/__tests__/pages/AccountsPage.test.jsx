import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AccountsPage from '../../pages/AccountsPage'
import { AuthContext } from '../../context/AuthContext'

describe('AccountsPage', () => {
  const mockUser = { username: 'testuser', is_staff: true }

  test('renders account numbers and staff-only buttons', async () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: mockUser }}>
          <AccountsPage />
        </AuthContext.Provider>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('DUB-1001')).toBeDefined()
    })
    expect(screen.getByText('+ Create Account (Staff)')).toBeDefined()
  })
})
