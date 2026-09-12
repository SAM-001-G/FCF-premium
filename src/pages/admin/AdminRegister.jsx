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
    if (!fullName.trim()) {
      return 'Full name is required'
    }

    if (!email.trim()) {
      return 'Email is required'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return 'Please enter a valid email address'
    }

    if (!password) {
      return 'Password is required'
    }

    if (password.length < 8) {
      return 'Password must be at least 8 characters'
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match'
    }

    if (!requestedRole) {
      return 'Please select your requested position'
    }

    // Extra client-side protection.
    // super_admin is intentionally not present in the selector.
    if (requestedRole === 'super_admin') {
      return 'Invalid requested position'
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
       * IMPORTANT:
       * We no longer insert directly into admin_signup_requests.
       *
       * The Supabase database trigger created in the SQL setup watches
       * auth.users and automatically creates:
       *
       * 1. admin_signup_requests
       * 2. admin_notifications
       *
       * This is necessary because email confirmation may mean there is
       * no authenticated browser session immediately after signUp().
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
        throw new Error('Account creation failed. Please try again.')
      }

      /*
       * Supabase can return a user with no identities when an account
       * already exists, depending on the project's email-enumeration
       * protection settings.
       */
      if (data.user.identities && data.user.identities.length === 0) {
        throw new Error(
          'An account with this email may already exist. Please sign in instead.'
        )
      }

      /*
       * At this point the database trigger has created the pending
       * admin_signup_requests record.
       *
       * The notification trigger also creates notifications for all
       * existing super_admin accounts.
       */
      setSubmitted(true)
    } catch (err) {
      console.error('Admin registration error:', err)

      setError(
        err?.message ||
        'Unable to create your account request. Please try again.'
      )
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
              width: 64,
              height: 64,
              margin: '0 auto 18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(76, 175, 80, 0.12)',
              color: '#2e7d32',
              fontSize: '2rem',
              fontWeight: 700,
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
              lineHeight: 1.6,
              marginBottom: 24,
            }}
          >
            Your admin account request has been sent to an FCF administrator
            for approval.
          </p>

          <p
            style={{
              color: 'var(--text-soft)',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              marginBottom: 24,
            }}
          >
            You will be able to access the admin dashboard once your request
            has been approved.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <Link
              to="/admin/login"
              className="btn btn-navy"
              style={{
                display: 'block',
                textDecoration: 'none',
              }}
            >
              Go to Admin Login
            </Link>

            <Link
              to="/"
              style={{
                color: 'var(--blue)',
                textDecoration: 'none',
                fontSize: '0.9rem',
              }}
            >
              Back to Website
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-login form-box">

      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: 24,
        }}
      >
        <img
          src="/logo.png"
          alt="Faith in Christ Fellowship"
          style={{
            height: 60,
            width: 60,
            margin: '0 auto 12px',
            borderRadius: '50%',
            objectFit: 'cover',
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
          Request access to the FCF administration dashboard
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          style={{
            background: '#fde8e8',
            color: '#a92323',
            padding: '12px 14px',
            borderRadius: 12,
            marginBottom: 20,
            lineHeight: 1.45,
            fontSize: '0.9rem',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Full Name */}
        <div className="form-field">
          <label htmlFor="admin-full-name">
            Full Name
          </label>

          <input
            id="admin-full-name"
            type="text"
            required
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            disabled={loading}
          />
        </div>

        {/* Email */}
        <div className="form-field">
          <label htmlFor="admin-email">
            Email
          </label>

          <input
            id="admin-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div className="form-field">
          <label htmlFor="admin-password">
            Password
          </label>

          <input
            id="admin-password"
            type="password"
            required
