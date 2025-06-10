import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function rateLimit(identifier: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now()
  const windowStart = now - windowMs
  
  // Clean old entries
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < windowStart) {
      rateLimitStore.delete(key)
    }
  }
  
  const current = rateLimitStore.get(identifier)
  
  if (!current || current.resetTime < windowStart) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (current.count >= limit) {
    return false
  }
  
  current.count += 1
  return true
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get client IP for rate limiting
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const clientIp = forwardedFor?.split(',')[0] || realIp || 'unknown'
  
  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    // Different limits for different endpoints
    let limit = 100 // Default limit per minute
    
    if (pathname.startsWith('/api/auth/')) {
      limit = 10 // Stricter for auth endpoints
    } else if (pathname.startsWith('/api/contact')) {
      limit = 5 // Very strict for contact form
    }
    
    if (!rateLimit(clientIp, limit)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Çok fazla istek gönderiyorsunuz. Lütfen bir dakika bekleyin.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      )
    }
  }
  
  // Admin panel authentication check
  if (pathname.startsWith('/admin')) {
    // Skip login page
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }
    
    try {
      const user = await getCurrentUser()
      
      if (!user) {
        const loginUrl = new URL('/admin/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }
      
      if (user.role !== 'ADMIN' && user.role !== 'EDITOR') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (error) {
      console.error('Middleware auth error:', error)
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  // Security headers
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // CSP Header
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://www.google-analytics.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', cspHeader)
  
  return response
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|icons/).*)',
    // Always run for API routes
    '/api/:path*',
    // Always run for admin routes
    '/admin/:path*',
  ],
} 