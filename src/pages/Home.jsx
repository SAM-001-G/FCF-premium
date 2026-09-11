import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'
import PublicLayout from '../components/PublicLayout.jsx'
import Countdown from '../components/Countdown.jsx'
import { Link } from 'react-router-dom'

export default function Home() {
  const [nextEvent, setNextEvent] = useState(null)
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [sermon, setSermon] = useState(null)
  const [ministries, setMinistries] = useState([])
  const [testimony, setTestimony] = useState(null)

  useEffect(() => {
    supabase
      .from('events')
      .select('*')
      .gte('event_date', new Date().toISOString().slice(0, 10))
      .order('event_date', { ascending: true })
      .then(({ data }) => {
        setNextEvent(data?.[0] || null)
        setUpcomingEvents(data || [])
      })

    supabase
      .from('announcements')
      .select('*')
      .order('publish_at', { ascending: false })
      .limit(3)
      .then(({ data }) => setAnnouncements(data || []))

    supabase
      .from('sermons')
      .select('*')
      .order('sermon_date', { ascending: false })
      .limit(1)
      .then(({ data }) => setSermon(data?.[0] || null))

    supabase
      .from('ministries')
      .select('*')
      .limit(3)
      .then(({ data }) => setMinistries(data || []))

    supabase
      .from('testimonies')
      .select('*')
      .eq('status', 'published')
      .limit(1)
      .then(({ data }) => setTestimony(data?.[0] || null))
  }, [])

  return (
    <PublicLayout>
      <div className="hero">
        <div className="eyebrow">Faith in Christ Fellowship</div>
        <h1>The Mountain of Possibilities</h1>
        <p>Where Faith Meets Possibility. Join a family where God makes the impossible, possible.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/visit" className="btn btn-gold">Plan Your Visit</Link>
          <Link to="/sermons" className="btn btn-outline">Watch a Sermon</Link>
        </div>
      </div>

      <section className="container">
        <Countdown event={nextEvent} />
      </section>

      {/* Upcoming events grid — always shown so this section never leaves empty space */}
      <section className="container">
        <h2 className="section-title">Upcoming Events</h2>
        <div className="grid grid-3">
          {upcomingEvents.slice(0, 3).map((e) => (
            <div className="card" key={e.id}>
              {e.poster_url && <img src={e.poster_url} alt={e.title} />}
              <div className="card-body">
                {e.category && <span className="tag">{e.category}</span>}
                <h3>{e.title}</h3>
                <div className="meta">{e.event_date}{e.location ? ` · ${e.location}` : ''}</div>
              </div>
            </div>
          ))}
          {upcomingEvents.length === 0 && <p>No upcoming events yet — check back soon.</p>}
        </div>
        {upcomingEvents.length > 3 && (
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link to="/events" className="btn btn-navy">View All Events</Link>
          </div>
        )}
      </section>

      {announcements.length > 0 && (
        <section className="section-alt">
          <div className="container">
            <h2 className="section-title">Announcements</h2>
            <div className="grid grid-3">
              {announcements.map((a) => (
                <div className="card" key={a.id}>
                  <div className="card-body">
                    <span className="tag">{a.type}</span>
                    <h3>{a.title}</h3>
                    <p>{a.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {sermon && (
        <section className={announcements.length > 0 ? 'container' : 'section-alt'}>
          <div className={announcements.length > 0 ? '' : 'container'}>
            <h2 className="section-title">Latest Sermon</h2>
            <div className="card" style={{ maxWidth: 500 }}>
              <div className="card-body">
                <div className="meta">{sermon.speaker} &middot; {sermon.sermon_date}</div>
                <h3>{sermon.title}</h3>
                <p>{sermon.description}</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  {sermon.youtube_link && (
                    <a className="btn btn-navy" href={sermon.youtube_link} target="_blank" rel="noreferrer">Watch</a>
                  )}
                  <Link to="/sermons" className="btn btn-outline" style={{ color: 'var(--navy)', border: '1.5px solid var(--navy)' }}>All Sermons</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {ministries.length > 0 && (
        <section className="container">
          <h2 className="section-title">Get Involved</h2>
          <div className="grid grid-3">
            {ministries.map((m) => (
              <div className="card" key={m.id}>
                <div className="card-body">
                  <h3>{m.name}</h3>
                  <p>{m.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link to="/ministries" className="btn btn-navy">See All Ministries</Link>
          </div>
        </section>
      )}

      {testimony && (
        <section className="section-alt">
          <div className="container" style={{ textAlign: 'center', maxWidth: 600 }}>
            <h2 className="section-title" style={{ display: 'inline-block' }}>What God Has Done</h2>
            <p style={{ fontSize: '1.1rem', fontStyle: 'italic' }}>"{testimony.testimony}"</p>
            <div className="meta">— {testimony.name || 'A member of FCF'}</div>
          </div>
        </section>
      )}

      <section className="hero" style={{ padding: '56px 20px' }}>
        <h2 style={{ margin: '0 0 10px', fontSize: '1.6rem' }}>New Here?</h2>
        <p>We'd love to welcome you this Sunday. Let us know you're coming.</p>
        <Link to="/visit" className="btn btn-gold">Plan Your Visit</Link>
      </section>
    </PublicLayout>
  )
}
