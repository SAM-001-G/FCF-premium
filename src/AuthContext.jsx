import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined)
  const [adminProfile, setAdminProfile] = useState(undefined)
  const [signupRequest, setSignupRequest] = useState(undefined)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    async function resolveSession(nextSession) {
      if (!mounted) return

      // No session = definitely logged out.
      if (!nextSession) {
        setAdminProfile(null)
        setSignupRequest(null)
        setSession(null)
        return
      }

      try {
        const { profile, request } =
          await loadAdminAccess(nextSession.user.id)

        if (!mounted) return

        setAdminProfile(profile)
        setSignupRequest(request)

        // Only expose the session after admin access
        // has finished loading.
        setSession(nextSession)
      } catch (err) {
        console.error('Admin access resolution error:', err)

        if (!mounted) return

        setError(err.message || 'Unable to verify administrator access.')
        setAdminProfile(null)
        setSignupRequest(null)
        setSession(nextSession)
      }
    }

    async function initializeAuth() {
      try {
        const {
          data,
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          throw sessionError
        }

        await resolveSession(data.session)
      } catch (err) {
        console.error('Auth initialization error:', err)

        if (!mounted) return

        setError(err.message || 'Authentication initialization failed.')
        setSession(null)
        setAdminProfile(null)
        setSignupRequest(null)
      }
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, nextSession) => {
        if (!mounted) return

        /*
         * Don't perform database queries directly inside the
         * auth callback. Queue the work after Supabase finishes
         * processing the auth event.
         */
        setTimeout(() => {
          if (mounted) {
            resolveSession(nextSession)
          }
        }, 0)
      }
    )

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  async function loadAdminAccess(userId) {
    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (profileError) {
      console.error('Admin profile error:', profileError)
    }

    const {
      data: request,
      error: requestError,
    } = await supabase
      .from('admin_signup_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', {
        ascending: false,
      })
      .limit(1)
      .maybeSingle()

    if (requestError) {
      console.error('Signup request error:', requestError)
    }

    return {
      profile: profile || null,
      request: request || null,
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        error,
        adminProfile,
        signupRequest,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
