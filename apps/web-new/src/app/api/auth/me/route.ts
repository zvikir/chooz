import { NextResponse } from 'next/server'
import { getAuthUserFromCookies } from '@/lib/auth'

export async function GET() {
  const user = await getAuthUserFromCookies()
  if (!user) {
    return NextResponse.json({ user: null })
  }
  return NextResponse.json({ user })
}

