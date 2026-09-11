import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient.js'
import AdminLayout from '../../components/AdminLayout.jsx'

const empty = { title: '', body: '', type: 'general', expires_at: '' }

export default function AdminAnnouncements() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)

  async function load() {
    const { data } = await supabase.from('announcements').select('*').order('publish_at', { ascending: false })
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (editingId) await supabase.from('announcements').update(form).eq('id', editingId)
    else await supabase.from('announcements').insert([form])
    setForm(empty); setEditingId(null); load()
  }

  async function handleDelete(id) { await supabase.from('announcements').delete().eq('id', id); load() }

  return (
    <AdminLayout>
      <h2 style={{ color: 'var(--navy)' }}>Announcements</h2>
      <form onSubmit={handleSubmit} className="card" style={{ padding: 20, marginBottom: 24 }}>
        <div className="grid grid-2">
          <div className="form-field"><label>Title</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="form-field">
            <label>Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="general">General</option>
              <option value="important">Important</option>
              <option value="urgent">Urgent</option>
              <option value="celebration">Celebration</option>
            </select>
          </div>
          <div className="form-field"><label>Expires</label><input type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} /></div>
        </div>
        <div className="form-field"><label>Body</label><textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
        <button type="submit" className="btn btn-gold">{editingId ? 'Update' : 'Post Announcement'}</button>
      </form>
      <table className="admin-table">
        <thead><tr><th>Title</th><th>Type</th><th>Expires</th><th></th></tr></thead>
        <tbody>
          {items.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td><td>{a.type}</td><td>{a.expires_at || '—'}</td>
              <td>
                <button className="btn btn-outline" style={{ color: 'var(--navy)', border: '1px solid var(--navy)', padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => { setForm({ ...empty, ...a }); setEditingId(a.id) }}>Edit</button>{' '}
                <button className="btn btn-outline" style={{ color: '#a92323', border: '1px solid #a92323', padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => handleDelete(a.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  )
}
