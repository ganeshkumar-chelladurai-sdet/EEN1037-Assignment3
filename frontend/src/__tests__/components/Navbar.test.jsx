import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { AuthContext } from '../../context/AuthContext'

describe('Navbar Component', () => {
  const renderNavbar = (user) => {
    return render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user, logout: () => {} }}>
          <Navbar />
        </AuthContext.Provider>
      </MemoryRouter>
    )
  }

  test('shows login/register when not logged in', () => {
    renderNavbar(null)
    expect(screen.getByText(/Login/i)).toBeDefined()
    expect(screen.getByText(/Register/i)).toBeDefined()
  })

  test('shows dashboard/logout when logged in', () => {
    renderNavbar({ username: 'testuser' })
    expect(screen.getByText(/Dashboard/i)).toBeDefined()
    expect(screen.getByText(/Logout/i)).toBeDefined()
  })
})
