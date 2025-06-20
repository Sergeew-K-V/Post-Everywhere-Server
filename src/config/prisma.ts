import { PrismaClient } from '../generated/prisma';

let prisma: PrismaClient;

export const connectDatabase = async (): Promise<void> => {
  prisma = new PrismaClient();

  // Test the connection
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

export const getPrisma = (): PrismaClient => {
  if (!prisma) {
    throw new Error('Database not initialized. Call connectDatabase() first.');
  }
  return prisma;
};

export const closeDatabase = async (): Promise<void> => {
  if (prisma) {
    await prisma.$disconnect();
  }
};
