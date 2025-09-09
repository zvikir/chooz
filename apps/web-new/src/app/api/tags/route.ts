import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      'SELECT name, slug FROM tags ORDER BY name'
    )
    return NextResponse.json(rows)
  } finally {
    client.release()
  }
}

