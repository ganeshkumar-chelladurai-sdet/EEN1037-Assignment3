import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProfilePage from '../../pages/ProfilePage'
import { AuthContext } from '../../context/AuthContext'

describe('ProfilePage', () => {
  const mockUser = { username: 'testuser' }

  test('loads and displays profile details', async () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: mockUser }}>
          <ProfilePage />
        </AuthContext.Provider>
      </MemoryRouter>
    )

    await waitFor(() => {
      // Input with value "Test User" from mockProfile.fullname (initially mapped from user.username if missing, but mock handles it)
      const input = screen.getByLabelText(/Username/i)
      expect(input.getAttribute('value')).toBe('testuser')
    })
    expect(screen.getByText('Change Photo')).toBeDefined()
  })
})
