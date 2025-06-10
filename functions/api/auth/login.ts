import { CloudflareEnv, initializeCloudflareServices } from '../../../src/lib/cloudflare-db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  user?: {
    id: string
    email: string
    name: string | null
    role: string
  }
  tokens?: {
    accessToken: string
    refreshToken: string
  }
  error?: string
}

export const onRequestPost: PagesFunction<CloudflareEnv> = async (context) => {
  const { request, env } = context
  
  try {
    // Initialize services
    const { prisma } = initializeCloudflareServices(env)
    
    // Parse request body
    const body = await request.json() as LoginRequest
    const { email, password } = body
    
    // Validate input
    if (!email || !password) {
      return new Response(JSON.stringify({
        success: false,
        error: 'E-posta ve şifre gereklidir'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        isActive: true,
      }
    })
    
    if (!user || !user.isActive) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Geçersiz kullanıcı adı veya şifre'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Geçersiz kullanıcı adı veya şifre'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Generate JWT tokens
    const tokenPayload = { userId: user.id, type: 'access' }
    const refreshPayload = { userId: user.id, type: 'refresh' }
    
    const accessToken = jwt.sign(tokenPayload, env.JWT_SECRET, { expiresIn: '15m' })
    const refreshToken = jwt.sign(refreshPayload, env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
    
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })
    
    // Create session record
    await prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        userAgent: request.headers.get('user-agent') || null,
        ipAddress: request.headers.get('cf-connecting-ip') || null,
      }
    })
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user
    
    const response: LoginResponse = {
      success: true,
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken
      }
    }
    
    // Set HTTP-only cookies
    const accessCookie = `access-token=${accessToken}; HttpOnly; Secure; SameSite=Lax; Max-Age=900; Path=/`
    const refreshCookie = `refresh-token=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Max-Age=604800; Path=/`
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `${accessCookie}, ${refreshCookie}`,
        'Access-Control-Allow-Origin': 'https://ozmevsim.com',
        'Access-Control-Allow-Credentials': 'true',
      }
    })
    
  } catch (error) {
    console.error('Login error:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Sunucu hatası oluştu'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Handle OPTIONS for CORS
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://ozmevsim.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    }
  })
} 