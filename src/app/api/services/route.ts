import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { serviceQuerySchema, createServiceSchema } from "@/lib/validations/service"
import { getCurrentUser } from "@/lib/auth"

// GET /api/services - List services with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = serviceQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
      categoryId: searchParams.get("categoryId"),
      featured: searchParams.get("featured"),
      active: searchParams.get("active"),
      sort: searchParams.get("sort"),
      order: searchParams.get("order"),
    })

    const offset = (query.page - 1) * query.limit

    // Build where conditions
    const where: any = {}
    
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
        { content: { contains: query.search, mode: "insensitive" } },
      ]
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId
    }

    if (query.featured !== undefined) {
      where.isFeatured = query.featured
    }

    if (query.active !== undefined) {
      where.isActive = query.active
    }

    // Build order by
    const orderBy: any = {}
    orderBy[query.sort] = query.order

    // Get services with pagination
    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy,
        skip: offset,
        take: query.limit,
      }),
      prisma.service.count({ where }),
    ])

    const totalPages = Math.ceil(total / query.limit)

    return NextResponse.json({
      success: true,
      data: services,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error("[SERVICES_GET]", error)
    return NextResponse.json(
      {
        success: false,
        error: "Hizmetler alınırken hata oluştu",
      },
      { status: 500 }
    )
  }
}

// POST /api/services - Create new service (Admin only)
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
    const validatedData = createServiceSchema.parse(body)

    // Check if slug already exists
    const existingService = await prisma.service.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existingService) {
      return NextResponse.json(
        {
          success: false,
          error: "Bu slug zaten kullanılıyor",
        },
        { status: 409 }
      )
    }

    // Check if category exists
    const category = await prisma.serviceCategory.findUnique({
      where: { id: validatedData.categoryId },
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

    // Create service
    const service = await prisma.service.create({
      data: validatedData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: service,
      message: "Hizmet başarıyla oluşturuldu",
    })
  } catch (error) {
    console.error("[SERVICES_POST]", error)
    
    if (error instanceof Error && error.message.includes("validation")) {
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
        error: "Hizmet oluşturulurken hata oluştu",
      },
      { status: 500 }
    )
  }
} 