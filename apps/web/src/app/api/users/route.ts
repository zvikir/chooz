import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET(req: Request) {
  const url = new URL(req.url)
  const tagsParam = url.searchParams.get('tags')?.trim()
  const tagSlugs = tagsParam ? tagsParam.split(',').map(s => s.trim()).filter(Boolean) : []

  const client = await pool.connect()
  try {
    if (tagSlugs.length === 0) {
      const { rows } = await client.query(
        `SELECT u.id, u.username, u.display_name, u.bio,
                ARRAY_AGG(t.name ORDER BY t.name) AS tags
         FROM users u
         JOIN user_tags ut ON ut.user_id = u.id
         JOIN tags t ON t.id = ut.tag_id
         GROUP BY u.id, u.username, u.display_name, u.bio
         ORDER BY u.username`
      )
      return NextResponse.json(rows)
    }

    const { rows } = await client.query(
      `WITH selected_tags AS (
         SELECT id FROM tags WHERE slug = ANY($1::text[])
       ), users_with_selected AS (
         SELECT u.id, u.username, u.display_name, u.bio
         FROM users u
         JOIN user_tags ut ON ut.user_id = u.id
         JOIN selected_tags st ON st.id = ut.tag_id
         GROUP BY u.id, u.username, u.display_name, u.bio
         HAVING COUNT(DISTINCT st.id) = $2
       )
       SELECT uws.id, uws.username, uws.display_name, uws.bio,
              ARRAY_AGG(t.name ORDER BY t.name) AS tags
       FROM users_with_selected uws
       JOIN user_tags ut ON ut.user_id = uws.id
       JOIN tags t ON t.id = ut.tag_id
       GROUP BY uws.id, uws.username, uws.display_name, uws.bio
       ORDER BY uws.username`,
      [tagSlugs, tagSlugs.length]
    )
    return NextResponse.json(rows)
  } finally {
    client.release()
  }
}


