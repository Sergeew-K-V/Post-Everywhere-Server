import { Router } from 'express';
import { validateRequest } from '../middleware/validation';
import { registerSchema, loginSchema } from '../schemas/auth';
import { register, login } from '../controllers';

const router = Router();

// Register user
router.post('/register', validateRequest(registerSchema), register);

// Login user
router.post('/login', validateRequest(loginSchema), login);

export { router as authRouter };
