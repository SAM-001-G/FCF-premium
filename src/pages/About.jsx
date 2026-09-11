import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'
import PublicLayout from '../components/PublicLayout.jsx'

export default function About() {
  const [leaders, setLeaders] = useState([])

  useEffect(() => {
    supabase
      .from('leadership')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => setLeaders(data || []))
  }, [])

  return (
    <PublicLayout>
      <section className="container">
        <h2 className="section-title">Our Story</h2>
        <p>Faith in Christ Fellowship — known as The Mountain of Possibilities — is a place where people
        encounter God's presence and believe for what seems impossible. Church history, vision, mission,
        beliefs and core values will appear here once added by the admin team.</p>
      </section>

      <section className="section-alt">
        <div className="container">
          <h2 className="section-title">Leadership</h2>
          {leaders.length === 0 ? (
            <p>Leadership profiles will appear here once added.</p>
          ) : (
            <div className="grid grid-3">
              {leaders.map((l) => (
                <div className="card" key={l.id}>
                  {l.photo_url && <img src={l.photo_url} alt={l.name} />}
                  <div className="card-body">
                    <h3>{l.name}</h3>
                    <div className="meta">{l.position}</div>
                    <p>{l.biography}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
