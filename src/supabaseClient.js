import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/*
 * FCF authentication storage
 *
 * Remember me = localStorage
 * Normal session = sessionStorage
 *
 * The preference is stored separately so Supabase knows
 * which storage should contain the authentication session.
 */
const rememberMeStorage = {
  getItem(key) {
    const remember =
      localStorage.getItem('fcf_admin_remember') === 'true'

    return (remember ? localStorage : sessionStorage).getItem(key)
  },

  setItem(key, value) {
    const remember =
      localStorage.getItem('fcf_admin_remember') === 'true'

    if (remember) {
      localStorage.setItem(key, value)
      sessionStorage.removeItem(key)
    } else {
      sessionStorage.setItem(key, value)
      localStorage.removeItem(key)
    }
  },

  removeItem(key) {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  },
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: rememberMeStorage,
    },
  }
)
