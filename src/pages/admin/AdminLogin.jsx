import { useState } from 'react'
import { supabase } from '../../supabaseClient.js'
import { Link, useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(
    () => localStorage.getItem('fcf_admin_remember') !== 'false'
  )
  const [error, setError] = useState(null)
  const [mode, setMode] = useState('login')
  const [resetSent, setResetSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    setError(null)
    setLoading(true)

    /*
     * Set the storage preference BEFORE signing in.
     * The custom Supabase storage reads this value when
     * it saves the authentication session.
     */
    localStorage.setItem(
      'fcf_admin_remember',
      rememberMe ? 'true' : 'false'
    )

    try {
      const {
        data,
        error: signInError,
      } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        throw signInError
      }

      if (!data?.session) {
        throw new Error(
          'Login succeeded but no session was created. Please try again.'
        )
      }

      navigate('/admin')
    } catch (err) {
      console.error('Admin login error:', err)
      setError(err.message || 'Unable to sign in.')
    } finally {
      setLoading(false)
    }
  }

  async function handleReset(e) {
    e.preventDefault()

    setError(null)
    setLoading(true)

    const siteUrl = 'https://fcf-premium.vercel.app'

    try {
      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo: `${siteUrl}/admin/reset-password`,
          }
        )

      if (resetError) {
        throw resetError
      }

      setResetSent(true)
    } catch (err) {
      setError(err.message || 'Unable to send reset email.')
    } finally {
      setLoading(false)
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
      </div>

      {error && (
        <div
          className="success-msg"
          style={{
            background: '#fde8e8',
            color: '#a92323',
          }}
        >
          {error}
        </div>
      )}

      {mode === 'login' ? (
        <>
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Email</label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div className="form-field">
              <label>Password</label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                margin: '0 0 16px',
                fontSize: '0.85rem',
                color: 'var(--text-soft)',
                cursor: loading
                  ? 'not-allowed'
                  : 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
                disabled={loading}
                style={{
                  width: 16,
                  height: 16,
                  margin: 0,
                  accentColor: 'var(--blue)',
                }}
              />

              <span>Remember me on this device</span>
            </label>

            <button
              type="submit"
              className="btn btn-navy"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Signing In…' : 'Sign In'}
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
              marginTop: 12,
            }}
          >
            <Link
              to="/admin/register"
              style={{ color: 'var(--blue)' }}
            >
              Don't have an admin account? Create an account
            </Link>
          </p>
        </>
      ) : (
        <>
          {resetSent ? (
            <div className="success-msg">
              Check your email for a password reset link.
            </div>
          ) : (
            <form onSubmit={handleReset}>
              <div className="form-field">
                <label>Email</label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                className="btn btn-navy"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading
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
              Back to sign in
            </a>
          </p>
        </>
      )}
    </div>
  )
}
