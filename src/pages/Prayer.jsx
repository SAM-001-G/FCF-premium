import { useState } from 'react'
import { supabase } from '../supabaseClient.js'
import PublicLayout from '../components/PublicLayout.jsx'

export default function Prayer() {
  const [form, setForm] = useState({ name: '', contact: '', request: '', is_anonymous: false, category: 'General' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.from('prayer_requests').insert([form])
    if (error) setError(error.message)
    else setSubmitted(true)
  }

  return (
    <PublicLayout>
      <section className="container">
        <h2 className="section-title">Request Prayer</h2>
        <div className="form-box">
          {submitted ? (
            <div className="success-msg">Thank you — your prayer request has been received. Our prayer team will be praying with you.</div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div className="success-msg" style={{ background: '#fde8e8', color: '#a92323' }}>{error}</div>}
              <div className="form-field">
                <label>Name (optional if anonymous)</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Email or Phone (optional)</label>
                <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option>General</option>
                  <option>Health</option>
                  <option>Family</option>
                  <option>Finances</option>
                  <option>Guidance</option>
                  <option>Thanksgiving</option>
                </select>
              </div>
              <div className="form-field">
                <label>Your Prayer Request</label>
                <textarea rows={5} required value={form.request} onChange={(e) => setForm({ ...form, request: e.target.value })} />
              </div>
              <div className="form-field" style={{ flexDirection: 'row', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  id="anon"
                  checked={form.is_anonymous}
                  onChange={(e) => setForm({ ...form, is_anonymous: e.target.checked })}
                  style={{ width: 'auto' }}
                />
                <label htmlFor="anon" style={{ marginLeft: 8 }}>Submit anonymously</label>
              </div>
              <button type="submit" className="btn btn-gold">Send Prayer Request</button>
            </form>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
