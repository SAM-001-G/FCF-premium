import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient.js'

export default function AdminResetPassword() {
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [recoveryReady, setRecoveryReady] = useState(false)

  useEffect(() => {
    let mounted = true

    async function checkRecoverySession() {
      const { data, error: sessionError } =
        await supabase.auth.getSession()

      if (!mounted) return

      if (sessionError) {
        console.error(
          'Recovery session error:',
          sessionError
        )
        setError(sessionError.message)
        setCheckingSession(false)
        return
      }

      if (data?.session) {
        setRecoveryReady(true)
      } else {
        setError(
          'This password reset link is invalid or has expired. Please request a new reset link.'
        )
      }

      setCheckingSession(false)
    }

    checkRecoverySession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return

        if (
          event === 'PASSWORD_RECOVERY' &&
          session
        ) {
          setRecoveryReady(true)
          setError(null)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()

    if (updating) return

    setError(null)

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

    setUpdating(true)

    try {
      const { error: updateError } =
        await supabase.auth.updateUser({
          password,
        })

      if (updateError) {
        setError(updateError.message)
        return
      }

      setSuccess(true)

      // Sign out after successful password change.
      // The user can then sign in using the new password.
      await supabase.auth.signOut()
    } catch (err) {
      console.error(
        'Password update error:',
        err
      )

      setError(
        err?.message ||
          'Something went wrong while updating your password.'
      )
    } finally {
      setUpdating(false)
    }
  }

  if (checkingSession) {
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
          Verifying Reset Link…
        </h2>

        <p
          style={{
            color: '#6b7789',
            marginTop: 8,
          }}
        >
          Please wait while we verify your
          password-reset session.
        </p>
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
          Reset Password
        </h2>
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
            Your password has been updated
            successfully.
          </div>

          <p
            style={{
              color: '#6b7789',
              marginBottom: 18,
            }}
          >
            You can now sign in using your new
            password.
          </p>

          <button
            type="button"
            className="btn btn-navy"
            style={{ width: '100%' }}
            onClick={() =>
              navigate('/admin/login', {
                replace: true,
              })
            }
          >
            Go to Admin Login
          </button>
        </div>
      ) : recoveryReady ? (
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="new-password">
              New Password
            </label>

            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              disabled={updating}
              placeholder="Enter new password"
            />
          </div>

          <div className="form-field">
            <label htmlFor="confirm-password">
              Confirm New Password
            </label>

            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              disabled={updating}
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-navy"
            style={{
              width: '100%',
              opacity: updating ? 0.7 : 1,
            }}
            disabled={updating}
          >
            {updating
              ? 'Updating Password…'
              : 'Update Password'}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              color: '#6b7789',
              lineHeight: 1.6,
            }}
          >
            Your password-reset session could not
            be verified.
          </p>

          <button
            type="button"
            className="btn btn-navy"
            style={{
              width: '100%',
              marginTop: 10,
            }}
            onClick={() =>
              navigate('/admin/login', {
                replace: true,
              })
            }
          >
            Request a New Reset Link
          </button>
        </div>
      )}
    </div>
  )
}