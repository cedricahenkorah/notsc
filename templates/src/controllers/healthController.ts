import { Request, Response } from 'express';
import { healthService } from '../services/healthService';
import { apiResponse } from '../utils/api-response';

// TODO: Find a better way to expose the version without reading package.json directly
const version = require('../../package.json').version;

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Get health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *       503:
 *         description: Service is unhealthy
 */
export async function getHealth(req: Request, res: Response) {
  const result = await healthService.getHealth(version);
  return apiResponse(res, result);
}
