import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { blogPostQuerySchema, createBlogPostSchema } from "@/lib/validations/blog"
import { getCurrentUser } from "@/lib/auth"

// GET /api/blog - List blog posts with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = blogPostQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
      categoryId: searchParams.get("categoryId"),
      tagId: searchParams.get("tagId"),
      authorId: searchParams.get("authorId"),
      status: searchParams.get("status"),
      featured: searchParams.get("featured"),
      pinned: searchParams.get("pinned"),
      active: searchParams.get("active"),
      sort: searchParams.get("sort"),
      order: searchParams.get("order"),
      dateFrom: searchParams.get("dateFrom"),
      dateTo: searchParams.get("dateTo"),
    })

    const offset = (query.page - 1) * query.limit

    // Build where conditions
    const where: any = {}
    
    // Only show published posts for public API calls
    // Admin API will have separate endpoints
    where.status = "PUBLISHED"
    where.isActive = true

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { excerpt: { contains: query.search, mode: "insensitive" } },
        { content: { contains: query.search, mode: "insensitive" } },
      ]
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId
    }

    if (query.featured !== undefined) {
      where.isFeatured = query.featured
    }

    if (query.pinned !== undefined) {
      where.isPinned = query.pinned
    }

    if (query.dateFrom || query.dateTo) {
      where.publishedAt = {}
      if (query.dateFrom) {
        where.publishedAt.gte = new Date(query.dateFrom)
      }
      if (query.dateTo) {
        where.publishedAt.lte = new Date(query.dateTo)
      }
    }

    // Build order by
    const orderBy: any = {}
    if (query.sort === "publishedAt") {
      orderBy.publishedAt = query.order
    } else {
      orderBy[query.sort] = query.order
    }

    // Get posts with pagination
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true,
            },
          },
        },
        orderBy,
        skip: offset,
        take: query.limit,
      }),
      prisma.blogPost.count({ where }),
    ])

    const totalPages = Math.ceil(total / query.limit)

    return NextResponse.json({
      success: true,
      data: posts,
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
    console.error("[BLOG_GET]", error)
    return NextResponse.json(
      {
        success: false,
        error: "Blog yazıları alınırken hata oluştu",
      },
      { status: 500 }
    )
  }
}

// POST /api/blog - Create new blog post (Admin only)
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
    const validatedData = createBlogPostSchema.parse({
      ...body,
      authorId: user.id,
    })

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existingPost) {
      return NextResponse.json(
        {
          success: false,
          error: "Bu slug zaten kullanılıyor",
        },
        { status: 409 }
      )
    }

    // Check if category exists
    const category = await prisma.blogCategory.findUnique({
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

    // Calculate reading time (basic estimation: ~200 words per minute)
    const wordCount = validatedData.content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    // Create blog post
    const post = await prisma.blogPost.create({
      data: {
        ...validatedData,
        readTime: readingTime,
        publishedAt: validatedData.status === "PUBLISHED" ? new Date() : undefined,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Create tag relationships if provided
    if (validatedData.tagIds && validatedData.tagIds.length > 0) {
      await prisma.blogPost.update({
        where: { id: post.id },
        data: {
          tags: {
            connect: validatedData.tagIds.map(tagId => ({ id: tagId })),
          },
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: post,
      message: "Blog yazısı başarıyla oluşturuldu",
    })
  } catch (error) {
    console.error("[BLOG_POST]", error)
    
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
        error: "Blog yazısı oluşturulurken hata oluştu",
      },
      { status: 500 }
    )
  }
} 