import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const connectDatabase = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/{{ projectName }}';
    await mongoose.connect(mongoUri);
  } catch (error) {
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    logger.info('✅ Disconnected from MongoDB');
  } catch (error) {
    logger.error('❌ MongoDB disconnection error:', error);
  }
};
