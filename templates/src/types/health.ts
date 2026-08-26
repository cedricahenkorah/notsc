export type HealthStatus = 'healthy' | 'unhealthy';

export interface HealthResponse {
  status: HealthStatus;
  timestamp: string;
  uptime: number;
  uptimeFormatted: string;
  version: string;
  environment: string;
}
