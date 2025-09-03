import { getAuthUserFromCookies } from '@/lib/auth'

export default async function MePage() {
  const user = await getAuthUserFromCookies()
  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-4 text-3xl font-semibold" role="heading" aria-level={1}>My profile</h1>
        <p className="text-slate-300">You are not logged in.</p>
      </main>
    )
  }
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-4 text-3xl font-semibold" role="heading" aria-level={1}>My profile</h1>
      <div className="rounded-lg border border-border bg-[#0E1525] p-4 text-slate-100 shadow-card">
        <div><span className="text-slate-300">ID:</span> {user.id}</div>
        <div><span className="text-slate-300">Email:</span> {user.email}</div>
        {user.name && <div><span className="text-slate-300">Name:</span> {user.name}</div>}
      </div>
    </main>
  )
}


