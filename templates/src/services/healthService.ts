import { HTTP_CODES } from '../constants/http-codes';
import { HealthResponse, HealthStatus } from '../types/health';
import { ServiceResult } from '../types/service-result';
import { logger } from '../utils/logger';
{% if database and databaseType == "MongoDB" %}import mongoose from 'mongoose';
{% endif %}{% if database and databaseType == "PostgreSQL (Prisma ORM)" %}import { prisma } from '../config/database';
{% endif %}{% if redis %}import redis from '../config/redis';
{% endif %}

const serverStartTime = Date.now();

function formatUptime(uptimeSeconds: number): string {
  const days = Math.floor(uptimeSeconds / 86400);
  const hours = Math.floor((uptimeSeconds % 86400) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(' ');
}

{% if database or redis %}type CheckStatus = { ok: boolean; responseTime?: number; error?: string };

{% if database and databaseType == "MongoDB" %}async function checkDatabase(): Promise<CheckStatus> {
  const startTime = Date.now();
  try {
    if (mongoose.connection.readyState !== 1) {
      return { ok: false, error: 'Mongoose not connected' };
    }
    await mongoose.connection.db?.admin().ping();
    return { ok: true, responseTime: Date.now() - startTime };
  } catch (error) {
    return {
      ok: false,
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Database check failed',
    };
  }
}
{% endif %}{% if database and databaseType == "PostgreSQL (Prisma ORM)" %}async function checkDatabase(): Promise<CheckStatus> {
  const startTime = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true, responseTime: Date.now() - startTime };
  } catch (error) {
    return {
      ok: false,
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Database check failed',
    };
  }
}
{% endif %}{% if redis %}async function checkRedis(): Promise<CheckStatus> {
  const startTime = Date.now();
  try {
    await redis.ping();
    return { ok: true, responseTime: Date.now() - startTime };
  } catch (error) {
    return {
      ok: false,
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Redis check failed',
    };
  }
}
{% endif %}{% endif %}

export const healthService = {
  async getHealth(version: string): Promise<ServiceResult<HealthResponse>> {
    const logTag = '[healthService][getHealth]';
    logger.info(`${logTag} Performing health checks`);

    const uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000);
    const uptimeFormatted = formatUptime(uptimeSeconds);
{% if database or redis %}
    const [{% if database %}databaseStatus{% endif %}{% if database and redis %}, {% endif %}{% if redis %}redisStatus{% endif %}] = await Promise.all([
{% if database %}      checkDatabase(),
{% endif %}{% if redis %}      checkRedis(),
{% endif %}    ]);

    const allHealthy = {% if database %}databaseStatus.ok{% endif %}{% if database and redis %} && {% endif %}{% if redis %}redisStatus.ok{% endif %};
{% else %}
    const allHealthy = true;
{% endif %}
    const overallStatus: HealthStatus = allHealthy ? 'healthy' : 'unhealthy';

    const healthResponse: HealthResponse = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: uptimeSeconds,
      uptimeFormatted,
      version,
      environment: process.env.NODE_ENV || 'development',
    };

    if (!allHealthy) {
      return {
        ok: false,
        code: HTTP_CODES.SERVICE_UNAVAILABLE,
        message: 'Service Unavailable',
        data: healthResponse,
      };
    }

    return {
      ok: true,
      code: HTTP_CODES.OK,
      message: 'Service is healthy',
      data: healthResponse,
    };
  },
};
