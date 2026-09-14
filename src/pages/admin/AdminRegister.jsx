import { useState } from 'react'
import { supabase } from '../../supabaseClient.js'
import { Link } from 'react-router-dom'

const roles = [
  { value: 'pastor', label: 'Pastor' },
  { value: 'media_team', label: 'Media Team' },
  { value: 'events_team', label: 'Events Team' },
  { value: 'prayer_team', label: 'Prayer Team' },
  { value: 'communications', label: 'Communications' },
  { value: 'editor', label: 'Editor' },
]

export default function AdminRegister() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [requestedRole, setRequestedRole] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function validateForm() {
    if (!fullName.trim()) return 'Full name is required'
    if (!email.trim()) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Valid email is required'
    }
    if (!password) return 'Password is required'
    if (password.length < 8) {
      return 'Password must be at least 8 characters'
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match'
    }
    if (!requestedRole) {
      return 'Requested position is required'
    }

    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    const validationError = validateForm()

    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      const cleanName = fullName.trim()
      const cleanEmail = email.trim().toLowerCase()

      /*
       * The auth.users trigger in Supabase creates the
       * admin_signup_requests record automatically.
       *
       * Do NOT insert into admin_signup_requests here.
       * Do NOT insert into admin_notifications here.
       */
      const { data, error: signupError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            registration_type: 'admin',
            full_name: cleanName,
            requested_role: requestedRole,
          },
        },
      })

      if (signupError) {
        throw signupError
      }

      if (!data?.user?.id) {
        throw new Error('Failed to create account')
      }

      setSubmitted(true)
    } catch (err) {
      console.error('Admin registration error:', err)
      setError(err.message || 'Failed to register')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="admin-login form-box">
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '2.5rem',
              marginBottom: 16,
            }}
          >
            ✓
          </div>

          <h2
            style={{
              color: 'var(--navy)',
              margin: '0 0 12px',
            }}
          >
            Registration Request Submitted
          </h2>

          <p
            style={{
              color: 'var(--text-soft)',
              marginBottom: 24,
            }}
          >
            Your account request has been sent to an FCF administrator
            for approval. You will be able to access the admin area once
            your request is approved.
          </p>

          <Link
            to="/"
            className="btn btn-navy"
            style={{ display: 'inline-block' }}
          >
            Back to Website
          </Link>
        </div>
      </div>
    )
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
          Create Admin Account
        </h2>

        <p
          style={{
            color: 'var(--text-soft)',
            fontSize: '0.9rem',
            margin: '8px 0 0',
          }}
        >
          Request access to the admin dashboard
        </p>
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

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Full Name</label>

          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-field">
          <label>Email</label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
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
          />
        </div>

        <div className="form-field">
          <label>Confirm Password</label>

          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-field">
          <label>Requested Position</label>

          <select
            required
            value={requestedRole}
            onChange={(e) => setRequestedRole(e.target.value)}
            disabled={loading}
          >
            <option value="">Select a position</option>

            {roles.map((role) => (
              <option
                key={role.value}
                value={role.value}
              >
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-navy"
          style={{ width: '100%' }}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Create Account'}
        </button>
      </form>

      <p
        style={{
          fontSize: '0.85rem',
          marginTop: 14,
          textAlign: 'center',
        }}
      >
        Already have an account?{' '}

        <Link
          to="/admin/login"
          style={{ color: 'var(--blue)' }}
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
