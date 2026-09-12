import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient.js'

export default function ResetPassword() {
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [ready, setReady] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    async function prepareRecovery() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!mounted) return

      if (session) {
        setReady(true)
      } else {
        setError(
          'This password reset link is invalid or has expired. Please request a new reset link.'
        )
      }
    }

    prepareRecovery()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return

      if (event === 'PASSWORD_RECOVERY' && session) {
        setReady(true)
        setError(null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()

    setError(null)
    setMessage(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSaving(true)

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    })

    setSaving(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setMessage(
      'Password updated successfully. Redirecting to admin sign in…'
    )

    await supabase.auth.signOut()

    setTimeout(() => {
      navigate('/admin/login', { replace: true })
    }, 1200)
  }

  return (
    <div className="admin-login form-box">
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <img
          src="/logo.png"
          alt="FCF"
          style={{
            height: 60,
            width: 60,
            margin: '0 auto 10px',
            borderRadius: '50%',
          }}
        />

        <h2 style={{ color: 'var(--navy)', margin: 0 }}>
          Set New Password
        </h2>

        <p style={{ color: '#6b7789', marginTop: 8 }}>
          Create a new password for your FCF Admin account.
        </p>
      </div>

      {error && (
        <div
          className="success-msg"
          style={{
            background: '#fde8e8',
            color: '#a92323',
            marginBottom: 14,
          }}
        >
          {error}
        </div>
      )}

      {message && (
        <div
          className="success-msg"
          style={{ marginBottom: 14 }}
        >
          {message}
        </div>
      )}

      {ready && !message && (
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>New Password</label>

            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className="form-field">
            <label>Confirm New Password</label>

            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-navy"
            style={{ width: '100%' }}
            disabled={saving}
          >
            {saving
              ? 'Updating Password…'
              : 'Update Password'}
          </button>
        </form>
      )}

      <p
        style={{
          fontSize: '0.85rem',
          marginTop: 14,
          textAlign: 'center',
        }}
      >
        <a
          href="/admin/login"
          style={{ color: 'var(--sky)' }}
        >
          Back to admin sign in
        </a>
      </p>
    </div>
  )
}
