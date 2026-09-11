import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'
import PublicLayout from '../components/PublicLayout.jsx'

export default function Testimonies() {
  const [testimonies, setTestimonies] = useState([])
  const [form, setForm] = useState({ name: '', testimony: '', category: 'General', permission_to_publish: true })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    supabase
      .from('testimonies')
      .select('*')
      .eq('status', 'published')
      .then(({ data }) => setTestimonies(data || []))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    const { error } = await supabase.from('testimonies').insert([form])
    if (!error) setSubmitted(true)
  }

  return (
    <PublicLayout>
      <section className="container">
        <h2 className="section-title">Testimonies</h2>
        <div className="grid grid-3">
          {testimonies.map((t) => (
            <div className="card" key={t.id}>
              {t.photo_url && <img src={t.photo_url} alt={t.name} />}
              <div className="card-body">
                <span className="tag">{t.category}</span>
                <p>"{t.testimony}"</p>
                <div className="meta">— {t.name || 'Anonymous'}</div>
              </div>
            </div>
          ))}
          {testimonies.length === 0 && <p>Published testimonies will appear here.</p>}
        </div>
      </section>

      <section className="section-alt">
        <div className="container">
          <h2 className="section-title">Share What God Has Done</h2>
          <div className="form-box">
            {submitted ? (
              <div className="success-msg">Thank you for sharing! Your testimony will appear once reviewed.</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-field">
                  <label>Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-field">
                  <label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option>General</option>
                    <option>Healing</option>
                    <option>Provision</option>
                    <option>Deliverance</option>
                    <option>Salvation</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Your Testimony</label>
                  <textarea rows={5} required value={form.testimony} onChange={(e) => setForm({ ...form, testimony: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-gold">Submit Testimony</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
