import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient.js'
import AdminLayout from '../../components/AdminLayout.jsx'
import { useAuth } from '../../AuthContext.jsx'
import { Navigate } from 'react-router-dom'

export default function AdminSignupRequests() {
  const { adminProfile } = useAuth()

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)
  const [rejectionReasons, setRejectionReasons] = useState({})
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Only an approved Super Admin can access this page.
  if (
    adminProfile &&
    (
      adminProfile.role !== 'super_admin' ||
      adminProfile.approved !== true
    )
  ) {
    return <Navigate to="/admin" replace />
  }

  async function loadRequests() {
    try {
      setError(null)

      const { data, error: requestError } = await supabase
        .from('admin_signup_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (requestError) {
        throw requestError
      }

      setRequests(data || [])
    } catch (err) {
      console.error('Failed to load admin signup requests:', err)
      setError(err.message || 'Unable to load signup requests.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  async function handleApprove(requestId, requestedRole) {
    if (!requestId || !requestedRole) {
      setError('Invalid signup request.')
      return
    }

    const confirmed = window.confirm(
      `Approve this administrator request as ${requestedRole}?`
    )

    if (!confirmed) {
      return
    }

    setProcessingId(requestId)
    setError(null)
    setSuccess(null)

    try {
      const { error: rpcError } = await supabase.rpc(
        'approve_admin_signup_request',
        {
          p_request_id: requestId,
          p_role: requestedRole,
        }
      )

      if (rpcError) {
        throw rpcError
      }

      setSuccess('Administrator request approved successfully.')

      await loadRequests()
    } catch (err) {
      console.error('Failed to approve admin signup request:', err)
      setError(err.message || 'Unable to approve this request.')
    } finally {
      setProcessingId(null)
    }
  }

  async function handleReject(requestId) {
    if (!requestId) {
      setError('Invalid signup request.')
      return
    }

    const reason = rejectionReasons[requestId]?.trim() || ''

    const confirmed = window.confirm(
      reason
        ? 'Reject this administrator request?'
        : 'Reject this administrator request without a reason?'
    )

    if (!confirmed) {
      return
    }

    setProcessingId(requestId)
    setError(null)
    setSuccess(null)

    try {
      const { error: rpcError } = await supabase.rpc(
        'reject_admin_signup_request',
        {
          p_request_id: requestId,
          p_reason: reason || null,
        }
      )

      if (rpcError) {
        throw rpcError
      }

      setRejectionReasons((previous) => ({
        ...previous,
        [requestId]: '',
      }))

      setSuccess('Administrator request rejected.')

      await loadRequests()
    } catch (err) {
      console.error('Failed to reject admin signup request:', err)
      setError(err.message || 'Unable to reject this request.')
    } finally {
      setProcessingId(null)
    }
  }

  const pendingRequests = requests.filter(
    (request) => request.status === 'pending'
  )

  const reviewedRequests = requests.filter(
    (request) => request.status !== 'pending'
  )

  return (
    <AdminLayout>
      <h2 style={{ color: 'var(--navy)' }}>
        Admin Signup Requests
      </h2>

      {error && (
        <div
          role="alert"
          style={{
            background: '#fde8e8',
            color: '#a92323',
            padding: 12,
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          style={{
            background: '#e8f7ed',
            color: '#176b36',
            padding: 12,
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          {success}
        </div>
      )}

      <div style={{ marginBottom: 28 }}>
        <h3
          style={{
            color: 'var(--navy)',
            margin: '0 0 16px',
          }}
        >
          Pending Requests ({pendingRequests.length})
        </h3>

        {loading ? (
          <div>Loading...</div>
        ) : pendingRequests.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: 'var(--text-soft)',
            }}
          >
            No pending requests
          </div>
        ) : (
          <div className="grid grid-2">
            {pendingRequests.map((request) => {
              const processing =
                processingId === request.id

              return (
                <div
                  key={request.id}
                  className="card"
                  style={{ padding: 20 }}
                >
                  <h4
                    style={{
                      margin: '0 0 8px',
                      color: 'var(--navy)',
                    }}
                  >
                    {request.full_name}
                  </h4>

                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-soft)',
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <strong>Email:</strong> {request.email}
                    </div>

                    <div>
                      <strong>Requested Position:</strong>{' '}
                      {request.requested_role}
                    </div>

                    <div>
                      <strong>Date:</strong>{' '}
                      {new Date(
                        request.created_at
                      ).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <label
                      htmlFor={`rejection-${request.id}`}
                      style={{
                        fontSize: '0.8rem',
                        display: 'block',
                        marginBottom: 4,
                        color: 'var(--text-soft)',
                      }}
                    >
                      Rejection reason (optional)
                    </label>

                    <input
                      id={`rejection-${request.id}`}
                      type="text"
                      placeholder="Reason for rejection"
                      value={
                        rejectionReasons[request.id] || ''
                      }
                      onChange={(event) =>
                        setRejectionReasons((previous) => ({
                          ...previous,
                          [request.id]: event.target.value,
                        }))
                      }
                      disabled={processing}
                      style={{
                        width: '100%',
                        fontSize: '0.85rem',
                        padding: '8px 10px',
                        borderRadius: 8,
                        border: 'none',
                        background: 'var(--bg)',
                        boxShadow:
                          'inset 2px 2px 6px var(--shadow-dark), inset -2px -2px 6px var(--shadow-light)',
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleApprove(
                          request.id,
                          request.requested_role
                        )
                      }
                      disabled={processing}
                      className="btn"
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        fontSize: '0.85rem',
                        background: 'var(--gradient-accent)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        cursor: processing
                          ? 'not-allowed'
                          : 'pointer',
                        fontWeight: 600,
                        opacity: processing ? 0.6 : 1,
                      }}
                    >
                      {processing
                        ? 'Processing…'
                        : 'Approve'}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleReject(request.id)
                      }
                      disabled={processing}
                      className="btn"
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        fontSize: '0.85rem',
                        background:
                          'rgba(169, 35, 35, 0.1)',
                        color: '#a92323',
                        border:
                          '1px solid rgba(169, 35, 35, 0.3)',
                        borderRadius: 8,
                        cursor: processing
                          ? 'not-allowed'
                          : 'pointer',
                        fontWeight: 600,
                        opacity: processing ? 0.6 : 1,
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {reviewedRequests.length > 0 && (
        <div>
          <h3
            style={{
              color: 'var(--navy)',
              margin: '0 0 16px',
            }}
          >
            Review History ({reviewedRequests.length})
          </h3>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Position</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {reviewedRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.full_name}</td>
                  <td>{request.email}</td>
                  <td>{request.requested_role}</td>

                  <td>
                    <span
                      className="status-pill"
                      style={{
                        background:
                          request.status === 'approved'
                            ? '#d4edda'
                            : '#f8d7da',
                        color:
                          request.status === 'approved'
                            ? '#155724'
                            : '#856404',
                      }}
                    >
                      {request.status}
                    </span>
                  </td>

                  <td>
                    {request.reviewed_at
                      ? new Date(
                          request.reviewed_at
                        ).toLocaleDateString()
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
