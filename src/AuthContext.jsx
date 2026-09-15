import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined)
  const [adminProfile, setAdminProfile] = useState(undefined)
  const [signupRequest, setSignupRequest] = useState(null)
  const [error, setError] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [adminLoading, setAdminLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    let requestId = 0

    async function loadAdminAccess(userId) {
      const currentRequest = ++requestId

      try {
        const { data: profile, error: profileError } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()

        if (profileError) throw profileError

        const { data: request, error: requestError } = await supabase
          .from('admin_signup_requests')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (requestError) throw requestError

        if (!mounted || currentRequest !== requestId) return

        setAdminProfile(profile || null)
        setSignupRequest(request || null)
        setError(null)
      } catch (err) {
        console.error('Error loading admin access:', err)

        if (!mounted || currentRequest !== requestId) return

        setAdminProfile(null)
        setSignupRequest(null)
        setError(err?.message || 'Unable to verify administrator access.')
      } finally {
        if (mounted && currentRequest === requestId) {
          setAdminLoading(false)
        }
      }
    }

    async function initializeAuth() {
      try {
        const { data, error: sessionError } =
          await supabase.auth.getSession()

        if (sessionError) throw sessionError
        if (!mounted) return

        setSession(data.session || null)
        setAuthLoading(false)

        if (data.session?.user) {
          setAdminLoading(true)
          await loadAdminAccess(data.session.user.id)
        } else {
          setAdminProfile(null)
          setSignupRequest(null)
          setAdminLoading(false)
        }
      } catch (err) {
        console.error('Auth initialization error:', err)

        if (!mounted) return

        setError(
          err?.message || 'Authentication initialization failed.'
        )
        setSession(null)
        setAdminProfile(null)
        setSignupRequest(null)
        setAdminLoading(false)
        setAuthLoading(false)
      }
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!mounted) return

      setSession(nextSession || null)
      setAuthLoading(false)

      if (!nextSession?.user) {
        requestId += 1
        setAdminProfile(null)
        setSignupRequest(null)
        setAdminLoading(false)
        setError(null)
        return
      }

      setAdminLoading(true)

      // Defer database access until Supabase finishes
      // processing the authentication event.
      setTimeout(() => {
        if (mounted) {
          loadAdminAccess(nextSession.user.id)
        }
      }, 0)
    })

    return () => {
      mounted = false
      requestId += 1
      subscription?.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        session,
        error,
        adminProfile,
        signupRequest,
        authLoading,
        adminLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}