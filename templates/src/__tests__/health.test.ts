import request from 'supertest';
import express from 'express';
import { getHealth } from '../controllers/healthController';

const app = express();
app.use(express.json());
app.get('/health', getHealth);

describe('Health Controller', () => {
  it('should return a wrapped api response', async () => {
    const response = await request(app).get('/health');

    expect([200, 503]).toContain(response.status);
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('code');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('timestamp');
    expect(response.body.data).toHaveProperty('uptime');
  });
});
