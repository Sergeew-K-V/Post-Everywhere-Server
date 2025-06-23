// Test environment configuration - no validation
export const env = {
  NODE_ENV: 'test' as const,
  PORT: 8080,
  DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
  JWT_SECRET: 'test-secret',
  JWT_EXPIRES_IN: '7d',
  CORS_ORIGIN: 'http://localhost:3000',
  LOG_LEVEL: 'info' as const,
  ENABLE_LOGGING: true,
};

export type Env = typeof env;
