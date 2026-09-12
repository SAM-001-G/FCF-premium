import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined) // undefined = loading
  const [adminProfile, setAdminProfile] = useState(null)
  const [signupRequest, setSignupRequest] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase) {
      setError('Supabase not initialized - missing environment variables')
      return
    }

    try {
      supabase.auth.getSession()
        .then(({ data }) => {
          setSession(data.session)
          if (data.session?.user) {
            loadAdminProfile(data.session.user.id)
          }
        })
        .catch((err) => {
          console.error('Auth initialization error:', err)
          setError(err.message)
          setSession(null)
        })

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        if (session?.user) {
          loadAdminProfile(session.user.id)
        } else {
          setAdminProfile(null)
          setSignupRequest(null)
        }
      })
      return () => listener?.subscription?.unsubscribe()
    } catch (err) {
      console.error('Auth setup error:', err)
      setError(err.message)
      setSession(null)
    }
  }, [])

  async function loadAdminProfile(userId) {
    try {
      // Load admin profile
      const { data: profile } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      setAdminProfile(profile || null)

      // Load signup request status
      const { data: request } = await supabase
        .from('admin_signup_requests')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      setSignupRequest(request || null)
    } catch (err) {
      console.error('Error loading admin profile:', err)
    }
  }

  return (
    <AuthContext.Provider value={{ session, error, adminProfile, signupRequest }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
