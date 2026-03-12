import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import "dotenv/config";

async function main() {
  const url = process.env.DATABASE_URL!;
  console.log("DATABASE_URL:", url);

  const getBaseUrl = (url: string) => {
    try {
      const u = new URL(url.replace("prisma+postgres", "http"));
      return `postgres://${u.username}:${u.password}@${u.hostname}:${u.port}${u.pathname}`;
    } catch (e) {
      return url.replace("prisma+postgres", "postgres");
    }
  };

  const pool = new Pool({ 
    connectionString: getBaseUrl(url),
    max: 1,
    idleTimeoutMillis: 1,
    connectionTimeoutMillis: 0,
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const userCount = await prisma.user.count();
    console.log("Success! User count:", userCount);
  } catch (error) {
    console.error("Failed to connect to Prisma:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
