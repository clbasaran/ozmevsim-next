/// <reference types="@cloudflare/workers-types" />

// Cloudflare Pages Function types
export interface PagesFunction<Env = Record<string, unknown>, Data extends string = string> {
  (context: EventContext<Env, Data, any>): Promise<Response> | Response
}

export interface EventContext<Env, Data extends string, CfProperties extends Record<string, unknown>> {
  request: Request
  env: Env
  params: Record<Data, string>
  waitUntil: (promise: Promise<any>) => void
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>
  data: Record<string, unknown>
  functionPath: string
}

// Environment interface for our application
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

// Extend global types
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

// JWT Payload types
export interface JWTPayload {
  userId: string
  type: 'access' | 'refresh'
  iat?: number
  exp?: number
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// User types
export interface User {
  id: string
  email: string
  name: string | null
  role: string
  isActive: boolean
  lastLogin?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface UserWithoutPassword extends Omit<User, 'password'> {}

// Session types
export interface Session {
  id: string
  userId: string
  token: string
  refreshToken: string
  expiresAt: Date
  userAgent: string | null
  ipAddress: string | null
  isValid: boolean
  createdAt: Date
  updatedAt: Date
} 