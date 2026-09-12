import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout.jsx'
import { supabase } from '../../supabaseClient.js'
import { useAuth } from '../../AuthContext.jsx'

export default function AdminSignupRequests() {
  const { adminProfile, loading: authLoading } = useAuth()

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)
  const [rejectionReasons, setRejectionReasons] = useState({})
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  async function loadRequests() {
    setLoading(true)
    setError(null)

    try {
      const { data, error: err } = await supabase
        .from('admin_signup_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err

      setRequests(data || [])
    } catch (err) {
      console.error('Failed to load signup requests:', err)
      setError(err.message || 'Failed to load signup requests.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && adminProfile?.role === 'super_admin') {
      loadRequests()
    }
  }, [authLoading, adminProfile?.role])

  async function handleApprove(
    requestId,
    userId,
    email,
    fullName,
    role
  ) {
    setProcessingId(requestId)
    setError(null)
    setSuccess(null)

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) throw userError

      if (!user?.id) {
        throw new Error(
          'Unable to identify the approving administrator.'
        )
      }

      // Mark the signup request as approved.
      const { error: updateError } = await supabase
        .from('admin_signup_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
        })
        .eq('id', requestId)

      if (updateError) throw updateError

      // Create/update the administrator profile.
      const { error: profileError } = await supabase
        .from('admin_profiles')
        .upsert(
          {
            id: userId,
            email,
            full_name: fullName,
            role,
          },
          {
            onConflict: 'id',
          }
        )

      if (profileError) {
        // Attempt to keep the request state consistent if
        // profile creation fails.
        await supabase
          .from('admin_signup_requests')
          .update({
            status: 'pending',
            reviewed_at: null,
            reviewed_by: null,
          })
          .eq('id', requestId)

        throw profileError
      }

      setSuccess(`${fullName || email} has been approved.`)

      await loadRequests()
    } catch (err) {
      console.error('Failed to approve signup request:', err)
      setError(err.message || 'Failed to approve signup request.')
    } finally {
      setProcessingId(null)
    }
  }

  async function handleReject(requestId, reason = '') {
    setProcessingId(requestId)
    setError(null)
    setSuccess(null)

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) throw userError

      if (!user?.id) {
        throw new Error(
          'Unable to identify the reviewing administrator.'
        )
      }

      const { error: rejectError } = await supabase
        .from('admin_signup_requests')
        .update({
          status: 'rejected',
          rejection_reason: reason.trim() || null,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
        })
        .eq('id', requestId)

      if (rejectError) throw rejectError

      setSuccess('Signup request rejected.')

      await loadRequests()
    } catch (err) {
      console.error('Failed to reject signup request:', err)
      setError(err.message || 'Failed to reject signup request.')
    } finally {
      setProcessingId(null)
    }
  }

  function getRequestRole(request) {
    return (
      request.requested_position ||
      request.role ||
      'media_team'
    )
  }

  function formatDate(value) {
    if (!value) return '—'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return value
    }

    return date.toLocaleString()
  }

  if (authLoading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[40vh] items-center justify-center">
          <p>Loading administrator access...</p>
        </div>
      </AdminLayout>
    )
  }

  if (!adminProfile) {
    return <Navigate to="/admin/login" replace />
  }

  if (adminProfile.role !== 'super_admin') {
    return <Navigate to="/admin" replace />
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Admin Signup Requests
          </h1>

          <p className="mt-1 text-sm opacity-70">
            Review and approve requests for administrator access.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-600">
            {success}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border p-6">
            Loading signup requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl border p-6">
            <p className="font-medium">No signup requests found.</p>
            <p className="mt-1 text-sm opacity-70">
              New administrator registration requests will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const role = getRequestRole(request)
              const isProcessing = processingId === request.id
              const isPending =
                !request.status || request.status === 'pending'

              return (
                <div
                  key={request.id}
                  className="rounded-2xl border p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div>
                        <h2 className="font-semibold">
                          {request.full_name || 'Unnamed applicant'}
                        </h2>

                        <p className="text-sm opacity-70">
                          {request.email || 'No email'}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full border px-3 py-1">
                          Position: {role}
                        </span>

                        <span className="rounded-full border px-3 py-1">
                          Status: {request.status || 'pending'}
                        </span>

                        <span className="rounded-full border px-3 py-1">
                          Submitted: {formatDate(request.created_at)}
                        </span>
                      </div>

                      {request.rejection_reason && (
                        <p className="text-sm text-red-500">
                          Rejection reason:{' '}
                          {request.rejection_reason}
                        </p>
                      )}
                    </div>

                    {isPending && (
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() =>
                            handleApprove(
                              request.id,
                              request.user_id,
                              request.email,
                              request.full_name,
                              role
                            )
                          }
                          className="rounded-xl px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isProcessing
                            ? 'Processing...'
                            : 'Approve'}
                        </button>

                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => {
                            const reason =
                              window.prompt(
                                'Reason for rejection (optional):'
                              )

                            if (reason !== null) {
                              handleReject(
                                request.id,
                                reason
                              )
                            }
                          }}
                          className="rounded-xl border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>

                  {isPending && (
                    <div className="mt-4">
                      <label
                        htmlFor={`reason-${request.id}`}
                        className="mb-1 block text-sm font-medium"
                      >
                        Rejection reason
                      </label>

                      <input
                        id={`reason-${request.id}`}
                        type="text"
                        value={
                          rejectionReasons[request.id] || ''
                        }
                        onChange={(event) => {
                          setRejectionReasons((current) => ({
                            ...current,
                            [request.id]: event.target.value,
                          }))
                        }}
                        placeholder="Optional reason"
                        className="w-full rounded-xl border bg-transparent px-4 py-2 outline-none"
                      />

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() =>
                          handleReject(
                            request.id,
                            rejectionReasons[request.id] || ''
                          )
                        }
                        className="mt-2 rounded-xl border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Reject with this reason
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
