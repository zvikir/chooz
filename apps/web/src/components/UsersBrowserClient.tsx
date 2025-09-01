'use client'

import { useState } from 'react'

type UserRow = { id: string; username: string; display_name: string | null; bio: string | null; tags: string[] }
type TagRow = { name: string; slug: string }

export default function UsersBrowserClient({ initialUsers, tags }: { initialUsers: UserRow[]; tags: TagRow[] }) {
  const [selected, setSelected] = useState<string[]>([])
  const [users, setUsers] = useState<UserRow[]>(initialUsers)

  async function toggle(slug: string) {
    const next = selected.includes(slug) ? selected.filter(s => s !== slug) : [...selected, slug]
    setSelected(next)
    const q = next.length ? `?tags=${encodeURIComponent(next.join(','))}` : ''
    const res = await fetch(`/api/users${q}`)
    const data = await res.json()
    setUsers(data)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {tags.map(t => (
          <label key={t.slug} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid #eee', borderRadius: 999, padding: '4px 10px' }}>
            <input type="checkbox" checked={selected.includes(t.slug)} onChange={() => toggle(t.slug)} />
            <span style={{ fontSize: 13 }}>{t.name}</span>
          </label>
        ))}
      </div>
      {users.length === 0 ? (
        <p style={{ color: '#777' }}>No users match the selected tags.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
          {users.map(u => (
            <li key={u.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 600 }}>{u.display_name || u.username}</div>
              {u.bio && <div style={{ color: '#666', marginTop: 4 }}>{u.bio}</div>}
              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                {u.tags.map(t => (
                  <span key={t} style={{ fontSize: 12, padding: '2px 8px', border: '1px solid #ddd', borderRadius: 999 }}>{t}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


