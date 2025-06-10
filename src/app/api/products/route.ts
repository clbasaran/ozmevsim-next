import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { productQuerySchema, createProductSchema } from "@/lib/validations/product"
import { getCurrentUser } from "@/lib/auth"

// GET /api/products - List products with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = productQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
      categoryId: searchParams.get("categoryId"),
      brand: searchParams.get("brand"),
      featured: searchParams.get("featured"),
      new: searchParams.get("new"),
      available: searchParams.get("available"),
      active: searchParams.get("active"),
      hasPrice: searchParams.get("hasPrice"),
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
        { brand: { contains: query.search, mode: "insensitive" } },
        { model: { contains: query.search, mode: "insensitive" } },
        { sku: { contains: query.search, mode: "insensitive" } },
      ]
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId
    }

    if (query.brand) {
      where.brand = { contains: query.brand, mode: "insensitive" }
    }

    if (query.featured !== undefined) {
      where.isFeatured = query.featured
    }

    if (query.new !== undefined) {
      where.isNew = query.new
    }

    if (query.available !== undefined) {
      where.isAvailable = query.available
    }

    if (query.active !== undefined) {
      where.isActive = query.active
    }

    if (query.hasPrice !== undefined) {
      where.hasPrice = query.hasPrice
    }

    // Build order by
    const orderBy: any = {}
    orderBy[query.sort] = query.order

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
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
      prisma.product.count({ where }),
    ])

    const totalPages = Math.ceil(total / query.limit)

    return NextResponse.json({
      success: true,
      data: products,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPrevPage: query.page > 1,
      },
    })
  } catch (error) {
    console.error("[PRODUCTS_GET]", error)
    return NextResponse.json(
      {
        success: false,
        error: "Ürünler alınırken hata oluştu",
      },
      { status: 500 }
    )
  }
}

// POST /api/products - Create new product (Admin only)
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
    const validatedData = createProductSchema.parse(body)

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          error: "Bu slug zaten kullanılıyor",
        },
        { status: 409 }
      )
    }

    // Check if SKU already exists (if provided)
    if (validatedData.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku: validatedData.sku },
      })

      if (existingSku) {
        return NextResponse.json(
          {
            success: false,
            error: "Bu SKU zaten kullanılıyor",
          },
          { status: 409 }
        )
      }
    }

    // Check if category exists
    const category = await prisma.productCategory.findUnique({
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

    // Create product
    const { name, ...productData } = validatedData
    const product = await prisma.product.create({
      data: {
        ...productData,
        title: name,
      },
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
      data: product,
      message: "Ürün başarıyla oluşturuldu",
    })
  } catch (error) {
    console.error("[PRODUCTS_POST]", error)
    
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
        error: "Ürün oluşturulurken hata oluştu",
      },
      { status: 500 }
    )
  }
} 