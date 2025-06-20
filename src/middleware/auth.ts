import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getPrisma } from '../config/prisma';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}

export interface AuthRequest extends Request {
  user: {
    id: number;
    email: string;
  };
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        error: { message: 'Access token required' },
      });
      return;
    }

    const jwtSecret: string = process.env.JWT_SECRET || 'fallback-secret';

    try {
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      // Verify user still exists in database
      const prisma = getPrisma();
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true },
      });

      if (!user) {
        res.status(401).json({
          success: false,
          error: { message: 'User not found' },
        });
        return;
      }

      // Add user to request object
      req.user = {
        id: user.id,
        email: user.email,
      };

      next();
    } catch (jwtError) {
      res.status(403).json({
        success: false,
        error: { message: 'Invalid or expired token' },
      });
      return;
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
    return;
  }
};

// Optional authentication middleware - doesn't fail if no token provided
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      next();
      return;
    }

    const jwtSecret: string = process.env.JWT_SECRET || 'fallback-secret';

    try {
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      const prisma = getPrisma();
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true },
      });

      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
        };
      }

      next();
    } catch (jwtError) {
      // Token is invalid, but we continue without authentication
      next();
    }
  } catch (error) {
    console.error('Optional authentication error:', error);
    next();
  }
};
