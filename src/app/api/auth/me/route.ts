import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Oturum bulunamadı",
        },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    console.error("[AUTH_ME]", error)
    return NextResponse.json(
      {
        success: false,
        error: "Kullanıcı bilgileri alınırken hata oluştu",
      },
      { status: 500 }
    )
  }
} 