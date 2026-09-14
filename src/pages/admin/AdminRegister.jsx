import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient.js'

const ROLES = [
  { value: 'pastor', label: 'Pastor' },
  { value: 'media_team', label: 'Media Team' },
  { value: 'events_team', label: 'Events Team' },
  { value: 'prayer_team', label: 'Prayer Team' },
  { value: 'communications', label: 'Communications' },
  { value: 'editor', label: 'Editor' },
]

export default function AdminRegister() {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [requestedRole, setRequestedRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const cleanName = fullName.trim()
    const cleanEmail = email.trim().toLowerCase()

    if (!cleanName) {
      setError('Please enter your full name.')
      return
    }

    if (!cleanEmail) {
      setError('Please enter your email address.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!requestedRole) {
      setError('Please select the position you are requesting.')
      return
    }

    setLoading(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
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

      if (signUpError) {
        throw signUpError
      }

      if (!data?.user) {
        throw new Error('Registration could not be completed. Please try again.')
      }

      /*
       * IMPORTANT:
       * The Supabase auth.users trigger creates the corresponding
       * admin_signup_requests record automatically.
       *
       * Do NOT insert into admin_signup_requests here.
       * Do NOT insert into admin_notifications here.
       */

      setSubmitted(true)
    } catch (err) {
      console.error('Admin registration error:', err)

      setError(
        err?.message ||
          'Unable to submit your registration request. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="admin-login form-box">
        <h1>Registration Submitted</h1>

        <p>
          Your administrator registration request has been submitted
          successfully.
        </p>

        <p>
          A Super Admin will review your request before administrator access
          is granted.
        </p>

        <div style={{ marginTop: '1.5rem' }}>
          <Link to="/admin/login" className="btn">
            Continue to Admin Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-login form-box">
      <h1>Request Admin Access</h1>

      <p>
        Create an administrator account request for Faith in Christ
        Fellowship.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>

          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Enter your full name"
            autoComplete="name"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email address"
            autoComplete="email"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="requestedRole">Requested Position</label>

          <select
            id="requestedRole"
            value={requestedRole}
            onChange={(event) => setRequestedRole(event.target.value)}
            disabled={loading}
          >
            <option value="">Select a position</option>

            {ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>

          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm your password"
            autoComplete="new-password"
            disabled={loading}
          />
        </div>

        {error && (
          <div
            role="alert"
            style={{
              marginBottom: '1rem',
              padding: '0.75rem',
            }}
          >
            {error}
          </div>
        )}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Submitting Request…' : 'Request Admin Access'}
        </button>
      </form>

      <p style={{ marginTop: '1.5rem' }}>
        Already have an account?{' '}
        <Link to="/admin/login">Sign in</Link>
      </p>

      <p style={{ marginTop: '0.75rem' }}>
        <button
          type="button"
          onClick={() => navigate('/')}
          disabled={loading}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          Return to website
        </button>
      </p>
    </div>
  )
}
