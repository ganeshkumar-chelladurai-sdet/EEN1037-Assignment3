import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'

/**
 * Returns a guard function that checks authentication before running an action.
 * If not logged in, redirects to /login?next=<current page> so the user
 * returns here after logging in.
 *
 * Similar to Django's @login_required decorator.
 *
 * Usage:
 *   const loginRequired = useLoginRequired()
 *   <button onClick={() => loginRequired(() => api.download(url))}>Download</button>
 */
export function useLoginRequired() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return function (action) {
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(location.pathname)}`)
      return
    }
    action()
  }
}
