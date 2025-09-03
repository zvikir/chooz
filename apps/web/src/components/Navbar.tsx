"use client"
import { usePathname } from "next/navigation"
import ThemeToggle from '@/components/ThemeToggle'
export default function Navbar() {
  const pathname = usePathname()
  const onLoginPage = pathname === "/login"
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-[var(--color-header)] backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <a href="/" className="font-semibold text-[var(--color-text)]">Chooz</a>
        <nav className="flex items-center gap-2 text-sm">
          {onLoginPage && (
            <>
              <a href="/login" className="rounded-md border border-border px-3 py-1.5 text-[var(--color-text)] hover:bg-[var(--color-surface)]">Login</a>
              <a href="/signup" className="rounded-md border border-border px-3 py-1.5 bg-gradient-to-r from-primary to-[#4C3AAE] text-white hover:shadow-[0_0_0_6px_rgba(124,92,255,0.1)]">Sign up</a>
            </>
          )}
          <a href="/me" className="rounded-md border border-border px-3 py-1.5 text-[var(--color-text)] hover:bg-[var(--color-surface)]">My profile</a>
          <a href="/logout" className="rounded-md border border-border px-3 py-1.5 text-[var(--color-text)] hover:bg-[var(--color-surface)]">Logout</a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}


