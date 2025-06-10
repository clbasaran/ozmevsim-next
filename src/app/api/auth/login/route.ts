import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateTokens, verifyPassword } from "@/lib/auth"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: "Geçersiz e-posta veya şifre",
        },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Geçersiz e-posta veya şifre",
        },
        { status: 401 }
      )
    }

    // Check if user has admin/editor role
    if (user.role !== "ADMIN" && user.role !== "EDITOR") {
      return NextResponse.json(
        {
          success: false,
          error: "Bu hesapla admin paneline erişim yetkiniz yok",
        },
        { status: 403 }
      )
    }

    // Generate tokens
    const { token: accessToken, refreshToken } = generateTokens(user.id)

    // Get request metadata
    const userAgent = request.headers.get("user-agent")
    const forwardedFor = request.headers.get("x-forwarded-for")
    const realIp = request.headers.get("x-real-ip")
    const ipAddress = forwardedFor || realIp || "unknown"

    // Create session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        userAgent: userAgent || "unknown",
        ipAddress,
      },
    })

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    // Set HTTP-only cookies
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    })

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[AUTH_LOGIN]", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Geçersiz veri formatı",
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Giriş işlemi sırasında hata oluştu",
      },
      { status: 500 }
    )
  }
} 