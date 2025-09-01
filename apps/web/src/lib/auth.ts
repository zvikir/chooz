import { cookies } from 'next/headers'
import { jwtVerify, JWTPayload } from 'jose'

const AUTH_COOKIE = 'auth'

export type AuthUser = {
  id: string
  email: string
  name?: string | null
}

export async function verifyJwt(token: string): Promise<AuthUser | null> {
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret')
  try {
    const { payload } = await jwtVerify(token, secret)
    const sub = (payload.sub || '') as string
    if (!sub) return null
    return { id: sub, email: String((payload as JWTPayload).email || ''), name: (payload as JWTPayload).name as string | undefined }
  } catch {
    return null
  }
}

export async function getAuthUserFromCookies(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE)?.value
  if (!token) return null
  return verifyJwt(token)
}

export const authCookieName = AUTH_COOKIE


