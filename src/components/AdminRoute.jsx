import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

export default function AdminRoute({ children }) {
  const {
    session,
    adminProfile,
    authLoading,
    adminLoading,
  } = useAuth()

  const location = useLocation()

  if (authLoading || (session && adminLoading)) {
    return (
      <div className="admin-login form-box">
        <p style={{ textAlign: 'center' }}>
          Checking administrator access…
        </p>
      </div>
    )
  }

  if (!session) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  if (!adminProfile || !adminProfile.approved) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}