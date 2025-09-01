import UsersBrowserClient from "@/components/UsersBrowserClient";
export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Chooz</h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        A simple dating app. This is the landing page.
      </p>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <a href="#users" style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8 }}>Browse users</a>
        <a href="/login" style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8 }}>Login</a>
        <a href="#signup" style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8 }}>Sign up</a>
      </div>
      <section>
        <h2 id="users" style={{ fontSize: 20, marginBottom: 12 }}>Users</h2>
        <UsersBrowser />
      </section>
    </main>
  );
}

async function fetchUsers(tagSlugs: string[] = []): Promise<Array<{ id: string; username: string; display_name: string | null; bio: string | null; tags: string[] }>> {
  const q = tagSlugs.length ? `?tags=${encodeURIComponent(tagSlugs.join(','))}` : ''
  const res = await fetch(`http://localhost:3000/api/users${q}` as any, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

async function fetchTags(): Promise<Array<{ name: string; slug: string }>> {
  const res = await fetch('http://localhost:3000/api/tags' as any, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

// moved client logic to components/UsersBrowserClient.tsx

async function UsersBrowser() {
  const [tags, initialUsers] = await Promise.all([fetchTags(), fetchUsers()])
  return <UsersBrowserClient tags={tags} initialUsers={initialUsers} />
}
