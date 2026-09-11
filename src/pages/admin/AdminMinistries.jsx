import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient.js'
import AdminLayout from '../../components/AdminLayout.jsx'

const empty = { name: '', leader: '', description: '', meeting_schedule: '', contact: '' }

export default function AdminMinistries() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)

  async function load() {
    const { data } = await supabase.from('ministries').select('*').order('name')
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (editingId) await supabase.from('ministries').update(form).eq('id', editingId)
    else await supabase.from('ministries').insert([form])
    setForm(empty); setEditingId(null); load()
  }

  async function handleDelete(id) { await supabase.from('ministries').delete().eq('id', id); load() }

  return (
    <AdminLayout>
      <h2 style={{ color: 'var(--navy)' }}>Ministries</h2>
      <form onSubmit={handleSubmit} className="card" style={{ padding: 20, marginBottom: 24 }}>
        <div className="grid grid-2">
          <div className="form-field"><label>Name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="form-field"><label>Leader</label><input value={form.leader} onChange={(e) => setForm({ ...form, leader: e.target.value })} /></div>
          <div className="form-field"><label>Meeting Schedule</label><input value={form.meeting_schedule} onChange={(e) => setForm({ ...form, meeting_schedule: e.target.value })} /></div>
          <div className="form-field"><label>Contact</label><input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
        </div>
        <div className="form-field"><label>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <button type="submit" className="btn btn-gold">{editingId ? 'Update' : 'Add Ministry'}</button>
      </form>
      <table className="admin-table">
        <thead><tr><th>Name</th><th>Leader</th><th></th></tr></thead>
        <tbody>
          {items.map((m) => (
            <tr key={m.id}>
              <td>{m.name}</td><td>{m.leader}</td>
              <td>
                <button className="btn btn-outline" style={{ color: 'var(--navy)', border: '1px solid var(--navy)', padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => { setForm({ ...empty, ...m }); setEditingId(m.id) }}>Edit</button>{' '}
                <button className="btn btn-outline" style={{ color: '#a92323', border: '1px solid #a92323', padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => handleDelete(m.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  )
}
