import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient.js'
import AdminLayout from '../../components/AdminLayout.jsx'
import { useAuth } from '../../AuthContext.jsx'
import { Navigate } from 'react-router-dom'

export default function AdminSignupRequests() {
  const { adminProfile } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [rejectionReasons, setRejectionReasons] = useState({})
  const [error, setError] = useState(null)

  // Only super admins can access this page
  if (adminProfile && adminProfile.role !== 'super_admin') {
    return <Navigate to="/admin" replace />
  }

  async function loadRequests() {
    try {
      const { data, error: err } = await supabase
        .from('admin_signup_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err
      setRequests(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  async function handleApprove(requestId, userId, email, fullName, role) {
    try {
      // Update signup request
      const { error: updateError } = await supabase
        .from('admin_signup_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: supabase.auth.getUser().then(({ data }) => data.user?.id),
        })
        .eq('user_id', userId)

      if (updateError) throw updateError

      // Create or update admin profile
      const { error: profileError } = await supabase
        .from('admin_profiles')
        .upsert({
          id: userId,
          email,
          full_name: fullName,
          role,
        })

      if (profileError) throw profileError

      // Reload requests
      await loadRequests()
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleReject(userId, reason = '') {
    try {
      const { error: rejectError } = await supabase
        .from('admin_signup_requests')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          reviewed_at: new Date().toISOString(),
          reviewed_by: supabase.auth.getUser().then(({ data }) => data.user?.id),
        })
        .eq('user_id', userId)

      if (rejectError) throw rejectError

      // Reload requests
      await loadRequests()
      setRejectionReasons(prev => ({ ...prev, [userId]: '' }))
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const pendingRequests = requests.filter(r => r.status === 'pending')
  const reviewedRequests = requests.filter(r => r.status !== 'pending')

  return (
    <AdminLayout>
      <h2 style={{ color: 'var(--navy)' }}>Admin Signup Requests</h2>

      {error && (
        <div style={{
          background: '#fde8e8',
          color: '#a92323',
          padding: 12,
          borderRadius: 12,
          marginBottom: 20
        }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: 28 }}>
        <h3 style={{ color: 'var(--navy)', margin: '0 0 16px' }}>
          Pending Requests ({pendingRequests.length})
        </h3>

        {loading ? (
          <div>Loading...</div>
        ) : pendingRequests.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'var(--text-soft)'
          }}>
            No pending requests
          </div>
        ) : (
          <div className="grid grid-2">
            {pendingRequests.map(req => (
              <div key={req.id} className="card" style={{ padding: 20 }}>
                <h4 style={{ margin: '0 0 8px', color: 'var(--navy)' }}>{req.full_name}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-soft)', marginBottom: 12 }}>
                  <div><strong>Email:</strong> {req.email}</div>
                  <div><strong>Requested Position:</strong> {req.requested_role}</div>
                  <div><strong>Date:</strong> {new Date(req.created_at).toLocaleDateString()}</div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: 4, color: 'var(--text-soft)' }}>
                    Rejection reason (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Leave empty to approve without comment"
                    value={rejectionReasons[req.user_id] || ''}
                    onChange={(e) => setRejectionReasons(prev => ({
                      ...prev,
                      [req.user_id]: e.target.value
                    }))}
                    style={{
                      width: '100%',
                      fontSize: '0.85rem',
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: 'none',
                      background: 'var(--bg)',
                      boxShadow: 'inset 2px 2px 6px var(--shadow-dark), inset -2px -2px 6px var(--shadow-light)',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleApprove(req.id, req.user_id, req.email, req.full_name, req.requested_role)}
                    className="btn"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      fontSize: '0.85rem',
                      background: 'var(--gradient-accent)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(req.user_id, rejectionReasons[req.user_id] || '')}
                    className="btn"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      fontSize: '0.85rem',
                      background: 'rgba(169, 35, 35, 0.1)',
                      color: '#a92323',
                      border: '1px solid rgba(169, 35, 35, 0.3)',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {reviewedRequests.length > 0 && (
        <div>
          <h3 style={{ color: 'var(--navy)', margin: '0 0 16px' }}>
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
              {reviewedRequests.map(req => (
                <tr key={req.id}>
                  <td>{req.full_name}</td>
                  <td>{req.email}</td>
                  <td>{req.requested_role}</td>
                  <td>
                    <span className="status-pill" style={{
                      background: req.status === 'approved' ? '#d4edda' : '#f8d7da',
                      color: req.status === 'approved' ? '#155724' : '#856404'
                    }}>
                      {req.status}
                    </span>
                  </td>
                  <td>{new Date(req.reviewed_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
