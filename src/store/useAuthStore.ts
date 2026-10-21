import { create } from 'zustand'
import { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isAdmin: false,
  isLoading: true,
  error: null,

  initAuth: async () => {
    set({ isLoading: true, error: null })

    if (!isSupabaseConfigured()) {
      // Check for local demo session if Supabase credentials are not configured yet
      const demoSession = localStorage.getItem('gc_demo_admin_session')
      if (demoSession === 'true') {
        set({
          user: {
            id: 'demo-admin-id',
            email: 'admin@gayathricommunication.com',
            app_metadata: {},
            user_metadata: { name: 'Showroom Admin' },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          } as User,
          session: null,
          isAdmin: true,
          isLoading: false,
        })
        return
      }

      set({ user: null, session: null, isAdmin: false, isLoading: false })
      return
    }

    try {
      // 1. Get initial session from Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        set({ user: null, session: null, isAdmin: false, isLoading: false })
        return
      }

      if (session?.user) {
        // 2. Verify admin permissions against public.admin_users table
        const { data: adminRecord } = await supabase
          .from('admin_users')
          .select('id, role')
          .eq('id', session.user.id)
          .single()

        const isUserAdmin = Boolean(adminRecord && (adminRecord.role === 'admin' || adminRecord.role === 'super_admin'))

        set({
          user: session.user,
          session,
          isAdmin: isUserAdmin,
          isLoading: false,
        })
      } else {
        set({ user: null, session: null, isAdmin: false, isLoading: false })
      }

      // 3. Listen to auth state changes
      supabase.auth.onAuthStateChange(async (_event, newSession) => {
        if (newSession?.user) {
          const { data: adminRecord } = await supabase
            .from('admin_users')
            .select('id, role')
            .eq('id', newSession.user.id)
            .single()

          const isUserAdmin = Boolean(adminRecord && (adminRecord.role === 'admin' || adminRecord.role === 'super_admin'))

          set({
            user: newSession.user,
            session: newSession,
            isAdmin: isUserAdmin,
            isLoading: false,
          })
        } else {
          set({ user: null, session: null, isAdmin: false, isLoading: false })
        }
      })
    } catch (err: any) {
      set({
        user: null,
        session: null,
        isAdmin: false,
        isLoading: false,
        error: err?.message || 'Authentication initialization error',
      })
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })

    // If Supabase is not configured yet, support documented local admin demo credentials
    if (!isSupabaseConfigured()) {
      if (email.trim().toLowerCase() === 'admin@gayathricommunication.com' && password === 'Gayathri@2026') {
        localStorage.setItem('gc_demo_admin_session', 'true')
        set({
          user: {
            id: 'demo-admin-id',
            email: 'admin@gayathricommunication.com',
            app_metadata: {},
            user_metadata: { name: 'Showroom Admin' },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          } as User,
          session: null,
          isAdmin: true,
          isLoading: false,
          error: null,
        })
        return { success: true, error: null }
      } else {
        const errorMsg = 'Invalid credentials. Demo login: admin@gayathricommunication.com / Gayathri@2026'
        set({ isLoading: false, error: errorMsg })
        return { success: false, error: errorMsg }
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        set({ isLoading: false, error: error.message })
        return { success: false, error: error.message }
      }

      if (!data.user) {
        const errorMsg = 'No user returned from authentication service.'
        set({ isLoading: false, error: errorMsg })
        return { success: false, error: errorMsg }
      }

      // Check admin status in admin_users table
      const { data: adminRecord, error: adminCheckError } = await supabase
        .from('admin_users')
        .select('id, role')
        .eq('id', data.user.id)
        .single()

      if (adminCheckError || !adminRecord) {
        // User is authenticated in Supabase but not authorized in admin_users table
        await supabase.auth.signOut()
        const errorMsg = 'Access denied: Your account is not authorized as an administrator.'
        set({ user: null, session: null, isAdmin: false, isLoading: false, error: errorMsg })
        return { success: false, error: errorMsg }
      }

      set({
        user: data.user,
        session: data.session,
        isAdmin: true,
        isLoading: false,
        error: null,
      })
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
    localStorage.removeItem('gc_demo_admin_session')
    set({ user: null, session: null, isAdmin: false, isLoading: false, error: null })
  },

  clearError: () => set({ error: null }),
}))
