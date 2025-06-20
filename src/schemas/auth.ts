import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters long')
      .max(50, 'Username must be less than 50 characters')
      .trim(),
    email: z.string().email('Invalid email format').toLowerCase().trim(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .max(100, 'Password must be less than 100 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format').toLowerCase().trim(),
    password: z.string().min(1, 'Password is required'),
  }),
});
