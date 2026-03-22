'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { type User, getSession, signOut as authSignOut, incrementGenerations, canGenerate } from './auth'

interface AuthContextValue {
  user: User | null
  loading: boolean
  setUser: (u: User | null) => void
  logout: () => void
  trackGeneration: () => boolean  // returns false if limit hit
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: () => {},
  trackGeneration: () => true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]     = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(getSession())
    setLoading(false)
  }, [])

  const logout = useCallback(() => {
    authSignOut()
    setUser(null)
  }, [])

  const trackGeneration = useCallback((): boolean => {
    if (!user) return false
    if (!canGenerate(user)) return false
    const updated = incrementGenerations(user)
    setUser(updated)
    return true
  }, [user])

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout, trackGeneration }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
