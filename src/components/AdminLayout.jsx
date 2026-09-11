import { Link, Navigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
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
]

const pageTitles = Object.fromEntries(navItems.map(([href, label]) => [href, label]))

export default function AdminLayout({ children }) {
  const { session } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  if (session === undefined) return <div style={{ padding: 40 }}>Loading…</div>
  if (session === null) return <Navigate to="/admin/login" replace />

  const currentTitle = pageTitles[location.pathname] || 'Admin'
  const userEmail = session.user?.email || ''
  const initial = userEmail.charAt(0).toUpperCase() || 'A'

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
          {navItems.map(([href, label, icon]) => (
            <Link
              key={href}
              to={href}
              className={location.pathname === href ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-icon">{icon}</span> {label}
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
