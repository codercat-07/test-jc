import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

console.log("Loading src/lib/prisma.ts module...");

const getBaseUrl = (url: string) => {
  return url.replace("prisma+postgres", "postgres");
};

declare global {
  var prismaGlobal: PrismaClient | undefined;
  var pgPoolGlobal: Pool | undefined;
}

function getPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is missing");

  if (!global.pgPoolGlobal) {
    console.log("Initializing new PG Pool...");
    global.pgPoolGlobal = new Pool({
      connectionString: getBaseUrl(url),
      max: 1,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 30000,
    });
  }

  if (!global.prismaGlobal) {
    console.log("Initializing new PrismaClient instance...");
    const adapter = new PrismaPg(global.pgPoolGlobal as any);
    global.prismaGlobal = new PrismaClient({ adapter });
  }

  return global.prismaGlobal;
}

export const prisma = getPrismaClient();
