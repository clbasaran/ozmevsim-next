import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

// Generate static params for static export
export async function generateStaticParams() {
  // Return empty array for static export - dynamic routes will be handled by Pages functions
  return []
}

// GET /api/blog/[slug] - Get blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    
    // This will be handled by Cloudflare Pages functions
    return NextResponse.json({
      success: false,
      error: 'This endpoint is handled by Cloudflare Pages functions'
    }, { status: 501 })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Server error'
    }, { status: 500 })
  }
}

// PUT /api/blog/[slug] - Update blog post (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
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

    const { slug } = params
    const body = await request.json()

    // Find existing post
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    })

    if (!existingPost) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog yazısı bulunamadı",
        },
        { status: 404 }
      )
    }

    // If slug is being changed, check if new slug exists
    if (body.slug && body.slug !== slug) {
      const slugExists = await prisma.blogPost.findUnique({
        where: { slug: body.slug },
      })

      if (slugExists) {
        return NextResponse.json(
          {
            success: false,
            error: "Bu slug zaten kullanılıyor",
          },
          { status: 409 }
        )
      }
    }

    // Calculate reading time if content changed
    let readingTime = existingPost.readTime
    if (body.content && body.content !== existingPost.content) {
      const wordCount = body.content.split(/\s+/).length
      readingTime = Math.ceil(wordCount / 200)
    }

    // Update post
    const updatedPost = await prisma.blogPost.update({
      where: { slug },
      data: {
        ...body,
        readTime: readingTime,
        updatedAt: new Date(),
        publishedAt: body.status === "PUBLISHED" && !existingPost.publishedAt 
          ? new Date() 
          : existingPost.publishedAt,
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
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedPost,
      message: "Blog yazısı başarıyla güncellendi",
    })
  } catch (error) {
    console.error("[BLOG_SLUG_PUT]", error)
    return NextResponse.json(
      {
        success: false,
        error: "Blog yazısı güncellenirken hata oluştu",
      },
      { status: 500 }
    )
  }
}

// DELETE /api/blog/[slug] - Delete blog post (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "Bu işlem için yetkiniz yok",
        },
        { status: 403 }
      )
    }

    const { slug } = params

    // Find post
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    })

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog yazısı bulunamadı",
        },
        { status: 404 }
      )
    }

    // Soft delete - mark as inactive instead of hard delete
    await prisma.blogPost.update({
      where: { slug },
      data: {
        isActive: false,
        status: "ARCHIVED",
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: "Blog yazısı başarıyla silindi",
    })
  } catch (error) {
    console.error("[BLOG_SLUG_DELETE]", error)
    return NextResponse.json(
      {
        success: false,
        error: "Blog yazısı silinirken hata oluştu",
      },
      { status: 500 }
    )
  }
} 