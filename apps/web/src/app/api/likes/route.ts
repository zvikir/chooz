import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { getAuthUserFromCookies } from '@/lib/auth'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: Request) {
  const me = await getAuthUserFromCookies()
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { to_user_id, action } = await req.json().catch(() => ({}))
  if (!to_user_id || !['like', 'pass'].includes(action)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  if (to_user_id === me.id) return NextResponse.json({ error: 'Cannot react to self' }, { status: 400 })

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO user_likes (from_user_id, to_user_id, action)
       VALUES ($1, $2, $3)
       ON CONFLICT (from_user_id, to_user_id)
       DO UPDATE SET action = EXCLUDED.action, created_at = now()`,
      [me.id, to_user_id, action]
    )

    // Check if it's a match after a like
    let matched = false
    if (action === 'like') {
      const { rows } = await client.query(
        `SELECT 1 FROM user_likes WHERE from_user_id=$1 AND to_user_id=$2 AND action='like'`,
        [to_user_id, me.id]
      )
      matched = rows.length > 0
    }

    await client.query('COMMIT')
    return NextResponse.json({ ok: true, matched })
  } catch (e) {
    await client.query('ROLLBACK')
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  } finally {
    client.release()
  }
}

export async function DELETE(req: Request) {
  const me = await getAuthUserFromCookies()
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const to_user_id = url.searchParams.get('to_user_id')
  if (!to_user_id) return NextResponse.json({ error: 'Missing to_user_id' }, { status: 400 })

  const client = await pool.connect()
  try {
    const { rowCount } = await client.query(
      `DELETE FROM user_likes WHERE from_user_id=$1 AND to_user_id=$2`,
      [me.id, to_user_id]
    )
    return NextResponse.json({ ok: rowCount > 0 })
  } finally {
    client.release()
  }
}

export async function GET(req: Request) {
  const me = await getAuthUserFromCookies()
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const tab = (url.searchParams.get('tab') || 'unreacted').toLowerCase()
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '24', 10), 100)
  const offset = Math.max(parseInt(url.searchParams.get('offset') || '0', 10), 0)

  const client = await pool.connect()
  try {
    if (tab === 'liked') {
      const { rows } = await client.query(
        `SELECT 
           u.id, u.username, u.display_name, u.bio, u.gender, u.birthdate, u.location,
           EXTRACT(YEAR FROM AGE(u.birthdate)) AS age,
           COALESCE(MAX(p.url), CASE WHEN u.gender='male' THEN '/images/default-male.svg' ELSE '/images/default-female.svg' END) AS photo_url,
           ARRAY_REMOVE(ARRAY_AGG(t.name ORDER BY t.name), NULL) AS tags,
           l.created_at AS reacted_at
         FROM user_likes l
         JOIN users u ON u.id = l.to_user_id
         LEFT JOIN photos p ON p.user_id = u.id AND p.is_primary = TRUE
         LEFT JOIN user_tags ut ON ut.user_id = u.id
         LEFT JOIN tags t ON t.id = ut.tag_id
         WHERE l.from_user_id=$1 AND l.action='like'
         GROUP BY u.id, l.created_at
         ORDER BY reacted_at DESC
         LIMIT $2 OFFSET $3`, [me.id, limit, offset]
      )
      return NextResponse.json(rows)
    }

    if (tab === 'likers') {
      const { rows } = await client.query(
        `SELECT 
           u.id, u.username, u.display_name, u.bio, u.gender, u.birthdate, u.location,
           EXTRACT(YEAR FROM AGE(u.birthdate)) AS age,
           COALESCE(MAX(p.url), CASE WHEN u.gender='male' THEN '/images/default-male.svg' ELSE '/images/default-female.svg' END) AS photo_url,
           ARRAY_REMOVE(ARRAY_AGG(t.name ORDER BY t.name), NULL) AS tags,
           l.created_at AS reacted_at
         FROM user_likes l
         JOIN users u ON u.id = l.from_user_id
         LEFT JOIN photos p ON p.user_id = u.id AND p.is_primary = TRUE
         LEFT JOIN user_tags ut ON ut.user_id = u.id
         LEFT JOIN tags t ON t.id = ut.tag_id
         WHERE l.to_user_id=$1 AND l.action='like'
         GROUP BY u.id, l.created_at
         ORDER BY reacted_at DESC
         LIMIT $2 OFFSET $3`, [me.id, limit, offset]
      )
      return NextResponse.json(rows)
    }

    if (tab === 'matches') {
      const { rows } = await client.query(
        `SELECT 
           u.id, u.username, u.display_name, u.bio, u.gender, u.birthdate, u.location,
           EXTRACT(YEAR FROM AGE(u.birthdate)) AS age,
           COALESCE(MAX(p.url), CASE WHEN u.gender='male' THEN '/images/default-male.svg' ELSE '/images/default-female.svg' END) AS photo_url,
           ARRAY_REMOVE(ARRAY_AGG(t.name ORDER BY t.name), NULL) AS tags,
           m.matched_at
         FROM matches m
         JOIN users u ON u.id = CASE WHEN m.user_a=$1 THEN m.user_b WHEN m.user_b=$1 THEN m.user_a END
         LEFT JOIN photos p ON p.user_id = u.id AND p.is_primary = TRUE
         LEFT JOIN user_tags ut ON ut.user_id = u.id
         LEFT JOIN tags t ON t.id = ut.tag_id
         WHERE $1 IN (m.user_a, m.user_b)
         GROUP BY u.id, m.matched_at
         ORDER BY m.matched_at DESC
         LIMIT $2 OFFSET $3`, [me.id, limit, offset]
      )
      return NextResponse.json(rows)
    }

    // default: unreacted (not liked or passed yet)
    const { rows } = await client.query(
      `SELECT 
         u.id, u.username, u.display_name, u.bio, u.gender, u.birthdate, u.location,
         EXTRACT(YEAR FROM AGE(u.birthdate)) AS age,
         COALESCE(MAX(p.url), CASE WHEN u.gender='male' THEN '/images/default-male.svg' ELSE '/images/default-female.svg' END) AS photo_url,
         ARRAY_REMOVE(ARRAY_AGG(t.name ORDER BY t.name), NULL) AS tags
       FROM users u
       LEFT JOIN photos p ON p.user_id = u.id AND p.is_primary = TRUE
       LEFT JOIN user_tags ut ON ut.user_id = u.id
       LEFT JOIN tags t ON t.id = ut.tag_id
       WHERE u.id <> $1
         AND NOT EXISTS (
           SELECT 1 FROM user_likes l WHERE l.from_user_id=$1 AND l.to_user_id=u.id
         )
       GROUP BY u.id
       ORDER BY u.created_at DESC
       LIMIT $2 OFFSET $3`, [me.id, limit, offset]
    )
    return NextResponse.json(rows)
  } finally {
    client.release()
  }
}



