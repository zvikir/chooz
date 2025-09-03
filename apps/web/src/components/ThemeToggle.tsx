'use client'

import { useEffect, useState } from 'react'
import { setThemeChoice } from './ThemeClient'

type ThemeChoice = 'system' | 'light' | 'dark'

export default function ThemeToggle() {
  const [open, setOpen] = useState(false)
  const [choice, setChoice] = useState<ThemeChoice>('system')

  useEffect(() => {
    const stored = (typeof window !== 'undefined' && window.localStorage.getItem('theme')) as ThemeChoice | null
    if (stored === 'light' || stored === 'dark' || stored === 'system') setChoice(stored)
  }, [])

  function onSelect(next: ThemeChoice) {
    setChoice(next)
    setThemeChoice(next)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="rounded-md border border-border bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg)]"
      >
        Theme: {choice}
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-50 mt-2 w-40 rounded-md border border-border bg-[var(--color-surface)] p-1 text-sm text-[var(--color-text)] shadow-card">
          <button role="menuitem" onClick={() => onSelect('system')} className="block w-full rounded px-2 py-1.5 text-left hover:bg-[var(--color-bg)]">System</button>
          <button role="menuitem" onClick={() => onSelect('light')} className="block w-full rounded px-2 py-1.5 text-left hover:bg-[var(--color-bg)]">Light</button>
          <button role="menuitem" onClick={() => onSelect('dark')} className="block w-full rounded px-2 py-1.5 text-left hover:bg-[var(--color-bg)]">Dark</button>
        </div>
      )}
    </div>
  )
}


