'use client'

import { useEffect } from 'react'

type ThemeChoice = 'system' | 'light' | 'dark'

function applyTheme(choice: ThemeChoice) {
  const root = document.documentElement
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const next = choice === 'system' ? (prefersDark ? 'dark' : 'light') : choice

  // Apply class and data attribute for tests and styling
  root.classList.toggle('dark', next === 'dark')
  root.setAttribute('data-theme', next)
}

export default function ThemeClient() {
  useEffect(() => {
    // Read persisted choice; default to system
    const stored = (typeof window !== 'undefined' && window.localStorage.getItem('theme')) as ThemeChoice | null
    const choice: ThemeChoice = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system'
    applyTheme(choice)

    // React to system changes when in system mode
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      const current = (window.localStorage.getItem('theme') as ThemeChoice | null) ?? 'system'
      if (current === 'system') applyTheme('system')
    }
    if (media && 'addEventListener' in media) media.addEventListener('change', onChange)
    return () => {
      if (media && 'removeEventListener' in media) media.removeEventListener('change', onChange)
    }
  }, [])
  return null
}

export function setThemeChoice(choice: ThemeChoice) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem('theme', choice)
  applyTheme(choice)
}


