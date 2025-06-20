import request from 'supertest';
import express from 'express';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';

const app = express();
app.use(express.json());

// Test schema
const testSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
  }),
});

// Test route
app.post('/test', validateRequest(testSchema), (req, res) => {
  res.json({ success: true, data: req.body });
});

describe('Zod Validation Middleware', () => {
  it('should pass validation with valid data', async () => {
    const response = await request(app).post('/test').send({
      name: 'John Doe',
      email: 'john@example.com',
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should fail validation with invalid email', async () => {
    const response = await request(app).post('/test').send({
      name: 'John Doe',
      email: 'invalid-email',
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toBe('Validation failed');
    expect(response.body.error.details).toHaveLength(1);
    expect(response.body.error.details[0].field).toBe('body.email');
  });

  it('should fail validation with short name', async () => {
    const response = await request(app).post('/test').send({
      name: 'J',
      email: 'john@example.com',
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toBe('Validation failed');
    expect(response.body.error.details).toHaveLength(1);
    expect(response.body.error.details[0].field).toBe('body.name');
  });
});
