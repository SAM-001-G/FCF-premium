import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient.js'
import AdminLayout from '../../components/AdminLayout.jsx'
import ImageUpload from '../../components/ImageUpload.jsx'

const empty = { name: '', position: '', biography: '', photo_url: '', ministry: '', sort_order: 0 }

export default function AdminLeadership() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState(null)

  async function load() {
    const { data } = await supabase.from('leadership').select('*').order('sort_order')
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      if (editingId) {
        const { error: updateError } = await supabase.from('leadership').update(form).eq('id', editingId)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from('leadership').insert([form])
        if (insertError) throw insertError
      }
      setForm(empty); setEditingId(null); load()
    } catch (err) {
      setError(err.message || 'Failed to save leader')
    }
  }

  async function handleDelete(id) {
    try {
      const { error: deleteError } = await supabase.from('leadership').delete().eq('id', id)
      if (deleteError) throw deleteError
      load()
    } catch (err) {
      setError(err.message || 'Failed to delete leader')
    }
  }

  return (
    <AdminLayout>
      <h2 style={{ color: 'var(--navy)' }}>Leadership</h2>
      <form onSubmit={handleSubmit} className="card" style={{ padding: 20, marginBottom: 24 }}>
        {error && <div style={{ color: '#a92323', padding: 12, marginBottom: 16, backgroundColor: '#fef2f2', borderRadius: 4, fontSize: '0.9rem' }}>{error}</div>}
        <div className="grid grid-2">
          <div className="form-field"><label>Name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="form-field"><label>Position</label><input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} /></div>
          <div className="form-field"><label>Ministry</label><input value={form.ministry} onChange={(e) => setForm({ ...form, ministry: e.target.value })} /></div>
          <div className="form-field"><label>Sort Order</label><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
        </div>
        <div className="form-field"><label>Biography</label><textarea value={form.biography} onChange={(e) => setForm({ ...form, biography: e.target.value })} /></div>
        <div className="form-field"><label>Photo</label><ImageUpload value={form.photo_url} onChange={(url) => setForm({ ...form, photo_url: url })} folder="leadership" /></div>
        <button type="submit" className="btn btn-gold">{editingId ? 'Update' : 'Add Leader'}</button>
      </form>
      <table className="admin-table">
        <thead><tr><th>Name</th><th>Position</th><th></th></tr></thead>
        <tbody>
          {items.map((l) => (
            <tr key={l.id}>
              <td>{l.name}</td><td>{l.position}</td>
              <td>
                <button className="btn btn-outline" style={{ color: 'var(--navy)', border: '1px solid var(--navy)', padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => { setForm(l); setEditingId(l.id); setError(null) }}>Edit</button>
                <button className="btn btn-outline" style={{ color: '#a92323', border: '1px solid #a92323', padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => handleDelete(l.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  )
}
