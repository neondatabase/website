import { PrismaAdapter as _PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

// @NOTE: this is module extension
// required to alter prisma adapter
export const PrismaAdapter = (p) => ({
  ..._PrismaAdapter(p),
  getUser: (id) =>
    p.user.findUnique({
      where: { id: +id },
      select: {
        colorSchema: true,
      },
    }),
});

export default prisma;
