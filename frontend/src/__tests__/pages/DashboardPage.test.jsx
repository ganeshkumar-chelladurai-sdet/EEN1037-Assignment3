import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DashboardPage from '../../pages/DashboardPage'
import { AuthContext } from '../../context/AuthContext'
import { vi } from 'vitest'

describe('DashboardPage', () => {
  const mockUser = { username: 'testuser' }

  test('fetches and displays balance from API', async () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: mockUser }}>
          <DashboardPage />
        </AuthContext.Provider>
      </MemoryRouter>
    )

    // Wait for the total balance to appear (Calculated from mockAccounts: 1250.50 + 5000.00 = 6250.50)
    await waitFor(() => {
      expect(screen.getByText('€6250.50')).toBeDefined()
    })
    expect(screen.getByText('Daily Spending')).toBeDefined()
  })
})
