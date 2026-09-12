import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined) // undefined = loading
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase) {
      setError('Supabase not initialized - missing environment variables')
      return
    }

    try {
      supabase.auth.getSession()
        .then(({ data }) => setSession(data.session))
        .catch((err) => {
          console.error('Auth initialization error:', err)
          setError(err.message)
          setSession(null) // Fallback to logged out state
        })

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })
      return () => listener?.subscription?.unsubscribe()
    } catch (err) {
      console.error('Auth setup error:', err)
      setError(err.message)
      setSession(null)
    }
  }, [])

  return <AuthContext.Provider value={{ session, error }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
