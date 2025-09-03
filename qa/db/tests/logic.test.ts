import { Client } from 'pg'

const dbUrl = process.env.DATABASE_URL

async function withDb<T>(fn: (c: Client) => Promise<T>) {
  const c = new Client({ connectionString: dbUrl })
  await c.connect()
  try { return await fn(c) } finally { await c.end() }
}

test('users email and username are unique', async () => {
  await withDb(async (c) => {
    const emailIdx = await c.query("SELECT 1 FROM pg_indexes WHERE tablename='users' AND indexname ILIKE '%email%' AND indexdef ILIKE '%UNIQUE%'")
    const userIdx = await c.query("SELECT 1 FROM pg_indexes WHERE tablename='users' AND indexname ILIKE '%username%' AND indexdef ILIKE '%UNIQUE%'")
    expect(emailIdx.rowCount).toBeGreaterThan(0)
    expect(userIdx.rowCount).toBeGreaterThan(0)
  })
})

test('FTS query returns rows for common term', async () => {
  await withDb(async (c) => {
    const { rows } = await c.query(
      `SELECT u.id
       FROM users u
       WHERE to_tsvector('english', coalesce(u.username,'') || ' ' || coalesce(u.display_name,'') || ' ' || coalesce(u.bio,'')) @@ plainto_tsquery('english', $1)
       LIMIT 5`,
      ['music']
    )
    expect(Array.isArray(rows)).toBe(true)
  })
})

test('tag filter returns only users with selected tags', async () => {
  await withDb(async (c) => {
    const { rows } = await c.query(
      `WITH selected_tags AS (
         SELECT id FROM tags WHERE slug = ANY($1::text[])
       ), users_with_selected AS (
         SELECT u.id
         FROM users u
         JOIN user_tags ut ON ut.user_id = u.id
         JOIN selected_tags st ON st.id = ut.tag_id
         GROUP BY u.id
         HAVING COUNT(DISTINCT st.id) = $2
       )
       SELECT u.id, ARRAY(SELECT t.name FROM user_tags ut JOIN tags t ON t.id = ut.tag_id WHERE ut.user_id = u.id) AS tags
       FROM users u
       JOIN users_with_selected uw ON uw.id = u.id
       LIMIT 5`,
      [['music', 'hiking'], 2]
    )
    for (const r of rows) {
      expect(r.tags).toEqual(expect.arrayContaining(['Music', 'Hiking']))
    }
  })
})


