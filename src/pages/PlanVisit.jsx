import { useState } from 'react'
import { supabase } from '../supabaseClient.js'
import PublicLayout from '../components/PublicLayout.jsx'

export default function PlanVisit() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', first_visit: true, how_heard: '' })
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const { error } = await supabase.from('visitors').insert([form])
    if (!error) setSubmitted(true)
  }

  return (
    <PublicLayout>
      <section className="container">
        <h2 className="section-title">Plan Your Visit</h2>
        <div className="grid grid-2">
          <div className="card">
            <div className="card-body">
              <h3>📍 Location & Service Times</h3>
              <p>
                <a href="https://maps.app.goo.gl/SgSV8Esy7FKuQdni7" target="_blank" rel="noreferrer" className="btn btn-navy" style={{ display: 'inline-block', marginBottom: 10 }}>
                  🗺️ Get Directions
                </a>
              </p>
              <p>Service times will be added by the admin team.</p>
              <h3>👶 Children's Ministry</h3>
              <p>Details coming soon.</p>
              <h3>♿ Accessibility</h3>
              <p>Details coming soon.</p>
            </div>
          </div>
          <div className="form-box">
            <h3 style={{ marginTop: 0 }}>I'm Coming</h3>
            {submitted ? (
              <div className="success-msg">We can't wait to see you! Someone from our team may reach out to welcome you.</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-field">
                  <label>Name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-field">
                  <label>Phone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="form-field">
                  <label>Email</label>
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="form-field">
                  <label>How did you hear about us?</label>
                  <input value={form.how_heard} onChange={(e) => setForm({ ...form, how_heard: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-gold">Let Us Know You're Coming</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
