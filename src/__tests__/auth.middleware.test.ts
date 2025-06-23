import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { getPrisma } from '../config/prisma';

// Mock Prisma
jest.mock('../config/prisma');
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
  },
};

(getPrisma as jest.Mock).mockReturnValue(mockPrisma);

const app = express();
app.use(express.json());

// Test routes
app.get('/protected', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

app.get('/optional', optionalAuth, (req, res) => {
  res.json({
    success: true,
    user: req.user || null,
  });
});

describe('Auth Middleware', () => {
  const jwtSecret = 'test-secret';
  let validToken: string;
  let invalidToken: string;

  beforeAll(() => {
    // Create valid token
    validToken = jwt.sign({ userId: 1, email: 'test@example.com' }, jwtSecret);

    // Create invalid token
    invalidToken = jwt.sign(
      { userId: 1, email: 'test@example.com' },
      'wrong-secret'
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticateToken', () => {
    it('should allow access with valid token', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
      });

      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toEqual({
        id: 1,
        email: 'test@example.com',
      });
    });

    it('should reject request without token', async () => {
      const response = await request(app).get('/protected').expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Access token required');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Invalid or expired token');
    });

    it('should reject request with malformed token', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Invalid or expired token');
    });

    it('should reject request when user not found in database', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('User not found');
    });

    it('should reject request with wrong authorization format', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', validToken) // Missing 'Bearer '
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Access token required');
    });
  });

  describe('optionalAuth', () => {
    it('should allow access with valid token', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
      });

      const response = await request(app)
        .get('/optional')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toEqual({
        id: 1,
        email: 'test@example.com',
      });
    });

    it('should allow access without token', async () => {
      const response = await request(app).get('/optional').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeNull();
    });

    it('should allow access with invalid token', async () => {
      const response = await request(app)
        .get('/optional')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeNull();
    });

    it('should allow access when user not found in database', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get('/optional')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeNull();
    });
  });
});
