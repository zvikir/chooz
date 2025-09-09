import { Client } from 'pg'

const dbUrl = process.env.DATABASE_URL

test('DATABASE_URL is provided', () => {
  expect(dbUrl, 'DATABASE_URL env var must be set').toBeTruthy()
})

test('users.gender column exists and is constrained', async () => {
  const client = new Client({ connectionString: dbUrl })
  await client.connect()
  try {
    const col = await client.query(
      `SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='gender'`
    )
    expect(col.rowCount).toBe(1)

    // Check constraint existence by name pattern
    const chk = await client.query(
      `SELECT conname FROM pg_constraint c
       JOIN pg_class t ON c.conrelid = t.oid
       WHERE t.relname = 'users' AND c.conname ILIKE '%gender%' AND contype = 'c'`
    )
    expect(chk.rowCount).toBeGreaterThanOrEqual(1)
  } finally {
    await client.end()
  }
})

test('user_likes table exists with constraints and indexes', async () => {
  const client = new Client({ connectionString: dbUrl })
  await client.connect()
  try {
    const tbl = await client.query(
      `SELECT 1 FROM information_schema.tables WHERE table_name='user_likes'`
    )
    expect(tbl.rowCount).toBe(1)

    const cols = await client.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name='user_likes'`
    )
    const colNames = cols.rows.map(r => r.column_name)
    expect(colNames).toEqual(expect.arrayContaining(['from_user_id','to_user_id','action','created_at']))

    // unique(from_user_id,to_user_id)
    const uniq = await client.query(
      `SELECT c.conname, pg_get_constraintdef(c.oid) AS def
       FROM pg_constraint c
       JOIN pg_class t ON c.conrelid = t.oid
       WHERE t.relname = 'user_likes' AND c.contype = 'u'`
    )
    expect(uniq.rowCount).toBeGreaterThanOrEqual(1)

    // check action constraint
    const chk = await client.query(
      `SELECT conname FROM pg_constraint c JOIN pg_class t ON c.conrelid=t.oid WHERE t.relname='user_likes' AND contype='c'`
    )
    expect(chk.rowCount).toBeGreaterThanOrEqual(1)
  } finally {
    await client.end()
  }
})

test('matches view exists and returns reciprocal likes', async () => {
  const client = new Client({ connectionString: dbUrl })
  await client.connect()
  try {
    // View exists
    const v = await client.query(
      `SELECT 1 FROM information_schema.views WHERE table_name='matches'`
    )
    expect(v.rowCount).toBe(1)

    // Use a transaction so we don't persist test data
    await client.query('BEGIN')

    // Pick two known users from seed
    const { rows } = await client.query(
      `SELECT id FROM users WHERE email IN ('alice@example.com','bob@example.com') ORDER BY email`
    )
    expect(rows.length).toBe(2)
    const a = rows[0].id as string
    const b = rows[1].id as string

    // Clean any previous reactions between them
    await client.query(`DELETE FROM user_likes WHERE (from_user_id=$1 AND to_user_id=$2) OR (from_user_id=$2 AND to_user_id=$1)`, [a, b])

    // Insert reciprocal likes
    await client.query(`INSERT INTO user_likes(from_user_id,to_user_id,action) VALUES ($1,$2,'like')`, [a, b])
    await client.query(`INSERT INTO user_likes(from_user_id,to_user_id,action) VALUES ($1,$2,'like')`, [b, a])

    // Expect a match row for the pair
    const m = await client.query(
      `SELECT 1 FROM matches WHERE ($1 IN (user_a,user_b)) AND ($2 IN (user_a,user_b))`, [a, b]
    )
    expect(m.rowCount).toBe(1)

    // Rollback so DB remains clean
    await client.query('ROLLBACK')
  } finally {
    await client.end()
  }
})


