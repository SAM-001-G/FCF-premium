import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'
import PublicLayout from '../components/PublicLayout.jsx'

export default function Ministries() {
  const [ministries, setMinistries] = useState([])

  useEffect(() => {
    supabase.from('ministries').select('*').then(({ data }) => setMinistries(data || []))
  }, [])

  return (
    <PublicLayout>
      <section className="container">
        <h2 className="section-title">Ministries</h2>
        <div className="grid grid-3">
          {ministries.map((m) => (
            <div className="card" key={m.id}>
              {m.photo_url && <img src={m.photo_url} alt={m.name} />}
              <div className="card-body">
                <h3>{m.name}</h3>
                <div className="meta">Led by {m.leader}</div>
                <p>{m.description}</p>
                {m.meeting_schedule && <p><strong>Meets:</strong> {m.meeting_schedule}</p>}
              </div>
            </div>
          ))}
          {ministries.length === 0 && <p>Ministries will appear here once added by the admin team.</p>}
        </div>
      </section>
    </PublicLayout>
  )
}
