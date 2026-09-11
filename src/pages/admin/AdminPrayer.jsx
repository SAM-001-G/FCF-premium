import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient.js'
import AdminLayout from '../../components/AdminLayout.jsx'

const statuses = ['new', 'praying', 'follow-up', 'closed']

export default function AdminPrayer() {
  const [items, setItems] = useState([])

  async function load() {
    const { data } = await supabase.from('prayer_requests').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  async function updateStatus(id, status) {
    await supabase.from('prayer_requests').update({ status }).eq('id', id)
    load()
  }

  return (
    <AdminLayout>
      <h2 style={{ color: 'var(--navy)' }}>Prayer Requests</h2>
      <table className="admin-table">
        <thead><tr><th>Name</th><th>Category</th><th>Request</th><th>Status</th></tr></thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id}>
              <td>{p.is_anonymous ? 'Anonymous' : (p.name || '—')}</td>
              <td>{p.category}</td>
              <td style={{ maxWidth: 320 }}>{p.request}</td>
              <td>
                <select value={p.status} onChange={(e) => updateStatus(p.id, e.target.value)}>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan={4}>No prayer requests yet.</td></tr>}
        </tbody>
      </table>
    </AdminLayout>
  )
}
