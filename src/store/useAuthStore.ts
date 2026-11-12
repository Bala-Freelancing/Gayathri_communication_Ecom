import { create } from 'zustand'
import { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// SECURITY: admin access is granted ONLY by a real Supabase Auth session whose
// user id is present in public.admin_users. There are no hardcoded credentials
// and no localStorage-based "demo" sessions; anything in the browser bundle or
// localStorage can be read or forged by any visitor.

interface AuthState {
  user: User | null
  session: Session | null
  isAdmin: boolean
  isLoading: boolean
  error: string | null
  initAuth: () => Promise<void>
  login: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>
  logout: () => Promise<void>
  clearError: () => void
}

let initPromise: Promise<void> | null = null
let authListenerAttached = false

async function checkIsAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('id, role')
    .eq('id', userId)
    .maybeSingle()
  if (error || !data) return false
  return data.role === 'admin' || data.role === 'super_admin'
}

// Remove leftovers from the old insecure demo login.
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('gc_demo_admin_session')
    localStorage.removeItem('gc_admin_email')
  } catch {
    /* storage unavailable */
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isAdmin: false,
  isLoading: true,
  error: null,

  initAuth: () => {
    // Run once per page load; repeated calls (ProtectedRoute, AdminLogin) reuse it.
    if (initPromise) return initPromise
    initPromise = (async () => {
      if (!isSupabaseConfigured()) {
        set({ user: null, session: null, isAdmin: false, isLoading: false })
        return
      }
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const isAdmin = await checkIsAdmin(session.user.id)
          set({ user: session.user, session, isAdmin, isLoading: false })
        } else {
          set({ user: null, session: null, isAdmin: false, isLoading: false })
        }

        if (!authListenerAttached) {
          authListenerAttached = true
          supabase.auth.onAuthStateChange((_event, newSession) => {
            // Defer DB work out of the auth callback (supabase-js recommendation).
            setTimeout(async () => {
              if (newSession?.user) {
                const isAdmin = await checkIsAdmin(newSession.user.id)
                set({ user: newSession.user, session: newSession, isAdmin, isLoading: false })
              } else {
                set({ user: null, session: null, isAdmin: false, isLoading: false })
              }
            }, 0)
          })
        }
      } catch (err: any) {
        set({
          user: null,
          session: null,
          isAdmin: false,
          isLoading: false,
          error: err?.message || 'Authentication initialization error',
        })
      }
    })()
    return initPromise
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })

    if (!isSupabaseConfigured()) {
      const errorMsg = 'Admin login is unavailable: the database is not configured.'
      set({ isLoading: false, error: errorMsg })
      return { success: false, error: errorMsg }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (error || !data.user) {
        const errorMsg = 'Invalid email or password.'
        set({ isLoading: false, error: errorMsg })
        return { success: false, error: errorMsg }
      }

      const isAdmin = await checkIsAdmin(data.user.id)
      if (!isAdmin) {
        await supabase.auth.signOut()
        const errorMsg = 'Access denied: this account is not an administrator.'
        set({ user: null, session: null, isAdmin: false, isLoading: false, error: errorMsg })
        return { success: false, error: errorMsg }
      }

      set({ user: data.user, session: data.session, isAdmin: true, isLoading: false, error: null })
      return { success: true, error: null }
    } catch (err: any) {
      const errorMsg = err?.message || 'Login failed unexpectedly.'
      set({ isLoading: false, error: errorMsg })
      return { success: false, error: errorMsg }
    }
  },

  logout: async () => {
    set({ isLoading: true })
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut()
      } catch (err) {
        console.error('Logout error:', err)
      }
    }
    set({ user: null, session: null, isAdmin: false, isLoading: false, error: null })
  },

  clearError: () => set({ error: null }),
}))
