import { NextRequest, NextResponse } from "next/server"
import { destroySession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await destroySession()

    const response = NextResponse.json({
      success: true,
      message: "Başarıyla çıkış yapıldı",
    })

    // Clear cookies
    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    })

    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[AUTH_LOGOUT]", error)
    return NextResponse.json(
      {
        success: false,
        error: "Çıkış işlemi sırasında hata oluştu",
      },
      { status: 500 }
    )
  }
} 