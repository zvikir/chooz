import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { hash } from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: Request) {
  const { email, username, password, display_name, tag_slugs, gender } = await req.json().catch(() => ({}))
  if (!email || !username || !password) {
    return NextResponse.json({ error: 'email, username, and password are required' }, { status: 400 })
  }
  if (!Array.isArray(tag_slugs) || tag_slugs.length < 2) {
    return NextResponse.json({ error: 'please choose at least 2 tags' }, { status: 400 })
  }
  if (gender !== 'male' && gender !== 'female') {
    return NextResponse.json({ error: 'please choose gender (male or female)' }, { status: 400 })
  }
  const client = await pool.connect()
  try {
    const exists = await client.query('SELECT 1 FROM users WHERE email=$1 OR username=$2 LIMIT 1', [email, username])
    if (exists.rowCount) {
      return NextResponse.json({ error: 'email or username already in use' }, { status: 409 })
    }

    const { rows: tagRows } = await client.query(
      'SELECT id FROM tags WHERE slug = ANY($1::text[])',
      [tag_slugs]
    )
    if (tagRows.length < 2) {
      return NextResponse.json({ error: 'invalid tags selection' }, { status: 400 })
    }

    const password_hash = await hash(password, 10)
    const inserted = await client.query(
      `INSERT INTO users (email, username, password_hash, display_name, gender)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id, email, username, display_name, gender`,
      [email, username, password_hash, display_name || null, gender]
    )
    const userId = inserted.rows[0].id
    // assign tags
    await client.query(
      `INSERT INTO user_tags (user_id, tag_id)
       SELECT $1, t.id FROM tags t WHERE t.slug = ANY($2::text[])
       ON CONFLICT DO NOTHING`,
      [userId, tag_slugs]
    )
    // default primary photo by gender
    await client.query(
      `INSERT INTO photos (user_id, url, is_primary)
       VALUES ($1, CASE WHEN $2='male' THEN '/images/default-male.svg' ELSE '/images/default-female.svg' END, TRUE)
       ON CONFLICT DO NOTHING`,
      [userId, gender]
    )
    return NextResponse.json(inserted.rows[0], { status: 201 })
  } finally {
    client.release()
  }
}


