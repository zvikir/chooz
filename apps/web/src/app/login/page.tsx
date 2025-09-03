'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('alice@example.com')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    setLoading(false)
    if (res.ok) router.push('/')
    else setError('Invalid credentials')
  }

  return (
    <main className="mx-auto max-w-md px-4 py-8">
      <h1 className="mb-3 text-2xl font-semibold">Login</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="grid gap-1.5 text-sm">
          <span>Email</span>
          <input data-testid="login-email" value={email} onChange={e => setEmail(e.target.value)} type="email" required className="rounded-md border border-border px-3 py-2 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400" />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span>Password</span>
          <input data-testid="login-password" value={password} onChange={e => setPassword(e.target.value)} type="password" required className="rounded-md border border-border px-3 py-2 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400" />
        </label>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button data-testid="login-submit" disabled={loading} type="submit" className="rounded-md border border-border px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-60">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}
