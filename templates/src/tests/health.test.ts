import request from 'supertest';
import express from 'express';
import { getHealth } from '../../controllers/healthController';

const app = express();
app.use(express.json());
app.get('/health', getHealth);

describe('Health Controller', () => {
  it('should return health status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body.status).toBe('OK');
  });
});
