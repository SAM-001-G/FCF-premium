import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient.js'
import AdminLayout from '../../components/AdminLayout.jsx'
import { useAuth } from '../../AuthContext.jsx'

const roles = ['super_admin', 'pastor', 'media_team', 'events_team', 'prayer_team', 'communications', 'editor']

export default function AdminUsers() {
  const { session } = useAuth()
  const [profiles, setProfiles] = useState([])
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('editor')
  const [saved, setSaved] = useState(false)

  async function load() {
    const { data } = await supabase.from('admin_profiles').select('*').order('created_at')
    setProfiles(data || [])
  }
  useEffect(() => { load() }, [])

  async function saveMyProfile(e) {
    e.preventDefault()
    await supabase.from('admin_profiles').upsert({ id: session.user.id, full_name: fullName, role })
    setSaved(true)
    load()
  }

  async function updateRole(id, newRole) {
    await supabase.from('admin_profiles').update({ role: newRole }).eq('id', id)
    load()
  }

  return (
    <AdminLayout>
      <h2 style={{ color: 'var(--navy)' }}>Team</h2>

      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <h3 style={{ marginTop: 0 }}>My Profile</h3>
        {saved && <div className="success-msg">Profile saved.</div>}
        <form onSubmit={saveMyProfile}>
          <div className="grid grid-2">
            <div className="form-field">
              <label>Full Name</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="form-field">
              <label>My Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                {roles.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-gold">Save Profile</button>
        </form>
      </div>

      <h3 style={{ color: 'var(--navy)' }}>All Admin Profiles</h3>
      <table className="admin-table">
        <thead><tr><th>Name</th><th>Role</th></tr></thead>
        <tbody>
          {profiles.map((p) => (
            <tr key={p.id}>
              <td>{p.full_name || '—'}</td>
              <td>
                <select value={p.role} onChange={(e) => updateRole(p.id, e.target.value)}>
                  {roles.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                </select>
              </td>
            </tr>
          ))}
          {profiles.length === 0 && <tr><td colSpan={2}>No profiles yet — save yours above to get started.</td></tr>}
        </tbody>
      </table>

      <p style={{ marginTop: 20, fontSize: '0.85rem', color: '#6b7789' }}>
        New admin logins are created in the Supabase dashboard (Authentication → Users → Add User).
        Once someone logs in for the first time, they can set their name and role here.
      </p>
    </AdminLayout>
  )
}
