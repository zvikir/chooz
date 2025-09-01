import { getAuthUserFromCookies } from '@/lib/auth'

export default async function MePage() {
  const user = await getAuthUserFromCookies()
  if (!user) {
    return (
      <main style={{ maxWidth: 720, margin: '40px auto', padding: '0 16px' }}>
        <h1 style={{ fontSize: 24, marginBottom: 12 }}>My profile</h1>
        <p style={{ color: '#555' }}>You are not logged in.</p>
      </main>
    )
  }
  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>My profile</h1>
      <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
        <div><strong>ID:</strong> {user.id}</div>
        <div><strong>Email:</strong> {user.email}</div>
        {user.name && <div><strong>Name:</strong> {user.name}</div>}
      </div>
    </main>
  )
}


