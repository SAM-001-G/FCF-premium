import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient.js'
import { useAuth } from '../../AuthContext.jsx'

const positions = [
  { value: 'media_team', label: 'Media Team' },
  { value: 'events_team', label: 'Events Team' },
  { value: 'prayer_team', label: 'Prayer Team' },
  { value: 'communications', label: 'Communications' },
  { value: 'editor', label: 'Editor' },
]

export default function AdminRegister() {
  const navigate = useNavigate()
  const { session, loading: authLoading } = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [requestedPosition, setRequestedPosition] =
    useState('media_team')

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // If the user is already authenticated, they don't need to register.
  useEffect(() => {
    if (!authLoading && session && !success) {
      navigate('/admin', { replace: true })
    }
  }, [authLoading, session, success, navigate])

  async function handleSubmit(e) {
    e.preventDefault()

    if (loading) return

    setError(null)

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

    if (password.length < 6) {
      setError(
        'Password must be at least 6 characters long.'
      )
      return
    }

    if (password !== confirmPassword) {
      setError('The passwords do not match.')
      return
    }

    setLoading(true)

    try {
      /*
       * Step 1:
       * Create the Supabase Auth account.
       *
       * emailRedirectTo is only relevant when email
       * confirmation is enabled in Supabase Auth.
       */
      const {
        data: signUpData,
        error: signUpError,
      } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
          },
          emailRedirectTo: `${window.location.origin}/admin/login`,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      const user = signUpData?.user

      if (!user) {
        setError(
          'The account could not be created. Please try again.'
        )
        return
      }

      /*
       * Depending on the Supabase email-confirmation setting,
       * signUp() may return a session or may require the user
       * to confirm their email first.
       */
      if (!signUpData.session) {
        setSuccess(true)
        return
      }

      /*
       * Step 2:
       * The user is authenticated, so submit the admin access
       * request using their authenticated user ID.
       *
       * The database RLS policy should allow the authenticated
       * user to create their own request.
       */
      const {
        error: requestError,
      } = await supabase
        .from('admin_signup_requests')
        .insert({
          user_id: user.id,
          full_name: cleanName,
          email: cleanEmail,
          requested_position: requestedPosition,
          status: 'pending',
        })

      if (requestError) {
        console.error(
          'Admin signup request error:',
          requestError
        )

        /*
         * The Auth account was created, but the request failed.
         * Do not silently pretend registration succeeded.
         */
        setError(
          `Account created, but the access request could not be submitted: ${requestError.message}`
        )
        return
      }

      setSuccess(true)
    } catch (err) {
      console.error(
        'Admin registration error:',
        err
      )

      setError(
        err?.message ||
          'Something went wrong during registration. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div
        className="admin-login form-box"
        style={{ textAlign: 'center' }}
      >
        <div
          style={{
            fontSize: '2rem',
            marginBottom: 12,
          }}
        >
          ⏳
        </div>

        <h2
          style={{
            color: 'var(--navy)',
            margin: 0,
          }}
        >
          Checking session…
        </h2>
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
            color: '#6b7789',
            marginTop: 6,
            fontSize: '0.9rem',
          }}
        >
          Request access to the FCF administration
          dashboard
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

      {success ? (
        <div style={{ textAlign: 'center' }}>
          <div
            className="success-msg"
            style={{ marginBottom: 18 }}
          >
            Your admin access request has been
            submitted successfully.
          </div>

          <p
            style={{
              color: '#6b7789',
              lineHeight: 1.6,
            }}
          >
            Your account/request is now awaiting
            approval. If email confirmation is enabled,
            check your inbox and confirm your email
            address first.
          </p>

          <button
            type="button"
            className="btn btn-navy"
            style={{
              width: '100%',
              marginTop: 12,
            }}
            onClick={() =>
              navigate('/admin/login', {
                replace: true,
              })
            }
          >
            Go to Admin Login
          </button>
        </div>
      ) : (
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
              onChange={(e) =>
                setFullName(e.target.value)
              }
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
              onChange={(e) =>
                setEmail(e.target.value)
              }
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
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="At least 6 characters"
              disabled={loading}
            />
          </div>

          {/* Confirm Password */}
          <div className="form-field">
            <label htmlFor="admin-confirm-password">
              Confirm Password
            </label>

            <input
              id="admin-confirm-password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Enter the password again"
              disabled={loading}
            />
          </div>

          {/* Requested Position */}
          <div className="form-field">
            <label htmlFor="requested-position">
              Requested Position
            </label>

            <select
              id="requested-position"
              value={requestedPosition}
              onChange={(e) =>
                setRequestedPosition(e.target.value)
              }
              disabled={loading}
              required
            >
              {positions.map((position) => (
                <option
                  key={position.value}
                  value={position.value}
                >
                  {position.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-navy"
            style={{
              width: '100%',
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            {loading
              ? 'Creating Account…'
              : 'Create Account'}
          </button>
        </form>
      )}

      {!success && (
        <p
          style={{
            fontSize: '0.85rem',
            marginTop: 16,
            textAlign: 'center',
            color: '#6b7789',
          }}
        >
          Already have an admin account?{' '}
          <Link
            to="/admin/login"
            style={{ color: 'var(--sky)' }}
          >
            Sign in
          </Link>
        </p>
      )}
    </div>
  )
} 