"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { AuthUser } from './auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .catch(() => {
        // Ignore errors - user is not logged in
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const login = (user: AuthUser) => {
    setUser(user)
  }

  const logout = () => {
    setUser(null)
    fetch('/api/auth/logout', { method: 'POST' })
      .then(() => {
        window.location.href = '/'
      })
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

