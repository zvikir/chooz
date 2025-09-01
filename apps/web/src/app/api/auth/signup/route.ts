import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { hash } from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: Request) {
  const { email, username, password, display_name } = await req.json().catch(() => ({}))
  if (!email || !username || !password) {
    return NextResponse.json({ error: 'email, username, and password are required' }, { status: 400 })
  }
  const client = await pool.connect()
  try {
    const exists = await client.query('SELECT 1 FROM users WHERE email=$1 OR username=$2 LIMIT 1', [email, username])
    if (exists.rowCount) {
      return NextResponse.json({ error: 'email or username already in use' }, { status: 409 })
    }
    const password_hash = await hash(password, 10)
    const inserted = await client.query(
      `INSERT INTO users (email, username, password_hash, display_name)
       VALUES ($1,$2,$3,$4)
       RETURNING id, email, username, display_name`,
      [email, username, password_hash, display_name || null]
    )
    return NextResponse.json(inserted.rows[0], { status: 201 })
  } finally {
    client.release()
  }
}


