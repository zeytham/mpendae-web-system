const { PrismaClient } = require('@prisma/client');

// Singleton pattern: instance MOJA tu ya PrismaClient kwa app nzima.
// Kabla ya hapa, kila controller (11 faili) ilikuwa inaunda PrismaClient yake
// yenyewe -> kila moja inafungua connection pool yake kwa DB, hivyo
// tunapata "too many connections" haraka kwenye Postgres (Railway free/starter
// tier kwa kawaida ina kikomo cha connections ~20-30).
//
// Kwa hifadhi dhidi ya hot-reload (nodemon) kuunda instance nyingi wakati wa
// dev, tunatumia global caching kama Prisma wanavyoshauri rasmi.
const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
