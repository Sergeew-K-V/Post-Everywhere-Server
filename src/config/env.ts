import { cleanEnv, str, port, url, bool } from 'envalid';

export const env = cleanEnv(process.env, {
  // Server configuration
  NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
  PORT: port({ default: 8080 }),

  // Database configuration
  DATABASE_URL: str(),

  // JWT configuration
  JWT_SECRET: str(),
  JWT_EXPIRES_IN: str({ default: '7d' }),

  // CORS configuration
  CORS_ORIGIN: url({ default: 'http://localhost:3000' }),

  // Optional configurations
  LOG_LEVEL: str({
    choices: ['error', 'warn', 'info', 'debug'],
    default: 'info',
  }),
  ENABLE_LOGGING: bool({ default: true }),
});

export type Env = typeof env;
