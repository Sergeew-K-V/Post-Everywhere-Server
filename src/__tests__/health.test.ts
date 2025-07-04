import request from 'supertest';
import express from 'express';
import { healthRouter } from '../routes/health.route';

// Mock the Prisma module
jest.mock('../config/prisma', () => ({
  getPrisma: jest.fn(() => ({
    $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
  })),
}));

const app = express();
app.use('/health', healthRouter);

describe('Health Endpoint', () => {
  it('should return 200 and health status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Server is healthy');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('environment');
  });
});
