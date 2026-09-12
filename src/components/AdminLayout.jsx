import { Link, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../AuthContext.jsx'
import { supabase } from '../supabaseClient.js'

const navItems = [
  ['/admin', 'Dashboard', '📊'],
  ['/admin/events', 'Events', '📅'],
  ['/admin/sermons', 'Sermons', '🎥'],
  ['/admin/announcements', 'Announcements', '📢'],
  ['/admin/ministries', 'Ministries', '👨‍👩‍👧'],
  ['/admin/leadership', 'Leadership', '👤'],
  ['/admin/prayer', 'Prayer Requests', '🙏'],
  ['/admin/testimonies', 'Testimonies', '❤️'],
  ['/admin/visitors', 'Visitors', '🧑‍🤝‍🧑'],
  ['/admin/users', 'Team', '🛡️'],
  ['/admin/signup-requests', 'Signup Requests', '✉️'],
]

const pageTitles = Object.fromEntries(navItems.map(([href, label]) => [href, label]))

export default function AdminLayout({ children }) {
  const { session, adminProfile, signupRequest } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

  // Load pending signup requests count
  useEffect(() => {
    if (adminProfile?.role === 'super_admin') {
      const loadPendingCount = async () => {
        const { data } = await supabase
          .from('admin_signup_requests')
          .select('id', { count: 'exact' })
          .eq('status', 'pending')
        setPendingCount(data?.length || 0)
      }
      loadPendingCount()
    }
  }, [adminProfile])

  if (session === undefined) return <div style={{ padding: 40 }}>Loading…</div>
  if (session === null) return <Navigate to="/admin/login" replace />

  // User has a pending signup request
  if (signupRequest && signupRequest.status === 'pending') {
    return (
      <div className="form-box" style={{ maxWidth: 500, margin: '120px auto' }}>
        <h2 style={{ color: 'var(--navy)', textAlign: 'center', marginTop: 0 }}>Request Pending</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-soft)' }}>
          Your admin account request is pending approval. An FCF administrator must review and approve your request for the <strong>{signupRequest.requested_role}</strong> position.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
          <Link to="/" className="btn btn-outline" style={{ flex: 1, textAlign: 'center' }}>
            Back to Website
          </Link>
          <button
            onClick={() => supabase.auth.signOut()}
            className="btn btn-outline"
            style={{ flex: 1 }}
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  // User's signup request was rejected
  if (signupRequest && signupRequest.status === 'rejected') {
    return (
      <div className="form-box" style={{ maxWidth: 500, margin: '120px auto' }}>
        <h2 style={{ color: 'var(--navy)', textAlign: 'center', marginTop: 0 }}>Request Not Approved</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-soft)' }}>
          Your admin account request was not approved.
        </p>
        {signupRequest.rejection_reason && (
          <div style={{
            background: 'rgba(255,192,203,0.2)',
            border: '1px solid rgba(255,0,0,0.2)',
            borderRadius: 12,
            padding: 12,
            marginBottom: 20,
            fontSize: '0.9rem',
            color: 'var(--text)'
          }}>
            <strong>Reason:</strong> {signupRequest.rejection_reason}
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
          <Link to="/" className="btn btn-outline" style={{ flex: 1, textAlign: 'center' }}>
            Back to Website
          </Link>
          <button
            onClick={() => supabase.auth.signOut()}
            className="btn btn-outline"
            style={{ flex: 1 }}
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  // No admin profile and no pending request - not authorized
  if (!adminProfile) {
    return <Navigate to="/admin/login" replace />
  }

  const currentTitle = pageTitles[location.pathname] || 'Admin'
  const userEmail = session.user?.email || ''
  const initial = userEmail.charAt(0).toUpperCase() || 'A'

  // Filter nav items based on role
  let visibleNavItems = navItems
  if (adminProfile.role !== 'super_admin') {
    // Hide signup requests from non-super-admins
    visibleNavItems = navItems.filter(item => item[0] !== '/admin/signup-requests')
  }

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-brand">
          <img src="/logo.png" alt="FCF" />
          <strong>FCF Admin</strong>
        </div>

        <Link to="/" className="admin-back-home">
          ← Back to Website
        </Link>

        <nav className="admin-nav">
          {visibleNavItems.map(([href, label, icon]) => (
            <Link
              key={href}
              to={href}
              className={location.pathname === href ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-icon">{icon}</span> {label}
              {href === '/admin/signup-requests' && pendingCount > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: 'var(--blue)',
                  color: 'white',
                  fontSize: '0.7rem',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontWeight: 600
                }}>
                  {pendingCount}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <button
          className="btn btn-outline admin-signout"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </aside>

      {menuOpen && <div className="admin-overlay" onClick={() => setMenuOpen(false)} />}

      <div className="admin-content-col">
        <header className="admin-topbar">
          <button className="admin-menu-toggle" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
            ☰
          </button>
          <div className="admin-topbar-title">{currentTitle}</div>
          <div className="admin-user-panel">
            <button className="admin-user-btn" onClick={() => setUserMenuOpen((v) => !v)}>
              <span className="admin-avatar">{initial}</span>
              <span className="admin-user-email">{userEmail}</span>
              <span style={{ fontSize: '0.7rem' }}>▾</span>
            </button>
            {userMenuOpen && (
              <div className="admin-user-dropdown">
                <div className="admin-user-dropdown-email">{userEmail}</div>
                <Link to="/" onClick={() => setUserMenuOpen(false)}>← Back to Website</Link>
                <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
              </div>
            )}
          </div>
        </header>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  )
}
