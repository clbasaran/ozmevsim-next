import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateServiceSchema } from "@/lib/validations/service"
import { getCurrentUser } from "@/lib/auth"

// GET /api/services/[id] - Get single service
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: params.id },
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

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          error: "Hizmet bulunamadı",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: service,
    })
  } catch (error) {
    console.error("[SERVICE_GET]", error)
    return NextResponse.json(
      {
        success: false,
        error: "Hizmet alınırken hata oluştu",
      },
      { status: 500 }
    )
  }
}

// PUT /api/services/[id] - Update service (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id: params.id },
    })

    if (!existingService) {
      return NextResponse.json(
        {
          success: false,
          error: "Hizmet bulunamadı",
        },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = updateServiceSchema.parse({ ...body, id: params.id })

    // Check if slug is being changed and already exists
    if (validatedData.slug && validatedData.slug !== existingService.slug) {
      const slugExists = await prisma.service.findUnique({
        where: { slug: validatedData.slug },
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

    // Check if category exists (if being changed)
    if (validatedData.categoryId) {
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
    }

    // Remove id from data before update
    const { id, ...updateData } = validatedData

    // Update service
    const service = await prisma.service.update({
      where: { id: params.id },
      data: updateData,
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
      message: "Hizmet başarıyla güncellendi",
    })
  } catch (error) {
    console.error("[SERVICE_PUT]", error)
    
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
        error: "Hizmet güncellenirken hata oluştu",
      },
      { status: 500 }
    )
  }
}

// DELETE /api/services/[id] - Delete service (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "Bu işlem için admin yetkisi gerekli",
        },
        { status: 403 }
      )
    }

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id: params.id },
    })

    if (!existingService) {
      return NextResponse.json(
        {
          success: false,
          error: "Hizmet bulunamadı",
        },
        { status: 404 }
      )
    }

    // Delete service
    await prisma.service.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: "Hizmet başarıyla silindi",
    })
  } catch (error) {
    console.error("[SERVICE_DELETE]", error)
    return NextResponse.json(
      {
        success: false,
        error: "Hizmet silinirken hata oluştu",
      },
      { status: 500 }
    )
  }
} 