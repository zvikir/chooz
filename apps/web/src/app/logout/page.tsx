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
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-4 text-3xl font-semibold">Logout</h1>
      <p>{done ? 'You have been logged out.' : 'Logging you out...'}</p>
      {done && <a href="/" className="mt-3 inline-block rounded-md border border-border px-3 py-2">Back to home</a>}
    </main>
  )
}


