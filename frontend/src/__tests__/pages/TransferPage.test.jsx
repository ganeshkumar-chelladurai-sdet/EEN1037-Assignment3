import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TransferPage from '../../pages/TransferPage'
import { AuthContext } from '../../context/AuthContext'

describe('TransferPage', () => {
  const mockUser = { username: 'testuser' }

  test('loads accounts and ready for input', async () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: mockUser }}>
          <TransferPage />
        </AuthContext.Provider>
      </MemoryRouter>
    )

    await waitFor(() => {
      const options = screen.getAllByRole('option')
      // 1 default "Select source account" + 2 mock accounts = 3
      expect(options.length).toBeGreaterThanOrEqual(3)
    })
    expect(screen.getByText('Execute Transfer')).toBeDefined()
  })
})
