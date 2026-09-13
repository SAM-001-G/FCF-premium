import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

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

export default function AdminLayout({ children }) {
  const { session } = useAuth()
  const location = useLocation()

  if (session === undefined) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#f5f7fa',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            background: '#fff',
            padding: 30,
            borderRadius: 16,
            boxShadow: '0 10px 30px rgba(0,0,0,.08)',
            textAlign: 'center',
          }}
        >
          <strong>FCF ADMIN</strong>
          <p>Checking authentication…</p>
        </div>
      </div>
    )
  }

  if (session === null) {
    return <Navigate to="/admin/login" replace />
  }

  const email = session?.user?.email || 'Authenticated Admin'
  const initial = email.charAt(0).toUpperCase()

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: '#f5f7fa',
        color: '#172033',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          minHeight: '100vh',
          background: '#0B2545',
          color: '#fff',
          padding: 20,
        }}
      >
        <h2 style={{ marginTop: 0 }}>FCF Admin</h2>

        <Link
          to="/"
          style={{
            display: 'block',
            padding: '10px 0',
            color: '#fff',
          }}
        >
          ← Back to Website
        </Link>

        <nav style={{ marginTop: 20 }}>
          {navItems.map(([href, label, icon]) => (
            <Link
              key={href}
              to={href}
              style={{
                display: 'block',
                padding: '11px 12px',
                marginBottom: 4,
                borderRadius: 8,
                color: '#fff',
                background:
                  location.pathname === href
                    ? 'rgba(255,255,255,.16)'
                    : 'transparent',
              }}
            >
              {icon} {label}
            </Link>
          ))}
        </nav>

        <div
          style={{
            marginTop: 30,
            padding: 12,
            borderTop: '1px solid rgba(255,255,255,.15)',
            fontSize: 12,
            opacity: 0.8,
          }}
        >
          Signed in as
          <br />
          {email}
        </div>
      </aside>

      <section style={{ flex: 1, minWidth: 0 }}>
        <header
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            background: '#fff',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <strong>
            {navItems.find(([href]) => href === location.pathname)?.[1] ||
              'Admin'}
          </strong>

          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              background: '#0B2545',
              color: '#fff',
              fontWeight: 700,
            }}
          >
            {initial}
          </div>
        </header>

        <main
          style={{
            padding: 28,
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {children}
        </main>
      </section>
    </div>
  )
}