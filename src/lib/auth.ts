import { compare, hash } from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { config } from './config'

const JWT_SECRET = new TextEncoder().encode(config.jwt.secret)

export interface JWTPayload {
  userId: string
  email: string
  role: string
  [key: string]: any
}

// Hash password for storage
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

// Verify password against hash
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

// Create JWT token
export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(config.jwt.expiresIn)
    .sign(JWT_SECRET)
}

// Verify JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as JWTPayload
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

// Get current user from request
export async function getCurrentUser(request: NextRequest): Promise<JWTPayload | null> {
  const token = request.cookies.get('auth-token')?.value
  
  if (!token) {
    return null
  }

  return verifyToken(token)
}

// Get current user from cookies (server component)
export async function getCurrentUserFromCookies(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  
  if (!token) {
    return null
  }

  return verifyToken(token)
}

