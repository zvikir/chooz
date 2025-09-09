import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { SignJWT } from 'jose'
import { compare } from 'bcryptjs'
import { authCookieName } from '@/lib/auth'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}))
  if (!email || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      `SELECT id, email, username, display_name, password_hash FROM users WHERE email = $1 LIMIT 1`,
      [email]
    )
    const user = rows[0]
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    const ok = await compare(password, user.password_hash)
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret')
    const token = await new SignJWT({ 
      userId: user.id, 
      email: user.email, 
      username: user.username 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret)

    const res = NextResponse.json({ ok: true })
    res.headers.set('Cache-Control', 'no-store')
    res.cookies.set(authCookieName, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } finally {
    client.release()
  }
}

