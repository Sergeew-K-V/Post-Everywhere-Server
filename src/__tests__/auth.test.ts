import request from 'supertest';
import express from 'express';
import bcrypt from 'bcryptjs';
import { authRouter } from '../routes/auth';
import { errorHandler } from '../middleware/errorHandler';
import { getPrisma } from '../config/prisma';

// Mock Prisma
jest.mock('../config/prisma');
const mockPrisma = {
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

(getPrisma as jest.Mock).mockReturnValue(mockPrisma);

const app = express();
app.use(express.json());
app.use('/auth', authRouter);
app.use(errorHandler);

describe('Auth Endpoints', () => {
  let validPasswordHash: string;

  beforeAll(async () => {
    // Create a valid password hash for testing
    validPasswordHash = await bcrypt.hash('password123', 12);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    const validUserData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should register a new user successfully', async () => {
      // Mock that user doesn't exist
      mockPrisma.user.findFirst.mockResolvedValue(null);

      // Mock user creation
      mockPrisma.user.create.mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/auth/register')
        .send(validUserData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.username).toBe('testuser');
      expect(response.body.data.email).toBe('test@example.com');
    });

    it('should return 409 if user already exists', async () => {
      // Mock that user already exists
      mockPrisma.user.findFirst.mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      });

      const response = await request(app)
        .post('/auth/register')
        .send(validUserData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('User already exists');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          ...validUserData,
          email: 'invalid-email',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should validate password length', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          ...validUserData,
          password: '123',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /auth/login', () => {
    const validLoginData = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login user successfully', async () => {
      // Mock user exists with hashed password
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: validPasswordHash,
      });

      const response = await request(app)
        .post('/auth/login')
        .send(validLoginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe('test@example.com');
    });

    it('should return 401 for non-existent user', async () => {
      // Mock that user doesn't exist
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/auth/login')
        .send(validLoginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Invalid credentials');
    });

    it('should return 401 for wrong password', async () => {
      // Mock user exists but with different password hash
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: validPasswordHash,
      });

      const response = await request(app)
        .post('/auth/login')
        .send({
          ...validLoginData,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Invalid credentials');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          ...validLoginData,
          email: 'invalid-email',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
