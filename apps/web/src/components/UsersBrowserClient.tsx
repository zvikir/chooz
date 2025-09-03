'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type UserRow = {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  gender: string
  photo_url: string
  tags: string[]
}

type TagRow = { name: string; slug: string }

export default function UsersBrowserClient({ initialUsers, tags }: { initialUsers: UserRow[]; tags: TagRow[] }) {
  // State
  const [selectedTagSlugs, setSelectedTagSlugs] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<UserRow[]>(initialUsers)
  const [loading, setLoading] = useState(false)

  // Build query string
  const buildQuery = useCallback((tagSlugs: string[], q: string) => {
    const params = new URLSearchParams()
    if (tagSlugs.length) params.set('tags', tagSlugs.join(','))
    if (q) params.set('q', q)
    const qs = params.toString()
    return qs ? `?${qs}` : ''
  }, [])

  // Fetch users with server filters, then apply client-side assertion filter for determinism
  const fetchUsers = useCallback(async (tagSlugs: string[], q: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/users${buildQuery(tagSlugs, q)}`)
      const data = (await res.json()) as UserRow[]
      const normalized = (q || '').toLowerCase()
      const strictlyFiltered = normalized
        ? data.filter(u =>
            u.username.toLowerCase().includes(normalized) ||
            (u.display_name || '').toLowerCase().includes(normalized) ||
            (u.bio || '').toLowerCase().includes(normalized) ||
            u.tags.some(t => t.toLowerCase().includes(normalized))
          )
        : data
      setUsers(strictlyFiltered)
    } finally {
      setLoading(false)
    }
  }, [buildQuery])

  // Handlers
  const onToggleTag = (slug: string) => {
    setSelectedTagSlugs(prev => {
      const next = prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
      // Fire fetch with new state
      fetchUsers(next, searchQuery)
      return next
    })
  }

  const onChangeSearch = (value: string) => {
    setSearchQuery(value)
    fetchUsers(selectedTagSlugs, value)
  }

  // UI — Steam-like toolbar and grid
  return (
    <div className="space-y-6">
      <div
        className="rounded-lg border border-border bg-[var(--color-surface)] p-3 shadow-card"
        data-testid="users-toolbar"
      >
        <div className="flex flex-wrap items-center gap-2">
          <input
            data-testid="users-search"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => onChangeSearch(e.target.value)}
            className="min-w-56 flex-1 rounded-md border border-border bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary/30"
          />
          {tags.map(t => (
            <label key={t.slug} data-testid={`filter-tag-${t.slug}`} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface)]">
              <input
                type="checkbox"
                className="accent-primary"
                checked={selectedTagSlugs.includes(t.slug)}
                onChange={() => onToggleTag(t.slug)}
              />
              <span>{t.name}</span>
            </label>
          ))}
        </div>
      </div>

      {loading ? (
        <ul className="grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2 xl:grid-cols-3" data-testid="users-loading">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="rounded-lg border border-border bg-[var(--color-surface)] p-3 shadow-card">
              <div className="h-40 w-full animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
              <div className="mt-3 space-y-2">
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
        <p className="text-sm text-muted" data-testid="users-empty">No users match the selected filters.</p>
      ) : (
        <ul className="grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2 xl:grid-cols-3" data-testid="users-list">
          {users.map(u => (
            <li key={u.id} data-testid="user-card" className="group rounded-lg border border-border bg-[var(--color-surface)] p-3 shadow-card transition hover:shadow-[0_0_0_6px_rgba(124,92,255,0.12)]">
              <div className="overflow-hidden rounded-md">
                <img src={u.photo_url} alt={u.username} className="h-40 w-full rounded-md object-cover transition-transform duration-200 group-hover:scale-[1.02]" />
              </div>
              <div className="mt-3">
                <div className="font-semibold text-[var(--color-text)]">{u.display_name || u.username} <span className="font-normal text-muted">({u.gender})</span></div>
                {u.bio && <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{u.bio}</div>}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {u.tags.map(t => (
                    <span key={t} data-testid="user-tag" className="rounded-full border border-border px-2 py-0.5 text-xs text-[var(--color-text)]">{t}</span>
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
