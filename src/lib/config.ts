// Configuration and environment variables
export const config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-minimum-32-characters-long',
    expiresIn: '24h'
  },
  app: {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production'
  },
  database: {
    url: process.env.DATABASE_URL || 'file:./dev.db'
  },
  security: {
    cookieSecure: process.env.NODE_ENV === 'production',
    cookieSameSite: 'lax' as const,
    cookieHttpOnly: true,
    maxAge: 60 * 60 * 24 // 24 hours
  }
}

// Validate required environment variables
export function validateConfig() {
  const required = ['JWT_SECRET']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0 && config.app.isProduction) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

