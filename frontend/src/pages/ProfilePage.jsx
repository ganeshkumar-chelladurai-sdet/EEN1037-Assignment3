import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import api from '../api/client'
import ProfileImage from '../components/ProfileImage'
import '../styles/style.css'

// ProfilePage: allows users to view and update their personal profile information
function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // State to hold profile data fetched from the REST API
  const [profile, setProfile] = useState(null)
  const [fullname, setFullname] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    // Fetch profile information from the backend REST API
    api.get('/api/profile/')
      .then((data) => {
        setProfile(data)
        setFullname(data.fullname || user.username)
        setPhone(data.phone || '')
        setAddress(data.address || '')
      })
      .catch(() => {
        // If profile fetch fails, fall back to user data
        setFullname(user.username)
      })
  }, [user, navigate])

  // Handles profile update form submission
  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      await api.patch('/api/profile/', { fullname, phone, address })
      setSuccess('Profile updated successfully!')
    } catch {
      setError('Failed to update profile. Please try again.')
    }
  }

  // Handles photo upload
  async function handlePhotoUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      await api.post('/api/profile/photo/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setSuccess('Photo uploaded successfully!')
      // Force refresh profile data to show new image
      const data = await api.get('/api/profile/')
      setProfile(data)
    } catch (err) {
      setError('Photo upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <main>
      {/* Profile management container */}
      <section className="profile-section">

        {/* Main heading for the profile page */}
        <h2 className="profile-title">User Profile</h2>

        {/* Short description explaining the purpose of the profile page */}
        <p className="profile-description">
          Manage your personal information and update account details securely.
        </p>

        {/* Display feedback messages */}
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}
        {success && <p style={{ color: 'green', textAlign: 'center', marginBottom: '15px' }}>{success}</p>}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px', gap: '15px' }}>
          <ProfileImage username={user?.username} />
          <div style={{ position: 'relative' }}>
            <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '5px 15px' }}>
              {uploading ? 'Uploading...' : 'Change Photo'}
            </button>
            <input 
              type="file" 
              onChange={handlePhotoUpload} 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
              accept="image/*"
              disabled={uploading}
            />
          </div>
        </div>

        {/* Profile update form */}
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>

          {/* Profile information displayed in a table format for clarity */}
          <table className="profile-table">
            <tbody>

              {/* Full name field editable by the user */}
              <tr>
                <th>Full Name</th>
                <td>
                  <input
                    type="text"
                    name="fullname"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </td>
              </tr>

              {/* Email field displayed as read-only information */}
              <tr>
                <th>Email</th>
                <td>{user?.email}</td>
              </tr>

              {/* Phone number field retrieved from the user profile model */}
              <tr>
                <th>Phone</th>
                <td>
                  <input
                    type="text"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </td>
              </tr>

              {/* Address field that users can update */}
              <tr>
                <th>Address</th>
                <td>
                  <input
                    type="text"
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </td>
              </tr>

              {/* Date of birth displayed from the profile model — read-only */}
              <tr>
                <th>Date of Birth</th>
                <td>{profile?.date_of_birth || 'N/A'}</td>
              </tr>

            </tbody>
          </table>

          {/* Action buttons for profile management */}
          <div className="profile-actions">
            <button type="submit" className="btn-update">Update Profile</button>
          </div>

        </form>
      </section>
    </main>
  )
}

export default ProfilePage
