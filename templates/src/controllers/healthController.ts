import { Request, Response } from 'express';
import { getHealthStatus } from '../services/healthService';
import { successResponse, errorResponse } from '../utils/api-response';

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Get health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 code:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                     timestamp:
 *                       type: string
 *                     uptime:
 *                       type: number
 *                     environment:
 *                       type: string
 */
export const getHealth = async (req: Request, res: Response) => {
  try {
    const health = await getHealthStatus();
    successResponse(res, 200, 'Health check successful', health);
  } catch (error) {
    errorResponse(res, 500, 'Health check failed');
  }
};
