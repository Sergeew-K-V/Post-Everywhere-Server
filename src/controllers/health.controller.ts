import { Request, Response } from 'express';
import { getPrisma } from '../config/prisma';
import { env } from '../config/env';

/**
 * Health check endpoint
 */
export async function healthCheck(req: Request, res: Response): Promise<void> {
  try {
    // Test database connection
    const prisma = getPrisma();
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Server is unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
