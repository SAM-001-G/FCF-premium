import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient.js'
import { useAuth } from '../../AuthContext.jsx'

export default function AdminLogin() {
  const { session, loading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [mode, setMode] = useState('login')
  const [resetSent, setResetSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // If the user is already authenticated, take them to the dashboard.
  useEffect(() => {
    if (!loading && session) {
      navigate('/admin', { replace: true })
    }
  }, [loading, session, navigate])

  async function handleSubmit(e) {
    e.preventDefault()

    if (submitting) return

    setError(null)
    setSubmitting(true)

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

      if (signInError) {
        setError(signInError.message)
        return
      }

      if (!data?.session) {
        setError(
          'Sign-in completed, but no authenticated session was returned. Please try again.'
        )
        return
      }

      // Session is confirmed — now navigate.
      navigate('/admin', { replace: true })
    } catch (err) {
      console.error('Admin sign-in error:', err)

      setError(
        err?.message ||
          'Something went wrong while signing in. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function handleReset(e) {
    e.preventDefault()

    if (submitting) return

    setError(null)
    setSubmitting(true)
    setResetSent(false)

    try {
      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo: `${window.location.origin}/admin/reset-password`,
          }
        )

      if (resetError) {
        setError(resetError.message)
        return
      }

      setResetSent(true)
    } catch (err) {
      console.error('Password reset error:', err)

      setError(
        err?.message ||
          'Something went wrong while sending the reset email.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-login form-box">
      <div
        style={{
          textAlign: 'center',
          marginBottom: 20,
        }}
      >
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

        <h2
          style={{
            color: 'var(--navy)',
            margin: 0,
          }}
        >
          FCF Admin
        </h2>

        <p
          style={{
            marginTop: 6,
            color: '#6b7789',
            fontSize: '0.9rem',
          }}
        >
          {mode === 'login'
            ? 'Sign in to the administration dashboard'
            : 'Reset your administrator password'}
        </p>
      </div>

      {error && (
        <div
          className="success-msg"
          style={{
            background: '#fde8e8',
            color: '#a92323',
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      {mode === 'login' ? (
        <>
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="admin-email">
                Email
              </label>

              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="form-field">
              <label htmlFor="admin-password">
                Password
              </label>

              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
              />
            </div>

            <button
              type="submit"
              className="btn btn-navy"
              style={{
                width: '100%',
                opacity: submitting ? 0.7 : 1,
              }}
              disabled={submitting}
            >
              {submitting ? 'Signing In…' : 'Sign In'}
            </button>
          </form>

          <p
            style={{
              fontSize: '0.85rem',
              marginTop: 14,
              textAlign: 'center',
            }}
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setError(null)
                setResetSent(false)
                setMode('reset')
              }}
              style={{ color: 'var(--sky)' }}
            >
              Forgot password?
            </a>
          </p>

          <p
            style={{
              fontSize: '0.8rem',
              color: '#6b7789',
              marginTop: 6,
            }}
          >
            Admin accounts are created by the Super Admin.
          </p>
        </>
      ) : (
        <>
          {resetSent ? (
            <div
              className="success-msg"
              style={{
                marginBottom: 16,
              }}
            >
              Check your email for a password reset link.
            </div>
          ) : (
            <form onSubmit={handleReset}>
              <div className="form-field">
                <label htmlFor="reset-email">
                  Email
                </label>

                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <button
                type="submit"
                className="btn btn-navy"
                style={{
                  width: '100%',
                  opacity: submitting ? 0.7 : 1,
                }}
                disabled={submitting}
              >
                {submitting
                  ? 'Sending…'
                  : 'Send Reset Link'}
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
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setError(null)
                setResetSent(false)
                setMode('login')
              }}
              style={{ color: 'var(--sky)' }}
            >
              ← Back to sign in
            </a>
          </p>
        </>
      )}
    </div>
  )
}