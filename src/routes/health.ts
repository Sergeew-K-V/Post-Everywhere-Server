import { Router, Request, Response } from 'express';
import { getPool } from '../config/database';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    // Test database connection
    const pool = getPool();
    const client = await pool.connect();
    client.release();

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
});

export const healthRouter = router; 