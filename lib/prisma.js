// lib/prisma.js
import { PrismaClient } from '@prisma/client';

const globalAny = global;

const prisma = globalAny.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalAny.prisma = prisma;
}

export default prisma;
