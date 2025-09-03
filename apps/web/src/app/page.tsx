import UsersBrowserClient from "@/components/UsersBrowserClient";
import { getAuthUserFromCookies } from "@/lib/auth";

export default async function Home() {
  const user = await getAuthUserFromCookies()
  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-semibold bg-gradient-to-r from-primary to-[#4C3AAE] bg-clip-text text-transparent">Chooz</h1>
        <p className="mb-6 text-slate-300">Please login to continue.</p>
        <div className="flex gap-3">
          <a href="/login" className="btn-primary">Login</a>
          <a href="/signup" className="btn-primary">Sign up</a>
        </div>
      </main>
    )
  }
  const [tags, initialUsers] = await Promise.all([fetchTags(), fetchUsers()])
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-semibold bg-gradient-to-r from-primary to-[#4C3AAE] bg-clip-text text-transparent">Chooz</h1>
      <p className="mb-6 text-slate-300">A simple dating app.</p>
      <section>
        <h2 id="users" className="mb-3 text-lg font-medium text-slate-200">Users</h2>
        <UsersBrowserClient tags={tags} initialUsers={initialUsers} />
      </section>
    </main>
  );
}

async function fetchUsers(tagSlugs: string[] = []) {
  const q = tagSlugs.length ? `?tags=${encodeURIComponent(tagSlugs.join(','))}` : ''
  const res = await fetch(`http://localhost:3000/api/users${q}` as any, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

async function fetchTags() {
  const res = await fetch('http://localhost:3000/api/tags' as any, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}
