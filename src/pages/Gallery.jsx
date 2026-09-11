import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'
import PublicLayout from '../components/PublicLayout.jsx'

export default function Gallery() {
  const [albums, setAlbums] = useState([])
  const [photosByAlbum, setPhotosByAlbum] = useState({})

  useEffect(() => {
    supabase.from('gallery_albums').select('*').then(async ({ data }) => {
      setAlbums(data || [])
      const { data: photos } = await supabase.from('gallery_photos').select('*')
      const grouped = {}
      ;(photos || []).forEach((p) => {
        grouped[p.album_id] = grouped[p.album_id] || []
        grouped[p.album_id].push(p)
      })
      setPhotosByAlbum(grouped)
    })
  }, [])

  return (
    <PublicLayout>
      <section className="container">
        <h2 className="section-title">Gallery</h2>
        {albums.length === 0 && <p>Photo albums will appear here once the admin team uploads them.</p>}
        {albums.map((album) => (
          <div key={album.id} style={{ marginBottom: 32 }}>
            <h3 style={{ color: 'var(--navy)' }}>{album.title}</h3>
            <div className="grid grid-3">
              {(photosByAlbum[album.id] || []).map((p) => (
                <img key={p.id} src={p.photo_url} alt={p.caption || album.title} style={{ borderRadius: 10 }} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </PublicLayout>
  )
}
