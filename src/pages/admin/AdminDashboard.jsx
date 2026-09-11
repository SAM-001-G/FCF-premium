import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient.js'
import AdminLayout from '../../components/AdminLayout.jsx'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ events: 0, prayer: 0, testimonies: 0, visitors: 0 })
  const [recentPrayer, setRecentPrayer] = useState([])
  const [recentTestimonies, setRecentTestimonies] = useState([])

  useEffect(() => {
    async function load() {
      const [events, prayer, testimonies, visitors] = await Promise.all([
        supabase.from('events').select('*', { count: 'exact', head: true }).gte('event_date', new Date().toISOString().slice(0, 10)),
        supabase.from('prayer_requests').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('testimonies').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('visitors').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      ])
      setStats({
        events: events.count || 0,
        prayer: prayer.count || 0,
        testimonies: testimonies.count || 0,
        visitors: visitors.count || 0,
      })
      const { data: p } = await supabase.from('prayer_requests').select('*').order('created_at', { ascending: false }).limit(4)
      setRecentPrayer(p || [])
      const { data: t } = await supabase.from('testimonies').select('*').order('created_at', { ascending: false }).limit(4)
      setRecentTestimonies(t || [])
    }
    load()
  }, [])

  const quickActions = [
    ['/admin/events', '+ Create Event'],
    ['/admin/announcements', '+ Post Announcement'],
    ['/admin/sermons', '+ Upload Sermon'],
    ['/admin/leadership', '+ Add Leader'],
  ]

  return (
    <AdminLayout>
      <div className="grid grid-3" style={{ marginBottom: 24 }}>
        <div className="stat-card"><div className="num">{stats.events}</div><div className="label">Upcoming Events</div></div>
        <div className="stat-card"><div className="num">{stats.prayer}</div><div className="label">New Prayer Requests</div></div>
        <div className="stat-card"><div className="num">{stats.testimonies}</div><div className="label">Pending Testimonies</div></div>
        <div className="stat-card"><div className="num">{stats.visitors}</div><div className="label">New Visitors</div></div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        {quickActions.map(([href, label]) => (
          <Link key={href} to={href} className="btn btn-navy" style={{ textAlign: 'center' }}>{label}</Link>
        ))}
      </div>

      <div className="grid grid-2">
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ marginTop: 0, color: 'var(--navy)' }}>Recent Prayer Requests</h3>
          {recentPrayer.length === 0 && <p style={{ color: '#8a95a3', fontSize: '0.85rem' }}>None yet.</p>}
          {recentPrayer.map((p) => (
            <div key={p.id} style={{ borderBottom: '1px solid #eef1f5', padding: '8px 0', fontSize: '0.85rem' }}>
              <strong>{p.is_anonymous ? 'Anonymous' : (p.name || 'Someone')}</strong> — {p.request?.slice(0, 60)}{p.request?.length > 60 ? '…' : ''}
            </div>
          ))}
          <Link to="/admin/prayer" style={{ fontSize: '0.8rem', color: 'var(--sky)' }}>View all →</Link>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ marginTop: 0, color: 'var(--navy)' }}>New Testimony Submissions</h3>
          {recentTestimonies.length === 0 && <p style={{ color: '#8a95a3', fontSize: '0.85rem' }}>None yet.</p>}
          {recentTestimonies.map((t) => (
            <div key={t.id} style={{ borderBottom: '1px solid #eef1f5', padding: '8px 0', fontSize: '0.85rem' }}>
              <strong>{t.name || 'Someone'}</strong> — {t.testimony?.slice(0, 60)}{t.testimony?.length > 60 ? '…' : ''}
            </div>
          ))}
          <Link to="/admin/testimonies" style={{ fontSize: '0.8rem', color: 'var(--sky)' }}>View all →</Link>
        </div>
      </div>
    </AdminLayout>
  )
}
