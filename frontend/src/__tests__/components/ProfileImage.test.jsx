import { render, screen } from '@testing-library/react'
import ProfileImage from '../../components/ProfileImage'

describe('ProfileImage Component', () => {
  test('renders image with correct src', () => {
    render(<ProfileImage username="testuser" size={50} />)
    const img = screen.getByAltText('testuser')
    expect(img.getAttribute('src')).toContain('/api/profile/photo/')
  })

  test('renders initials on error', () => {
    render(<ProfileImage username="Alice" size={50} />)
    const img = screen.getByAltText('Alice')
    // Trigger error manually for test
    img.dispatchEvent(new Event('error'))
    expect(screen.getByText('A')).toBeDefined()
  })
})
