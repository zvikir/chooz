'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, display_name: displayName, password })
    })
    setLoading(false)
    if (res.ok) {
      router.push('/login')
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Signup failed')
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: '40px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>Sign up</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Email</span>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }} />
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Username</span>
          <input value={username} onChange={e => setUsername(e.target.value)} required style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }} />
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Display name (optional)</span>
          <input value={displayName} onChange={e => setDisplayName(e.target.value)} style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }} />
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Password</span>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }} />
        </label>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
        <button disabled={loading} type="submit" style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8 }}>{loading ? 'Creating account...' : 'Create account'}</button>
      </form>
    </main>
  )
}


