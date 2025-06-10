// Conditional Prisma import for static export compatibility
let PrismaClient: any

try {
  // Dynamic import to prevent build issues
  if (typeof window === 'undefined') {
    PrismaClient = require('@prisma/client').PrismaClient
  }
} catch (error) {
  console.warn('Prisma client not available in static build')
}

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  (PrismaClient ? new PrismaClient() : null)

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma
} 