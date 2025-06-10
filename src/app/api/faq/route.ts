import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

// GET /api/faq - List FAQ items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")
    const search = searchParams.get("search")
    const limit = parseInt(searchParams.get("limit") || "50")

    // Build where conditions
    const where: any = {
      isActive: true,
    }
    
    if (categoryId) {
      where.categoryId = categoryId
    }

    if (search) {
      where.OR = [
        { question: { contains: search, mode: "insensitive" } },
        { answer: { contains: search, mode: "insensitive" } },
      ]
    }

    // Get FAQs with categories
    const faqs = await prisma.faq.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
      },
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
      take: limit,
    })

    // Get categories for filtering
    const categories = await prisma.faqCategory.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: {
            faqs: {
              where: { isActive: true },
            },
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        faqs,
        categories,
      },
    })
  } catch (error) {
    console.error("[FAQ_GET]", error)
    return NextResponse.json(
      {
        success: false,
        error: "SSS listesi alınırken hata oluştu",
      },
      { status: 500 }
    )
  }
}

// POST /api/faq - Create new FAQ item (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
      return NextResponse.json(
        {
          success: false,
          error: "Bu işlem için yetkiniz yok",
        },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Validate required fields
    if (!body.question || !body.answer || !body.categoryId) {
      return NextResponse.json(
        {
          success: false,
          error: "Soru, cevap ve kategori alanları zorunludur",
        },
        { status: 400 }
      )
    }

    // Check if category exists
    const category = await prisma.faqCategory.findUnique({
      where: { id: body.categoryId },
    })

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: "Kategori bulunamadı",
        },
        { status: 404 }
      )
    }

    // Create FAQ
    const faq = await prisma.faq.create({
      data: {
        question: body.question,
        answer: body.answer,
        categoryId: body.categoryId,
        order: body.order || 0,
        isActive: body.isActive ?? true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: faq,
      message: "SSS başarıyla oluşturuldu",
    })
  } catch (error) {
    console.error("[FAQ_POST]", error)
    return NextResponse.json(
      {
        success: false,
        error: "SSS oluşturulurken hata oluştu",
      },
      { status: 500 }
    )
  }
} 