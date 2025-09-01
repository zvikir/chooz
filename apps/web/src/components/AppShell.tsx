'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideNavbar = pathname === '/login' || pathname === '/signup'
  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  )
}


