import { useState } from 'react'
import { supabase } from '../supabaseClient.js'

export default function ImageUpload({ value, onChange, folder = 'uploads' }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const ext = file.name.split('.').pop()
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const { error: uploadError } = await supabase.storage.from('media').upload(path, file)
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      onChange(data.publicUrl)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="image-upload">
      {value ? (
        <div className="image-upload-preview">
          <img src={value} alt="Preview" />
          <button type="button" className="image-upload-remove" onClick={() => onChange('')}>&times; Remove</button>
        </div>
      ) : (
        <label className="image-upload-dropzone">
          <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          {uploading ? 'Uploading…' : '📷 Click to upload an image'}
        </label>
      )}
      {error && <div style={{ color: '#a92323', fontSize: '0.8rem', marginTop: 6 }}>{error}</div>}
      <div className="form-field" style={{ marginTop: 8 }}>
        <label style={{ fontSize: '0.75rem', color: '#8a95a3' }}>or paste an image URL</label>
        <input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="https://... or /images/..." />
      </div>
    </div>
  )
}
