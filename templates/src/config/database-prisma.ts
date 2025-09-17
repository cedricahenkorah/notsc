import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

// Initialize Prisma Client
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    logger.info('✅ Connected to PostgreSQL with Prisma');
  } catch (error) {
    logger.error('❌ PostgreSQL connection error:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  try {
    await prisma.$disconnect();
    logger.info('✅ Disconnected from PostgreSQL');
  } catch (error) {
    logger.error('❌ PostgreSQL disconnection error:', error);
  }
};

// Health check function
export const checkDatabaseConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error('❌ Database health check failed:', error);
    return false;
  }
};
