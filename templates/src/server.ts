import 'dotenv/config';
import http from 'http';
import app from './app';
{% if database %}import mongoose from 'mongoose';
import { connectDatabase } from './config/database';
{% endif %}{% if redis %}import { connectRedis } from './config/redis';
{% endif %}import { logger } from './utils/logger';

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

{% if database %}mongoose.connection.once('open', () => {
  logger.info('MongoDB connection ready');
});

mongoose.connection.on('error', (err: any) => {
  logger.error('MongoDB connection error', err);
});
{% endif %}

async function startServer() {
  try {
    {% if database %}connectDatabase();
    {% endif %}{% if redis %}await connectRedis();
    {% endif %}server.listen(PORT, () => {
      logger.info(`🚀 {{ projectName }} is running on port ${PORT}`);
      {% if swagger %}logger.info(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
      {% endif %}});
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
