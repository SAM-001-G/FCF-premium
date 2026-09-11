import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient.js'
import AdminLayout from '../../components/AdminLayout.jsx'
import ImageUpload from '../../components/ImageUpload.jsx'

const empty = { title: '', category: '', event_date: '', start_time: '', location: '', description: '', speaker: '', ministry: '', poster_url: '' }

export default function AdminEvents() {
  const [events, setEvents] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false })
    setEvents(data || [])
  }
  useEffect(() => { load() }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    if (editingId) {
      await supabase.from('events').update(form).eq('id', editingId)
    } else {
      await supabase.from('events').insert([form])
    }
    setForm(empty)
    setEditingId(null)
    setSaving(false)
    load()
  }

  function startEdit(ev) {
    setForm({ ...empty, ...ev })
    setEditingId(ev.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id) {
    await supabase.from('events').delete().eq('id', id)
    load()
  }

  return (
    <AdminLayout>
      <h2 style={{ color: 'var(--navy)' }}>Events</h2>
      <form onSubmit={handleSubmit} className="card admin-form-card">
        <div className="grid grid-2">
          <div>
            <div className="form-field"><label>Title</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="form-field"><label>Category</label><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            <div className="form-field"><label>Date</label><input type="date" required value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} /></div>
            <div className="form-field"><label>Start Time</label><input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} /></div>
            <div className="form-field"><label>Location</label><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
            <div className="form-field"><label>Speaker</label><input value={form.speaker} onChange={(e) => setForm({ ...form, speaker: e.target.value })} /></div>
            <div className="form-field"><label>Ministry</label><input value={form.ministry} onChange={(e) => setForm({ ...form, ministry: e.target.value })} /></div>
            <div className="form-field"><label>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)', display: 'block', marginBottom: 6 }}>Poster</label>
            <ImageUpload value={form.poster_url} onChange={(url) => setForm({ ...form, poster_url: url })} folder="events" />
          </div>
        </div>
        <button type="submit" className="btn btn-gold" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Update Event' : 'Add Event'}</button>
        {editingId && <button type="button" className="btn btn-outline" style={{ marginLeft: 10, color: 'var(--navy)', border: '1.5px solid var(--navy)' }} onClick={() => { setForm(empty); setEditingId(null) }}>Cancel</button>}
      </form>

      <div className="admin-card-grid">
        {events.map((e) => (
          <div className="card admin-item-card" key={e.id}>
            {e.poster_url ? <img src={e.poster_url} alt={e.title} /> : <div className="admin-item-noimg">📅</div>}
            <div className="card-body">
              <div className="meta">{e.event_date}{e.location ? ` · ${e.location}` : ''}</div>
              <h3>{e.title}</h3>
              <div className="admin-item-actions">
                <button className="btn btn-outline admin-btn-sm" onClick={() => startEdit(e)}>Edit</button>
                <button className="btn btn-outline admin-btn-sm admin-btn-danger" onClick={() => handleDelete(e.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {events.length === 0 && <p>No events yet.</p>}
      </div>
    </AdminLayout>
  )
}
