import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function StaffRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <p>Loading...</p>
  if (!user || !user.is_staff) return <Navigate to="/" replace />

  return children
}

export default StaffRoute
