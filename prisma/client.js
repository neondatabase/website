import { PrismaClient } from '@prisma/client';

const global = {};

// Extra hacks to avoid double initialization in development of middleware
const init = function () {
  const client = new PrismaClient({
    log: ['query'],
  });

  return client;
};

const prisma = global.prisma || init();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
