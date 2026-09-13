import { Link } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout.jsx'

// DIAGNOSTIC VERSION
// Deliberately contains ZERO Supabase calls.
// If this renders, the admin shell/routing is working and the
// remaining problem is isolated to the Supabase/data layer.
export default function AdminDashboard() {
  const stats = [
    ['12', 'Upcoming Events'],
    ['7', 'New Prayer Requests'],
    ['4', 'Pending Testimonies'],
    ['9', 'New Visitors'],
  ]

  const quickActions = [
    ['/admin/events', '+ Create Event'],
    ['/admin/announcements', '+ Post Announcement'],
    ['/admin/sermons', '+ Upload Sermon'],
    ['/admin/leadership', '+ Add Leader'],
  ]

  return (
    <AdminLayout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 6px', color: 'var(--navy)' }}>
          Dashboard
        </h1>

        <p style={{ margin: 0, color: '#6b7789' }}>
          Faith in Christ Fellowship administration overview
        </p>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 24 }}>
        {stats.map(([num, label]) => (
          <div className="stat-card" key={label}>
            <div className="num">{num}</div>
            <div className="label">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        {quickActions.map(([href, label]) => (
          <Link
            key={href}
            to={href}
            className="btn btn-navy"
            style={{ textAlign: 'center' }}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="grid grid-2">
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ marginTop: 0, color: 'var(--navy)' }}>
            Recent Prayer Requests
          </h3>

          <div
            style={{
              borderBottom: '1px solid #eef1f5',
              padding: '10px 0',
              fontSize: '0.85rem',
            }}
          >
            <strong>Anonymous</strong> — Prayer for the church family
          </div>

          <div
            style={{
              borderBottom: '1px solid #eef1f5',
              padding: '10px 0',
              fontSize: '0.85rem',
            }}
          >
            <strong>Member</strong> — Thanksgiving and breakthrough
          </div>

          <Link
            to="/admin/prayer"
            style={{
              display: 'inline-block',
              marginTop: 12,
              fontSize: '0.8rem',
              color: 'var(--sky)',
            }}
          >
            View all →
          </Link>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h