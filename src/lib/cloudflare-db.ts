import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

// Types for Cloudflare Workers
declare global {
  interface PagesFunction<Env = Record<string, unknown>, Data extends string = string> {
    (context: EventContext<Env, Data, any>): Promise<Response> | Response
  }

  interface EventContext<Env, Data extends string, CfProperties extends Record<string, unknown>> {
    request: Request
    env: Env
    params: Record<Data, string>
    waitUntil: (promise: Promise<any>) => void
    next: (input?: Request | string, init?: RequestInit) => Promise<Response>
    data: Record<string, unknown>
    functionPath: string
  }
}

export interface CloudflareEnv {
  DB: D1Database
  BUCKET: R2Bucket
  CACHE: KVNamespace
  JWT_SECRET: string
  JWT_REFRESH_SECRET: string
  NODE_ENV: string
  NEXT_PUBLIC_APP_URL: string
  NEXT_PUBLIC_API_URL: string
}

// Cloudflare D1 Prisma Client Factory
export function createPrismaClient(env: CloudflareEnv) {
  const adapter = new PrismaD1(env.DB)
  return new PrismaClient({ 
    adapter,
    log: ['error', 'warn'],
  })
}

// Database utilities for Cloudflare Workers
export class CloudflareDatabase {
  private prisma: PrismaClient
  private env: CloudflareEnv

  constructor(env: CloudflareEnv) {
    this.env = env
    this.prisma = createPrismaClient(env)
  }

  // Get Prisma client
  getClient() {
    return this.prisma
  }

  // Health check
  async healthCheck() {
    try {
      await this.prisma.$queryRaw`SELECT 1`
      return { status: 'healthy', timestamp: new Date().toISOString() }
    } catch (error) {
      return { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      }
    }
  }

  // Close connection
  async disconnect() {
    await this.prisma.$disconnect()
  }
}

// Cache utilities
export class CloudflareCache {
  private kv: KVNamespace

  constructor(kv: KVNamespace) {
    this.kv = kv
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.kv.get(key, 'json')
    return value as T | null
  }

  async set(key: string, value: any, expirationTtl?: number) {
    const options = expirationTtl ? { expirationTtl } : undefined
    await this.kv.put(key, JSON.stringify(value), options)
  }

  async delete(key: string) {
    await this.kv.delete(key)
  }

  async deleteMany(prefix: string) {
    const list = await this.kv.list({ prefix })
    const deletePromises = list.keys.map(key => this.kv.delete(key.name))
    await Promise.all(deletePromises)
  }

  async list(prefix?: string) {
    return await this.kv.list({ prefix })
  }
}

// R2 Storage utilities
export class CloudflareStorage {
  private r2: R2Bucket

  constructor(r2: R2Bucket) {
    this.r2 = r2
  }

  async upload(key: string, data: ArrayBuffer | string, options?: {
    contentType?: string
    metadata?: Record<string, string>
  }) {
    return await this.r2.put(key, data, {
      httpMetadata: {
        contentType: options?.contentType || 'application/octet-stream',
      },
      customMetadata: options?.metadata,
    })
  }

  async download(key: string) {
    return await this.r2.get(key)
  }

  async delete(key: string) {
    return await this.r2.delete(key)
  }

  async list(options?: { prefix?: string; limit?: number }) {
    return await this.r2.list({
      prefix: options?.prefix,
      limit: options?.limit || 1000,
    })
  }

  async getPublicUrl(key: string) {
    // Public URL for Cloudflare R2
    return `https://pub-ozmevsim-media.r2.dev/${key}`
  }

  async getSignedUrl(key: string, expiresIn: number = 3600) {
    // For private files, implement signed URL logic
    // This would require R2 API credentials
    return this.getPublicUrl(key)
  }
}

// Utility function to initialize all services
export function initializeCloudflareServices(env: CloudflareEnv) {
  const database = new CloudflareDatabase(env)
  const cache = new CloudflareCache(env.CACHE)
  const storage = new CloudflareStorage(env.BUCKET)

  return {
    database,
    cache,
    storage,
    prisma: database.getClient(),
  }
}

// JWT utilities for Cloudflare Workers
export interface JWTPayload {
  userId: string
  type: 'access' | 'refresh'
  iat?: number
  exp?: number
}

// Authentication middleware
export async function verifyJWT(token: string, secret: string): Promise<JWTPayload | null> {
  try {
    // Import JWT library dynamically for Workers compatibility
    const jwt = await import('jsonwebtoken')
    const decoded = jwt.verify(token, secret) as JWTPayload
    return decoded
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

export async function signJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>, secret: string, expiresIn: string): Promise<string> {
  try {
    const jwt = await import('jsonwebtoken')
    return jwt.sign(payload, secret, { expiresIn })
  } catch (error) {
    console.error('JWT signing failed:', error)
    throw error
  }
}

// Rate limiting utility
export class RateLimiter {
  private cache: CloudflareCache
  private windowMs: number
  private max: number

  constructor(cache: CloudflareCache, windowMs: number = 900000, max: number = 100) {
    this.cache = cache
    this.windowMs = windowMs
    this.max = max
  }

  async isAllowed(key: string): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Date.now()
    const windowStart = now - this.windowMs
    const cacheKey = `rate_limit:${key}`
    
    const requests = await this.cache.get<number[]>(cacheKey) || []
    const validRequests = requests.filter(timestamp => timestamp > windowStart)
    
    const allowed = validRequests.length < this.max
    const remaining = Math.max(0, this.max - validRequests.length - (allowed ? 1 : 0))
    const resetTime = windowStart + this.windowMs
    
    if (allowed) {
      validRequests.push(now)
      await this.cache.set(cacheKey, validRequests, Math.ceil(this.windowMs / 1000))
    }
    
    return { allowed, remaining, resetTime }
  }
}

// Error handling utilities
export function createErrorResponse(error: string, status: number = 500) {
  return new Response(JSON.stringify({
    success: false,
    error
  }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

export function createSuccessResponse(data: any, message?: string) {
  return new Response(JSON.stringify({
    success: true,
    data,
    message
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
} 