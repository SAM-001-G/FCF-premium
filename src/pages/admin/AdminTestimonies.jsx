import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient.js'
import AdminLayout from '../../components/AdminLayout.jsx'

const statuses = ['pending', 'approved', 'published']

export default function AdminTestimonies() {
  const [items, setItems] = useState([])

  async function load() {
    const { data } = await supabase.from('testimonies').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  async function updateStatus(id, status) {
    await supabase.from('testimonies').update({ status }).eq('id', id)
    load()
  }

  return (
    <AdminLayout>
      <h2 style={{ color: 'var(--navy)' }}>Testimonies</h2>
      <table className="admin-table">
        <thead><tr><th>Name</th><th>Category</th><th>Testimony</th><th>Status</th></tr></thead>
        <tbody>
          {items.map((t) => (
            <tr key={t.id}>
              <td>{t.name || '—'}</td>
              <td>{t.category}</td>
              <td style={{ maxWidth: 320 }}>{t.testimony}</td>
              <td>
                <select value={t.status} onChange={(e) => updateStatus(t.id, e.target.value)}>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan={4}>No testimonies yet.</td></tr>}
        </tbody>
      </table>
    </AdminLayout>
  )
}
