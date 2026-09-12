import { useState } from 'react'
import { supabase } from '../../supabaseClient.js'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [mode, setMode] = useState('login') // 'login' | 'reset'
  const [resetSent, setResetSent] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else navigate('/admin')
  }

  async function handleReset(e) {
    e.preventDefault()
    setError(null)
    const siteUrl = 'https://fcf-premium.vercel.app'
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/admin/reset-password`,
    })
    if (error) setError(error.message)
    else setResetSent(true)
  }

  return (
    <div className="admin-login form-box">
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <img src="/logo.png" alt="FCF" style={{ height: 60, width: 60, margin: '0 auto 10px', borderRadius: '50%' }} />
        <h2 style={{ color: 'var(--navy)', margin: 0 }}>FCF Admin</h2>
      </div>
      {error && <div className="success-msg" style={{ background: '#fde8e8', color: '#a92323' }}>{error}</div>}

      {mode === 'login' ? (
        <>
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-navy" style={{ width: '100%' }}>Sign In</button>
          </form>
          <p style={{ fontSize: '0.85rem', marginTop: 14, textAlign: 'center' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); setError(null); setMode('reset') }} style={{ color: 'var(--sky)' }}>
              Forgot password?
            </a>
          </p>
          <p style={{ fontSize: '0.8rem', color: '#6b7789', marginTop: 6 }}>
            Admin accounts are created by the Super Admin via the Supabase dashboard.
          </p>
        </>
      ) : (
        <>
          {resetSent ? (
            <div className="success-msg">Check your email for a password reset link.</div>
          ) : (
            <form onSubmit={handleReset}>
              <div className="form-field">
                <label>Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-navy" style={{ width: '100%' }}>Send Reset Link</button>
            </form>
          )}
          <p style={{ fontSize: '0.85rem', marginTop: 14, textAlign: 'center' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); setError(null); setResetSent(false); setMode('login') }} style={{ color: 'var(--sky)' }}>
              Back to sign in
            </a>
          </p>
        </>
      )}
    </div>
  )
}
