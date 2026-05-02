'use client'
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: User | null
  loading: boolean
  sendEmailOTP: (email: string, redirectTo?: string) => Promise<{ error: string | null }>
  loginWithEmail: (email: string, password: string, nickname?: string) => Promise<{ error: string | null; needsConfirmation?: boolean }>
  loginWithGoogle: (redirectPath?: string) => void
  loginWithWeChat: (redirectPath?: string) => void
  updateProfile: (fields: { nickname?: string; avatarUrl?: string }) => Promise<{ error: string | null }>
  updateEmail: (newEmail: string) => Promise<{ error: string | null }>
  deleteAccount: () => Promise<{ error: string | null }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const sendEmailOTP = useCallback(async (email: string, redirectTo?: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo ?? `${window.location.origin}/` },
    })
    return { error: error?.message ?? null }
  }, [])

  const loginWithEmail = useCallback(async (email: string, password: string, nickname?: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) return { error: null }
    if (error.code === 'email_not_confirmed') return { error: null, needsConfirmation: true }
    if (error.code === 'invalid_credentials') {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nickname } },
      })
      if (signUpError) return { error: signUpError.message }
      if (data.user && window.location.hostname !== 'localhost') {
        await supabase.from('profiles').insert({
          id: data.user.id,
          nickname: nickname || 'Nomadic 用户',
        })
      }
      return { error: null, needsConfirmation: true }
    }
    return { error: error.message }
  }, [])

  const loginWithGoogle = useCallback((redirectPath = '/vault') => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${redirectPath}`,
        queryParams: { prompt: 'select_account' },
      },
    })
  }, [])

  const loginWithWeChat = useCallback((redirectPath = '/') => {
    window.location.href = `/api/auth/wechat?redirect=${encodeURIComponent(redirectPath)}`
  }, [])

  const updateProfile = useCallback(async (fields: { nickname?: string; avatarUrl?: string }) => {
    if (!user) return { error: 'Not logged in' }
    const update: Record<string, string> = {}
    if (fields.nickname !== undefined) update.nickname = fields.nickname
    if (fields.avatarUrl !== undefined) update.avatar_url = fields.avatarUrl
    const { error } = await supabase.from('profiles').update(update).eq('id', user.id)
    return { error: error?.message ?? null }
  }, [user])

  const updateEmail = useCallback(async (newEmail: string) => {
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    return { error: error?.message ?? null }
  }, [])

  const deleteAccount = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return { error: 'Not logged in' }
    const res = await fetch('/api/auth/delete-account', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      return { error: (data as { error?: string }).error ?? 'Delete failed' }
    }
    await supabase.auth.signOut()
    return { error: null }
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  return (
    <AuthContext.Provider value={{
      user, loading,
      sendEmailOTP, loginWithEmail, loginWithGoogle, loginWithWeChat,
      updateProfile, updateEmail, deleteAccount, logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
