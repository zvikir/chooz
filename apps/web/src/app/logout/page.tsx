"use client";

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    async function logout() {
      await fetch('/api/auth/logout', { method: 'POST' })
      // Force full reload to clear any cached auth state
      window.location.href = '/'
    }
    logout()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Signing out...</p>
      </div>
    </div>
  )
}

