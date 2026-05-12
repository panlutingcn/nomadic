'use client'
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: User | null
  loading: boolean
  profileNickname: string | null
  profileAvatarUrl: string | null
  sendEmailOTP: (email: string, redirectTo?: string) => Promise<{ error: string | null }>
  loginWithEmail: (email: string, password: string, nickname?: string) => Promise<{ error: string | null; needsConfirmation?: boolean }>
  loginWithGoogle: (redirectPath?: string) => void
  loginWithWeChat: (redirectPath?: string) => void
  resetPassword: (email: string) => Promise<{ error: string | null }>
  updateProfile: (fields: { nickname?: string; avatarUrl?: string }) => Promise<{ error: string | null }>
  updateEmail: (newEmail: string) => Promise<{ error: string | null }>
  deleteAccount: () => Promise<{ error: string | null }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileNickname, setProfileNickname] = useState<string | null>(null)
  const [profileAvatarUrl, setProfileAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      if (event === 'SIGNED_OUT') {
        setProfileNickname(null)
        setProfileAvatarUrl(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return
    const fallback =
      (user.user_metadata?.full_name as string | undefined) ??
      user.email?.split('@')[0] ??
      '探索者'
    ;(async () => {
      try {
        const { data } = await supabase.from('profiles').select('nickname, avatar_url').eq('id', user.id).single()
        setProfileNickname(
          data?.nickname ??
          (user.user_metadata?.nickname as string | undefined) ??
          fallback
        )
        setProfileAvatarUrl(data?.avatar_url ?? null)
      } catch {
        setProfileNickname(fallback)
        setProfileAvatarUrl(null)
      }
    })()
  }, [user?.id])

  // Migrate guest persona to user-scoped key on login (covers OAuth redirect flow)
  useEffect(() => {
    if (!user) return
    const guestKey = 'nomadic_persona'
    const userKey = `nomadic_persona_${user.id}`
    const guestPersona = localStorage.getItem(guestKey)
    const userPersona = localStorage.getItem(userKey)
    if (guestPersona && !userPersona) {
      localStorage.setItem(userKey, guestPersona)
      localStorage.removeItem(guestKey)
    }
  }, [user?.id])

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
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? window.location.origin
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nickname },
          emailRedirectTo: `${window.location.origin}/`,
        },
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

  const loginWithGoogle = useCallback((redirectPath = '/') => {
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

  const resetPassword = useCallback(async (email: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? window.location.origin
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/auth/reset-password`,
    })
    return { error: error?.message ?? null }
  }, [])

  const updateProfile = useCallback(async (fields: { nickname?: string; avatarUrl?: string }) => {
    if (!user) return { error: 'Not logged in' }
    const upsertData: Record<string, unknown> = { id: user.id }
    if (fields.nickname !== undefined) upsertData.nickname = fields.nickname
    if (fields.avatarUrl !== undefined) upsertData.avatar_url = fields.avatarUrl
    const { error } = await supabase.from('profiles').upsert(upsertData, { onConflict: 'id' })
    if (!error) {
      if (fields.nickname !== undefined) setProfileNickname(fields.nickname)
      if (fields.avatarUrl !== undefined) setProfileAvatarUrl(fields.avatarUrl)
    }
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
      profileNickname, profileAvatarUrl,
      sendEmailOTP, loginWithEmail, loginWithGoogle, loginWithWeChat,
      resetPassword, updateProfile, updateEmail, deleteAccount, logout,
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
