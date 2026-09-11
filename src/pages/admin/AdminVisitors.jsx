import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient.js'
import AdminLayout from '../../components/AdminLayout.jsx'

const statuses = ['new', 'contacted', 'connected', 'member']

export default function AdminVisitors() {
  const [items, setItems] = useState([])

  async function load() {
    const { data } = await supabase.from('visitors').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  async function updateStatus(id, status) {
    await supabase.from('visitors').update({ status }).eq('id', id)
    load()
  }

  return (
    <AdminLayout>
      <h2 style={{ color: 'var(--navy)' }}>Visitors</h2>
      <table className="admin-table">
        <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>How Heard</th><th>Status</th></tr></thead>
        <tbody>
          {items.map((v) => (
            <tr key={v.id}>
              <td>{v.name}</td><td>{v.phone}</td><td>{v.email}</td><td>{v.how_heard}</td>
              <td>
                <select value={v.status} onChange={(e) => updateStatus(v.id, e.target.value)}>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan={5}>No visitor submissions yet.</td></tr>}
        </tbody>
      </table>
    </AdminLayout>
  )
}
