import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient.js'
import AdminLayout from '../../components/AdminLayout.jsx'
import ImageUpload from '../../components/ImageUpload.jsx'

const empty = { title: '', speaker: '', sermon_date: '', scripture: '', description: '', youtube_link: '', thumbnail_url: '' }

export default function AdminSermons() {
  const [sermons, setSermons] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    const { data } = await supabase.from('sermons').select('*').order('sermon_date', { ascending: false })
    setSermons(data || [])
  }
  useEffect(() => { load() }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    if (editingId) await supabase.from('sermons').update(form).eq('id', editingId)
    else await supabase.from('sermons').insert([form])
    setForm(empty); setEditingId(null); setSaving(false); load()
  }

  async function handleDelete(id) { await supabase.from('sermons').delete().eq('id', id); load() }

  return (
    <AdminLayout>
      <h2 style={{ color: 'var(--navy)' }}>Sermons</h2>
      <form onSubmit={handleSubmit} className="card admin-form-card">
        <div className="grid grid-2">
          <div>
            <div className="form-field"><label>Title</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="form-field"><label>Speaker</label><input value={form.speaker} onChange={(e) => setForm({ ...form, speaker: e.target.value })} /></div>
            <div className="form-field"><label>Date</label><input type="date" value={form.sermon_date} onChange={(e) => setForm({ ...form, sermon_date: e.target.value })} /></div>
            <div className="form-field"><label>Scripture</label><input value={form.scripture} onChange={(e) => setForm({ ...form, scripture: e.target.value })} placeholder="e.g. John 15:5" /></div>
            <div className="form-field"><label>YouTube Link</label><input value={form.youtube_link} onChange={(e) => setForm({ ...form, youtube_link: e.target.value })} /></div>
            <div className="form-field"><label>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)', display: 'block', marginBottom: 6 }}>Thumbnail</label>
            <ImageUpload value={form.thumbnail_url} onChange={(url) => setForm({ ...form, thumbnail_url: url })} folder="sermons" />
          </div>
        </div>
        <button type="submit" className="btn btn-gold" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Update Sermon' : 'Add Sermon'}</button>
        {editingId && <button type="button" className="btn btn-outline" style={{ marginLeft: 10, color: 'var(--navy)', border: '1.5px solid var(--navy)' }} onClick={() => { setForm(empty); setEditingId(null) }}>Cancel</button>}
      </form>

      <div className="admin-card-grid">
        {sermons.map((s) => (
          <div className="card admin-item-card" key={s.id}>
            {s.thumbnail_url ? <img src={s.thumbnail_url} alt={s.title} /> : <div className="admin-item-noimg">🎥</div>}
            <div className="card-body">
              <div className="meta">{s.speaker} &middot; {s.sermon_date}</div>
              <h3>{s.title}</h3>
              {s.scripture && <span className="tag">{s.scripture}</span>}
              <div className="admin-item-actions">
                <button className="btn btn-outline admin-btn-sm" onClick={() => { setForm({ ...empty, ...s }); setEditingId(s.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Edit</button>
                <button className="btn btn-outline admin-btn-sm admin-btn-danger" onClick={() => handleDelete(s.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {sermons.length === 0 && <p>No sermons yet.</p>}
      </div>
    </AdminLayout>
  )
}
