import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'
import PublicLayout from '../components/PublicLayout.jsx'
import Countdown from '../components/Countdown.jsx'

export default function Events() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })
      .then(({ data }) => setEvents(data || []))
  }, [])

  const today = new Date().toISOString().slice(0, 10)
  const upcoming = events.filter((e) => e.event_date >= today)
  const past = events.filter((e) => e.event_date < today)

  return (
    <PublicLayout>
      <section className="container">
        <Countdown event={upcoming[0]} />
      </section>

      <section className="container">
        <h2 className="section-title">Upcoming Events</h2>
        <div className="grid grid-3">
          {upcoming.map((e) => (
            <div className="card" key={e.id}>
              {e.poster_url && <img src={e.poster_url} alt={e.title} />}
              <div className="card-body">
                {e.category && <span className="tag">{e.category}</span>}
                <h3>{e.title}</h3>
                <div className="meta">{e.event_date} {e.start_time ? `· ${e.start_time}` : ''} {e.location ? `· ${e.location}` : ''}</div>
                <p>{e.description}</p>
              </div>
            </div>
          ))}
          {upcoming.length === 0 && <p>No upcoming events yet — check back soon.</p>}
        </div>
      </section>

      {past.length > 0 && (
        <section className="section-alt">
          <div className="container">
            <h2 className="section-title">Past Events</h2>
            <div className="grid grid-3">
              {past.map((e) => (
                <div className="card" key={e.id}>
                  <div className="card-body">
                    <h3>{e.title}</h3>
                    <div className="meta">{e.event_date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </PublicLayout>
  )
}
