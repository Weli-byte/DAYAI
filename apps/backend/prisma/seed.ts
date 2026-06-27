/**
 * Prisma seed script.
 *
 * Sprint 1: No tables exist yet — this script is a placeholder.
 * Sprint 5 will add seed data for:
 *   - Default categories
 *   - Test users (wallets)
 *   - Sample AI model metadata
 *
 * Run: pnpm prisma:seed
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Running seed...');

  // Sprint 5+ seed data will go here.
  // Example:
  // await prisma.user.upsert({ where: { walletAddress: '0x...' }, ... });

  console.log('✅ Seed complete — no tables to seed yet (Sprint 5 adds models)');
}

main()
  .catch((err: Error) => {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
