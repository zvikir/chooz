const pkg = require('@prisma/client')
const { PrismaClient } = pkg

let prismaGlobal = global.prismaGlobal || undefined
const prisma = prismaGlobal || new PrismaClient()
if (process.env.NODE_ENV !== 'production') {
  global.prismaGlobal = prisma
}

module.exports = {
  ...pkg,
  prisma,
}


