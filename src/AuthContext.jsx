import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined)
  const [adminProfile, setAdminProfile] = useState(null)
  const [signupRequest, setSignupRequest] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase) {
      setError('Supabase not initialized - missing environment variables')
      setSession(null)
      return
    }

    let mounted = true

    async function initializeAuth() {
      try {
        const { data, error: sessionError } =
          await supabase.auth.getSession()

        if (sessionError) throw sessionError

        if (!mounted) return

        setSession(data.session)

        if (data.session?.user) {
          await loadAdminProfile(data.session.user.id)
        }
      } catch (err) {
        console.error('Auth initialization error:', err)

        if (mounted) {
          setError(err.message)
          setSession(null)
          setAdminProfile(null)
          setSignupRequest(null)
        }
      }
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!mounted) return

      setSession(nextSession)

      if (nextSession?.user) {
        await loadAdminProfile(nextSession.user.id)
      } else {
        setAdminProfile(null)
        setSignupRequest(null)
      }
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  async function loadAdminProfile(userId) {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (profileError) {
        console.error('Admin profile error:', profileError)
      }

      setAdminProfile(profile || null)

      const { data: request, error: requestError } = await supabase
        .from('admin_signup_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (requestError) {
        console.error('Signup request error:', requestError)
      }

      setSignupRequest(request || null)
    } catch (err) {
      console.error('Error loading admin access:', err)
      setAdminProfile(null)
      setSignupRequest(null)
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
