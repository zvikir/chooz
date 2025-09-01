import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { SignJWT } from 'jose'
import { compare } from 'bcryptjs'

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
    const token = await new SignJWT({ sub: user.id, email: user.email, name: user.display_name || user.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret)

    const res = NextResponse.json({ token })
    res.headers.set('Cache-Control', 'no-store')
    return res
  } finally {
    client.release()
  }
}


