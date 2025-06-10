import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createContactSchema } from "@/lib/validations/contact"
import { getCurrentUser } from "@/lib/auth"

// POST /api/contact - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createContactSchema.parse(body)

    // Get request metadata
    const userAgent = request.headers.get("user-agent")
    const forwardedFor = request.headers.get("x-forwarded-for")
    const realIp = request.headers.get("x-real-ip")
    const ipAddress = forwardedFor || realIp || "unknown"

    // Create contact record
    const contact = await prisma.contact.create({
      data: {
        ...validatedData,
        ipAddress,
        userAgent: userAgent || "unknown",
        source: "website",
      },
    })

    // TODO: Send email notification to admin
    // TODO: Send auto-reply to user
    
    // Track event
    prisma.event.create({
      data: {
        name: "contact_form_submit",
        data: {
          contactId: contact.id,
          subject: contact.subject,
        },
        userAgent: userAgent || "unknown",
        ipAddress,
      },
    }).catch(console.error)

    return NextResponse.json({
      success: true,
      data: {
        id: contact.id,
        message: "Mesajınız başarıyla iletildi. En kısa sürede size dönüş yapacağız.",
      },
    })
  } catch (error) {
    console.error("[CONTACT_POST]", error)
    
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        {
          success: false,
          error: "Lütfen tüm alanları doğru şekilde doldurun",
          details: error.message,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Mesaj gönderilirken hata oluştu. Lütfen tekrar deneyin.",
      },
      { status: 500 }
    )
  }
}

// GET /api/contact - List contact messages (Admin only)
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const isRead = searchParams.get("isRead")
    
    const offset = (page - 1) * limit

    // Build where conditions
    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (isRead !== null && isRead !== undefined) {
      where.isRead = isRead === "true"
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ]
    }

    // Get contacts with pagination
    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.contact.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: contacts,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    console.error("[CONTACT_GET]", error)
    return NextResponse.json(
      {
        success: false,
        error: "İletişim mesajları alınırken hata oluştu",
      },
      { status: 500 }
    )
  }
} 