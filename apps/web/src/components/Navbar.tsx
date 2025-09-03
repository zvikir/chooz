"use client"
import { useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'
import { BRAND_NAME } from '@/config/brand'
export default function Navbar({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-[var(--color-header)] backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <a href="/" aria-label={BRAND_NAME} className="flex items-center">
          <div className="h-7 w-[140px] overflow-hidden md:h-10 md:w-[200px]">
            <picture>
              <source srcSet="/opshns-logo.png" type="image/png" />
              <img src="/opshns-logo.svg" alt={BRAND_NAME} className="h-full w-full object-cover" />
            </picture>
          </div>
        </a>
        <button
          type="button"
          aria-label="Menu"
          className="inline-flex items-center rounded md:hidden border border-border px-2 py-1 text-sm text-[var(--color-text)]"
          onClick={() => setOpen(v => !v)}
        >
          ☰
        </button>
        <nav className="hidden items-center gap-2 text-sm md:flex">
          {isAuthenticated ? (
            <>
              <a href="/me" className="rounded-md border border-border px-3 py-1.5 text-[var(--color-text)] hover:bg-[var(--color-surface)]">My profile</a>
              <a href="/logout" className="rounded-md border border-border px-3 py-1.5 text-[var(--color-text)] hover:bg-[var(--color-surface)]">Logout</a>
            </>
          ) : (
            <>
              <a href="/login" className="rounded-md border border-border px-3 py-1.5 text-[var(--color-text)] hover:bg-[var(--color-surface)]">Login</a>
              <a href="/signup" className="btn-primary">Sign up</a>
            </>
          )}
          <ThemeToggle />
        </nav>
      </div>
      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-border bg-[var(--color-surface)]">
          <div className="mx-auto max-w-5xl px-4 py-3 flex flex-col gap-2 text-sm">
            {isAuthenticated ? (
              <>
                <a href="/me" className="rounded-md border border-border px-3 py-1.5 text-[var(--color-text)]">My profile</a>
                <a href="/logout" className="rounded-md border border-border px-3 py-1.5 text-[var(--color-text)]">Logout</a>
              </>
            ) : (
              <>
                <a href="/login" className="rounded-md border border-border px-3 py-1.5 text-[var(--color-text)]">Login</a>
                <a href="/signup" className="btn-primary">Sign up</a>
              </>
            )}
            <div className="pt-2"><ThemeToggle /></div>
          </div>
        </div>
      )}
    </header>
  )
}


