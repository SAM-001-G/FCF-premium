import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient.js'
import AdminLayout from '../../components/AdminLayout.jsx'

const empty = { name: '', position: '', biography: '', photo_url: '', ministry: '', sort_order: 0 }

export default function AdminLeadership() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)

  async function load() {
    const { data } = await supabase.from('leadership').select('*').order('sort_order')
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (editingId) await supabase.from('leadership').update(form).eq('id', editingId)
    else await supabase.from('leadership').insert([form])
    setForm(empty); setEditingId(null); load()
  }

  async function handleDelete(id) { await supabase.from('leadership').delete().eq('id', id); load() }

  return (
    <AdminLayout>
      <h2 style={{ color: 'var(--navy)' }}>Leadership</h2>
      <form onSubmit={handleSubmit} className="card" style={{ padding: 20, marginBottom: 24 }}>
        <div className="grid grid-2">
          <div className="form-field"><label>Name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="form-field"><label>Position</label><input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} /></div>
          <div className="form-field"><label>Ministry</label><input value={form.ministry} onChange={(e) => setForm({ ...form, ministry: e.target.value })} /></div>
          <div className="form-field"><label>Photo URL</label><input value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} placeholder="/images/pastor.jpg or a full URL" /></div>
          <div className="form-field"><label>Sort Order</label><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
        </div>
        <div className="form-field"><label>Biography</label><textarea value={form.biography} onChange={(e) => setForm({ ...form, biography: e.target.value })} /></div>
        <button type="submit" className="btn btn-gold">{editingId ? 'Update' : 'Add Leader'}</button>
      </form>
      <table className="admin-table">
        <thead><tr><th>Name</th><th>Position</th><th></th></tr></thead>
        <tbody>
          {items.map((l) => (
            <tr key={l.id}>
              <td>{l.name}</td><td>{l.position}</td>
              <td>
                <button className="btn btn-outline" style={{ color: 'var(--navy)', border: '1px solid var(--navy)', padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => { setForm({ ...empty, ...l }); setEditingId(l.id) }}>Edit</button>{' '}
                <button className="btn btn-outline" style={{ color: '#a92323', border: '1px solid #a92323', padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => handleDelete(l.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  )
}
