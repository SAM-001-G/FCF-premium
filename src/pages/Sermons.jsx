import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'
import PublicLayout from '../components/PublicLayout.jsx'

function getYouTubeId(url) {
  if (!url) return null

  try {
    const parsed = new URL(url)

    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.slice(1).split('/')[0]
    }

    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.searchParams.get('v')) {
        return parsed.searchParams.get('v')
      }

      const parts = parsed.pathname.split('/').filter(Boolean)

      if (parts[0] === 'shorts' || parts[0] === 'embed') {
        return parts[1]
      }
    }
  } catch {
    return null
  }

  return null
}

export default function Sermons() {
  const [sermons, setSermons] = useState([])
  const [query, setQuery] = useState('')
  const [activeVideo, setActiveVideo] = useState(null)

  useEffect(() => {
    supabase
      .from('sermons')
      .select('*')
      .order('sermon_date', { ascending: false })
      .then(({ data }) => setSermons(data || []))
  }, [])

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setActiveVideo(null)
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = activeVideo ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [activeVideo])

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

        <div
          className="form-field"
          style={{ maxWidth: 400, marginBottom: 24 }}
        >
          <input
            placeholder="Search by title, scripture, or topic..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-3">
          {filtered.map((s) => {
            const youtubeId = getYouTubeId(s.youtube_link)

            const thumbnail =
              s.thumbnail_url ||
              (youtubeId
                ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                : null)

            return (
              <div className="card" key={s.id}>
                {thumbnail && (
                  <div className="sermon-thumbnail">
                    <img src={thumbnail} alt={s.title} />

                    {youtubeId && (
                      <button
                        className="sermon-play"
                        type="button"
                        aria-label={`Play ${s.title}`}
                        onClick={() =>
                          setActiveVideo({
                            id: youtubeId,
                            title: s.title,
                          })
                        }
                      >
                        ▶
                      </button>
                    )}
                  </div>
                )}

                <div className="card-body">
                  <div className="meta">
                    {s.speaker} &middot; {s.sermon_date}
                  </div>

                  <h3>{s.title}</h3>

                  {s.scripture && (
                    <span className="tag">{s.scripture}</span>
                  )}

                  <p>{s.description}</p>

                  {s.youtube_link && youtubeId && (
                    <div className="sermon-actions">
                      <button
                        className="btn btn-navy"
                        type="button"
                        onClick={() =>
                          setActiveVideo({
                            id: youtubeId,
                            title: s.title,
                          })
                        }
                      >
                        ▶ Watch here
                      </button>

                      <a
                        className="btn"
                        href={s.youtube_link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open YouTube ↗
                      </a>
                    </div>
                  )}

                  {s.youtube_link && !youtubeId && (
                    <a
                      className="btn btn-navy"
                      href={s.youtube_link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Watch
                    </a>
                  )}
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && <p>No sermons found.</p>}
        </div>
      </section>

      {activeVideo && (
        <div
          className="video-modal"
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="video-modal-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="video-modal-header">
              <h3>{activeVideo.title}</h3>

              <button
                className="video-close"
                type="button"
                aria-label="Close video"
                onClick={() => setActiveVideo(null)}
              >
                ×
              </button>
            </div>

            <div className="video-frame">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="video-modal-footer">
              <a
                className="btn btn-navy"
                href={`https://www.youtube.com/watch?v=${activeVideo.id}`}
                target="_blank"
                rel="noreferrer"
              >
                Open in YouTube ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  )
}
