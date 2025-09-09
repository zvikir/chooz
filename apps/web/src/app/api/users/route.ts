import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET(req: Request) {
  const url = new URL(req.url)
  const username = url.searchParams.get('username')?.trim()
  const tagsParam = url.searchParams.get('tags')?.trim()
  const tagSlugs = tagsParam ? tagsParam.split(',').map(s => s.trim()).filter(Boolean) : []
  const q = url.searchParams.get('q')?.trim()
  const minAge = url.searchParams.get('minAge') ? parseInt(url.searchParams.get('minAge')!) : null
  const maxAge = url.searchParams.get('maxAge') ? parseInt(url.searchParams.get('maxAge')!) : null
  const location = url.searchParams.get('location')?.trim()

  const client = await pool.connect()
  try {
    const hasTags = tagSlugs.length > 0
    const hasQ = !!q
    const hasAgeFilter = minAge !== null || maxAge !== null
    const hasLocationFilter = !!location
    
    // Build filtering conditions
    const buildFilters = () => {
      const conditions = []
      if (hasAgeFilter) {
        if (minAge !== null) {
          conditions.push(`EXTRACT(YEAR FROM AGE(u.birthdate)) >= ${minAge}`)
        }
        if (maxAge !== null) {
          conditions.push(`EXTRACT(YEAR FROM AGE(u.birthdate)) <= ${maxAge}`)
        }
      }
      if (hasLocationFilter) {
        conditions.push(`LOWER(u.location) LIKE LOWER('%${location}%')`)
      }
      return conditions.length > 0 ? ` AND ${conditions.join(' AND ')}` : ''
    }

    if (username) {
      const { rows } = await client.query(
        `SELECT 
            u.id,
            u.username,
            u.display_name,
            u.bio,
            u.gender,
            u.birthdate,
            u.location,
            EXTRACT(YEAR FROM AGE(u.birthdate)) AS age,
            COALESCE(MAX(p.url), CASE WHEN u.gender='male' THEN '/images/default-male.svg' ELSE '/images/default-female.svg' END) AS photo_url,
            ARRAY_REMOVE(ARRAY_AGG(t.name ORDER BY t.name), NULL) AS tags
         FROM users u
         LEFT JOIN photos p ON p.user_id = u.id AND p.is_primary = TRUE
         LEFT JOIN user_tags ut ON ut.user_id = u.id
         LEFT JOIN tags t ON t.id = ut.tag_id
         WHERE u.username = $1${buildFilters()}
         GROUP BY u.id, u.username, u.display_name, u.bio, u.gender, u.birthdate, u.location`,
        [username]
      )
      return NextResponse.json(rows)
    }

    if (!hasTags && !hasQ) {
      const { rows } = await client.query(
        `SELECT 
            u.id,
            u.username,
            u.display_name,
            u.bio,
            u.gender,
            u.birthdate,
            u.location,
            EXTRACT(YEAR FROM AGE(u.birthdate)) AS age,
            COALESCE(MAX(p.url), CASE WHEN u.gender='male' THEN '/images/default-male.svg' ELSE '/images/default-female.svg' END) AS photo_url,
            ARRAY_REMOVE(ARRAY_AGG(t.name ORDER BY t.name), NULL) AS tags
         FROM users u
         LEFT JOIN photos p ON p.user_id = u.id AND p.is_primary = TRUE
         LEFT JOIN user_tags ut ON ut.user_id = u.id
         LEFT JOIN tags t ON t.id = ut.tag_id
         WHERE 1=1${buildFilters()}
         GROUP BY u.id, u.username, u.display_name, u.bio, u.gender, u.birthdate, u.location
         ORDER BY u.username`
      )
      return NextResponse.json(rows)
    }

    // Case: search by q only (no tag filters)
    if (hasQ && !hasTags) {
      const { rows } = await client.query(
        `SELECT 
            u.id,
            u.username,
            u.display_name,
            u.bio,
            u.gender,
            u.birthdate,
            u.location,
            EXTRACT(YEAR FROM AGE(u.birthdate)) AS age,
            COALESCE(MAX(p.url), CASE WHEN u.gender='male' THEN '/images/default-male.svg' ELSE '/images/default-female.svg' END) AS photo_url,
            ARRAY_REMOVE(ARRAY_AGG(t.name ORDER BY t.name), NULL) AS tags
         FROM users u
         LEFT JOIN photos p ON p.user_id = u.id AND p.is_primary = TRUE
         LEFT JOIN user_tags ut ON ut.user_id = u.id
         LEFT JOIN tags t ON t.id = ut.tag_id
         WHERE to_tsvector('english', coalesce(u.username,'') || ' ' || coalesce(u.display_name,'') || ' ' || coalesce(u.bio,'') || ' ' || coalesce(u.location,'')) @@ plainto_tsquery('english', $1)${buildFilters()}
         GROUP BY u.id, u.username, u.display_name, u.bio, u.gender, u.birthdate, u.location
         ORDER BY u.username`,
        [q]
      )
      return NextResponse.json(rows)
    }

    // Case: tag filters (with optional q)
    const { rows } = await client.query(
      `WITH
       base_users AS (
         SELECT u.* FROM users u
         WHERE 1=1${hasQ ? ` AND to_tsvector('english', coalesce(u.username,'') || ' ' || coalesce(u.display_name,'') || ' ' || coalesce(u.bio,'') || ' ' || coalesce(u.location,'')) @@ plainto_tsquery('english', $1)` : ''}
       ),
       selected_tags AS (
         SELECT id FROM tags WHERE slug = ANY($${hasQ ? 2 : 1}::text[])
       ), users_with_selected AS (
         SELECT u.id, u.username, u.display_name, u.bio, u.birthdate, u.location
         FROM ${hasQ ? 'base_users u' : 'users u'}
         JOIN user_tags ut ON ut.user_id = u.id
         JOIN selected_tags st ON st.id = ut.tag_id
         GROUP BY u.id, u.username, u.display_name, u.bio, u.birthdate, u.location
         HAVING COUNT(DISTINCT st.id) = $${hasQ ? 3 : 2}
       )
       SELECT 
              uws.id,
              uws.username,
              uws.display_name,
              uws.bio,
              u.gender,
              uws.birthdate,
              uws.location,
              EXTRACT(YEAR FROM AGE(uws.birthdate)) AS age,
              COALESCE(MAX(p.url), CASE WHEN u.gender='male' THEN '/images/default-male.svg' ELSE '/images/default-female.svg' END) AS photo_url,
              ARRAY_REMOVE(ARRAY_AGG(t.name ORDER BY t.name), NULL) AS tags
       FROM users_with_selected uws
       JOIN users u ON u.id = uws.id
       LEFT JOIN photos p ON p.user_id = uws.id AND p.is_primary = TRUE
       LEFT JOIN user_tags ut ON ut.user_id = uws.id
       LEFT JOIN tags t ON t.id = ut.tag_id
       WHERE 1=1${buildFilters()}
       GROUP BY uws.id, uws.username, uws.display_name, uws.bio, u.gender, uws.birthdate, uws.location
       ORDER BY uws.username`,
      hasQ ? [q, tagSlugs, tagSlugs.length] : [tagSlugs, tagSlugs.length]
    )
    return NextResponse.json(rows)
  } finally {
    client.release()
  }
}
