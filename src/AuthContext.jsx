import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function initializeAuth() {
      const { data, error } = await supabase.auth.getSession()

      if (!mounted) return

      if (error) {
        console.error('Supabase session initialization failed:', error)
        setSession(null)
      } else {
        setSession(data?.session ?? null)
      }

      setAuthLoading(false)
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return

      setSession(nextSession ?? null)
      setAuthLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    session,
    authLoading,
    isAuthenticated: Boolean(session),
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }

  return context
      }          setAdminProfile(null)
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
