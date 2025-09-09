import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export const authCookieName = 'auth'

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret-please-change')

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    return null
  }
}

export async function getAuthUserFromCookies() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get(authCookieName)
  
  if (!authCookie) {
    return null
  }

  const payload = await verifyJwt(authCookie.value)
  if (!payload || !payload.userId) {
    return null
  }

  return {
    id: payload.userId as string,
    username: payload.username as string,
    email: payload.email as string,
  }
}