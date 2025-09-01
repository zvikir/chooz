'use client'

import { useState } from 'react'

type UserRow = { id: string; username: string; display_name: string | null; bio: string | null; gender: string; photo_url: string; tags: string[] }
type TagRow = { name: string; slug: string }

export default function UsersBrowserClient({ initialUsers, tags }: { initialUsers: UserRow[]; tags: TagRow[] }) {
  const [selected, setSelected] = useState<string[]>([])
  const [users, setUsers] = useState<UserRow[]>(initialUsers)
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)

  async function refetch(nextSelected: string[], nextQ: string) {
    const qParam = nextQ ? `&q=${encodeURIComponent(nextQ)}` : ''
    const tagParam = nextSelected.length ? `?tags=${encodeURIComponent(nextSelected.join(','))}` : '?'
    const sep = tagParam.endsWith('?') ? '' : ''
    setLoading(true)
    try {
      const res = await fetch(`/api/users${tagParam}${qParam}`)
      const data = await res.json()
      setUsers(data)
    } finally {
      setLoading(false)
    }
  }

  async function toggle(slug: string) {
    const next = selected.includes(slug) ? selected.filter(s => s !== slug) : [...selected, slug]
    setSelected(next)
    refetch(next, q)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          placeholder="Search users..."
          value={q}
          onChange={(e) => { const v = e.target.value; setQ(v); refetch(selected, v) }}
          className="min-w-56 rounded-md border border-border px-3 py-2 text-sm bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400"
        />
        {tags.map(t => (
          <label key={t.slug} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm hover:bg-slate-50">
            <input type="checkbox" className="accent-primary" checked={selected.includes(t.slug)} onChange={() => toggle(t.slug)} />
            <span>{t.name}</span>
          </label>
        ))}
      </div>
      {loading ? (
        <ul className="grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="grid grid-cols-[64px_1fr] items-start gap-3 rounded-lg border border-border p-3 shadow-card">
              <div className="h-16 w-16 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-56 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="flex gap-2">
                  <div className="h-6 w-12 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="h-6 w-12 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : users.length === 0 ? (
        <p className="text-sm text-muted">No users match the selected filters.</p>
      ) : (
        <ul className="grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2 xl:grid-cols-3">
          {users.map(u => (
            <li key={u.id} className="rounded-lg border border-border p-3 shadow-card transition hover:shadow-md">
              <img src={u.photo_url} alt={u.username} className="h-40 w-full rounded-md object-cover" />
              <div className="mt-3">
                <div className="font-semibold">{u.display_name || u.username} <span className="font-normal text-muted">({u.gender})</span></div>
                {u.bio && <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{u.bio}</div>}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {u.tags.map(t => (
                    <span key={t} className="rounded-full border border-border px-2 py-0.5 text-xs">{t}</span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


