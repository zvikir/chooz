'use client'

import { useEffect, useState } from 'react'

export default function LogoutPage() {
  const [done, setDone] = useState(false)
  useEffect(() => {
    async function run() {
      await fetch('/api/auth/logout', { method: 'POST' })
      setDone(true)
    }
    run()
  }, [])

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>Logout</h1>
      <p>{done ? 'You have been logged out.' : 'Logging you out...'}</p>
      {done && <a href="/" style={{ marginTop: 12, display: 'inline-block' }}>Back to home</a>}
    </main>
  )
}


