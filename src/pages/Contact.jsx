import { useState } from 'react'
import { supabase } from '../supabaseClient.js'
import PublicLayout from '../components/PublicLayout.jsx'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const { error } = await supabase.from('contact_submissions').insert([form])
    if (!error) setSubmitted(true)
  }

  return (
    <PublicLayout>
      <section className="container">
        <h2 className="section-title">Contact Us</h2>
        <div className="form-box">
          {submitted ? (
            <div className="success-msg">Thanks for reaching out — we'll be in touch soon.</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label>Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Message</label>
                <textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-gold">Send Message</button>
            </form>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
