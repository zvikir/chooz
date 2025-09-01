'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [tags, setTags] = useState<Array<{ name: string; slug: string }>>([])
  const [selected, setSelected] = useState<string[]>([])
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    fetch('/api/tags').then(r => r.json()).then(setTags).catch(() => setTags([]))
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, display_name: displayName, password, tag_slugs: selected, gender })
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
    <main className="mx-auto max-w-md px-4 py-8">
      <h1 className="mb-3 text-2xl font-semibold">Sign up</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="radio" name="gender" value="male" checked={gender==='male'} onChange={() => setGender('male')} required className="accent-primary" />
            Male
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="radio" name="gender" value="female" checked={gender==='female'} onChange={() => setGender('female')} required className="accent-primary" />
            Female
          </label>
        </div>
        <label className="grid gap-1.5 text-sm">
          <span>Email</span>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="rounded-md border border-border px-3 py-2 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400" />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span>Username</span>
          <input value={username} onChange={e => setUsername(e.target.value)} required className="rounded-md border border-border px-3 py-2 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400" />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span>Display name (optional)</span>
          <input value={displayName} onChange={e => setDisplayName(e.target.value)} className="rounded-md border border-border px-3 py-2 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400" />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span>Password</span>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required className="rounded-md border border-border px-3 py-2 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400" />
        </label>
        <div>
          <div className="mb-1.5 text-sm">Pick at least 2 tags</div>
          <div className="flex flex-wrap gap-2">
            {tags.map(t => (
              <label key={t.slug} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm">
                <input
                  type="checkbox"
                  className="accent-primary"
                  checked={selected.includes(t.slug)}
                  onChange={() => setSelected(prev => prev.includes(t.slug) ? prev.filter(s => s !== t.slug) : [...prev, t.slug])}
                />
                <span>{t.name}</span>
              </label>
            ))}
          </div>
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button disabled={loading} type="submit" className="rounded-md border border-border px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-60">{loading ? 'Creating account...' : 'Create account'}</button>
      </form>
    </main>
  )
}
