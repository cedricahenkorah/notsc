{% if redis %}import IORedis from 'ioredis';
import { logger } from '../utils/logger';

const redisConnection = new IORedis({
  maxRetriesPerRequest: null,
  port: process.env.REDIS_PORT
    ? parseInt(process.env.REDIS_PORT, 10)
    : undefined,
  host: process.env.REDIS_HOST || 'localhost',
  password: process.env.REDIS_PASSWORD || undefined,
  db: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB, 10) : 0,
});

redisConnection.on('connect', () => {
  logger.info('✅ Connected to Redis');
});

redisConnection.on('error', (err) => {
  logger.error('❌ Redis connection error:', err);
});

redisConnection.on('close', () => {
  logger.info('🔌 Redis connection closed');
});

export const connectRedis = async () => {
  try {
    await redisConnection.ping();
  } catch (error) {
    process.exit(1);
  }
};

export const getRedisClient = () => redisConnection;

export const disconnectRedis = async () => {
  try {
    await redisConnection.quit();
    logger.info('✅ Disconnected from Redis');
  } catch (error) {
    logger.error('❌ Redis disconnection error:', error);
  }
};

export default redisConnection;
{% else %}export const connectRedis = async () => {
  console.log('Redis connection not configured');
};
{% endif %}
