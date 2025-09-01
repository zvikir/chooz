/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    const users = await prisma.$queryRawUnsafe(
      'SELECT u.username, ARRAY_AGG(t.name ORDER BY t.name) AS tags FROM users u JOIN user_tags ut ON ut.user_id = u.id JOIN tags t ON t.id = ut.tag_id GROUP BY u.username ORDER BY u.username;'
    );
    console.log('Users with tags:', users);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


