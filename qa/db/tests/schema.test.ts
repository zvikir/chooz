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


