import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import type { User, Session } from '@/lib/types';

// JWT Configuration
const JWT_SECRET = (process.env.JWT_SECRET || 'fallback-secret-key-for-development') as string;
const JWT_REFRESH_SECRET = (process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key-for-development') as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// JWT Token utilities
export function generateTokens(userId: string) {
  const payload = { userId, type: 'access' };
  const refreshPayload = { userId, type: 'refresh' };

  const token = (jwt.sign as any)(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = (jwt.sign as any)(refreshPayload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });

  return { token, refreshToken };
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const payload = (jwt.verify as any)(token, JWT_SECRET) as JwtPayload;
    if (payload.type !== 'access') return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): { userId: string } | null {
  try {
    const payload = (jwt.verify as any)(token, JWT_REFRESH_SECRET) as JwtPayload;
    if (payload.type !== 'refresh') return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

// Session management
export async function createSession(
  userId: string, 
  userAgent?: string, 
  ipAddress?: string
): Promise<Session> {
  const { token, refreshToken } = generateTokens(userId);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  const session = await prisma.session.create({
    data: {
      userId,
      token,
      refreshToken,
      expiresAt,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
    },
  });

  // Set cookies
  const cookieStore = cookies();
  cookieStore.set('access-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60, // 15 minutes
  });

  cookieStore.set('refresh-token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return session;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('access-token')?.value;

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const session = await prisma.session.findFirst({
    where: {
      token,
      expiresAt: { gt: new Date() },
    },
  });

  return session;
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      isActive: true,
      twoFAEnabled: true,
      createdAt: true,
      updatedAt: true,
      lastLogin: true,
    },
  });

  return user;
}

export async function refreshTokens(): Promise<{ token: string; refreshToken: string } | null> {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('refresh-token')?.value;

  if (!refreshToken) return null;

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) return null;

  // Find session with refresh token
  const session = await prisma.session.findFirst({
    where: {
      refreshToken,
      expiresAt: { gt: new Date() },
    },
  });

  if (!session) return null;

  // Generate new tokens
  const newTokens = generateTokens(session.userId);

  // Update session
  await prisma.session.update({
    where: { id: session.id },
    data: {
      token: newTokens.token,
      refreshToken: newTokens.refreshToken,
    },
  });

  // Update cookies
  cookieStore.set('access-token', newTokens.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60,
  });

  cookieStore.set('refresh-token', newTokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
  });

  return newTokens;
}

export async function destroySession(): Promise<void> {
  const session = await getSession();
  if (session) {
    await prisma.session.delete({
      where: { id: session.id },
    });
  }

  const cookieStore = cookies();
  cookieStore.delete('access-token');
  cookieStore.delete('refresh-token');
}

// Authentication middleware for pages
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user || !user.isActive) {
    redirect('/admin/login');
  }
  return user;
}

export async function requireRole(role: 'ADMIN' | 'EDITOR'): Promise<User> {
  const user = await requireAuth();
  if (user.role === 'USER' || (role === 'ADMIN' && user.role !== 'ADMIN')) {
    redirect('/admin/unauthorized');
  }
  return user;
}

// User registration and login
export async function registerUser(email: string, password: string, name: string): Promise<User> {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Bu e-posta adresi zaten kayıtlı');
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'USER',
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      isActive: true,
      twoFAEnabled: true,
      createdAt: true,
      updatedAt: true,
      lastLogin: true,
    },
  });

  return user;
}

export async function loginUser(
  email: string, 
  password: string, 
  userAgent?: string, 
  ipAddress?: string
): Promise<{ user: User; session: Session }> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.isActive) {
    throw new Error('E-posta veya şifre hatalı');
  }

  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    throw new Error('E-posta veya şifre hatalı');
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  // Create session
  const session = await createSession(user.id, userAgent, ipAddress);

  const { password: _, ...userWithoutPassword } = user;

  return { 
    user: userWithoutPassword as User, 
    session 
  };
}

// IP and User-Agent helpers
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

export function getUserAgent(request: Request): string {
  return request.headers.get('user-agent') || 'unknown';
} 