import { Request, Response } from 'express';
import { getPrisma } from '../config/prisma';

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
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Server is unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
