import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'
import PublicLayout from '../components/PublicLayout.jsx'

export default function Sermons() {
  const [sermons, setSermons] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    supabase
      .from('sermons')
      .select('*')
      .order('sermon_date', { ascending: false })
      .then(({ data }) => setSermons(data || []))
  }, [])

  const filtered = sermons.filter((s) => {
    const q = query.toLowerCase()
    return (
      s.title?.toLowerCase().includes(q) ||
      s.scripture?.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q)
    )
  })

  return (
    <PublicLayout>
      <section className="container">
        <h2 className="section-title">Sermons</h2>
        <div className="form-field" style={{ maxWidth: 400, marginBottom: 24 }}>
          <input
            placeholder="Search by title, scripture, or topic..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="grid grid-3">
          {filtered.map((s) => (
            <div className="card" key={s.id}>
              {s.thumbnail_url && <img src={s.thumbnail_url} alt={s.title} />}
              <div className="card-body">
                <div className="meta">{s.speaker} &middot; {s.sermon_date}</div>
                <h3>{s.title}</h3>
                {s.scripture && <span className="tag">{s.scripture}</span>}
                <p>{s.description}</p>
                {s.youtube_link && (
                  <a className="btn btn-navy" href={s.youtube_link} target="_blank" rel="noreferrer">Watch</a>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p>No sermons found.</p>}
        </div>
      </section>
    </PublicLayout>
  )
}
