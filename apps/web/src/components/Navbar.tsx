"use client"
import { usePathname } from "next/navigation"
export default function Navbar() {
  const pathname = usePathname()
  const onLoginPage = pathname === "/login"
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <a href="/" className="font-semibold text-slate-900 dark:text-slate-100">Chooz</a>
        <nav className="flex items-center gap-2 text-sm">
          {onLoginPage && (
            <>
              <a href="/login" className="rounded-md border border-border px-3 py-1.5 text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-50">Login</a>
              <a href="/signup" className="rounded-md border border-border px-3 py-1.5 text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-50">Sign up</a>
            </>
          )}
          <a href="/me" className="rounded-md border border-border px-3 py-1.5 text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-50">My profile</a>
          <a href="/logout" className="rounded-md border border-border px-3 py-1.5 text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-50">Logout</a>
        </nav>
      </div>
    </header>
  )
}


