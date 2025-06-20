import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create test users
  const passwordHash = await bcrypt.hash('password123', 12);

  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      username: 'john_doe',
      email: 'john@example.com',
      passwordHash,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      username: 'jane_smith',
      email: 'jane@example.com',
      passwordHash,
    },
  });

  console.log('✅ Users created:', {
    user1: user1.username,
    user2: user2.username,
  });

  // Create test posts
  const posts = await Promise.all([
    prisma.post.upsert({
      where: { id: 1 },
      update: {},
      create: {
        userId: user1.id,
        title: 'First Post',
        content: 'This is my first post using Prisma!',
      },
    }),
    prisma.post.upsert({
      where: { id: 2 },
      update: {},
      create: {
        userId: user1.id,
        title: 'Second Post',
        content: 'Another post from John.',
      },
    }),
    prisma.post.upsert({
      where: { id: 3 },
      update: {},
      create: {
        userId: user2.id,
        title: 'Hello from Jane',
        content: 'Jane here! This is my first post.',
      },
    }),
  ]);

  console.log('✅ Posts created:', posts.length);
  console.log('🎉 Database seeding completed!');
}

main()
  .catch(e => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
