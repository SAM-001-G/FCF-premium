import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

export default function AdminRoute({ children }) {
  const { session, adminProfile } = useAuth()
  const location = useLocation()

  // Auth state is still loading.
  if (session === undefined) {
    return (
      <div className="admin-login form-box">
        <p style={{ textAlign: 'center' }}>Checking administrator access…</p>
      </div>
    )
  }

  // No authenticated session.
  if (!session) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  // Authenticated but not an approved administrator.
  if (!adminProfile || !adminProfile.approved) {
    return <Navigate to="/admin/login" replace />
  }

  // Approved administrator.
  return children
}
