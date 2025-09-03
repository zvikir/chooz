'use client'

import Navbar from '@/components/Navbar'

export default function AppShell({ children, isAuthenticated }: { children: React.ReactNode; isAuthenticated: boolean }) {
  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} />
      {children}
    </>
  )
}


