import { CloudflareEnv, initializeCloudflareServices } from '../../src/lib/cloudflare-db'
import { ProductCreateRequest } from '../../src/types/api'

export interface Product {
  id: string
  title: string
  slug: string
  description: string | null
  content: string | null
  image: string | null
  categoryName: string
  price: number | null
  specifications: any
  features: string[]
  isActive: boolean
  isFeatured: boolean
  order: number
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string | null
  createdAt: Date
  updatedAt: Date
}

// GET /api/products - List all products
export const onRequestGet: PagesFunction<CloudflareEnv> = async (context: EventContext<CloudflareEnv, any, any>) => {
  const { request, env } = context
  const url = new URL(request.url)
  
  try {
    const { prisma, cache } = initializeCloudflareServices(env)
    
    // Parse query parameters
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const category = url.searchParams.get('category')
    const featured = url.searchParams.get('featured')
    const search = url.searchParams.get('search')
    
    // Create cache key
    const cacheKey = `products:${page}:${limit}:${category || 'all'}:${featured || 'all'}:${search || 'none'}`
    
    // Try to get from cache first
    let products = await cache.get<{ data: Product[], total: number }>(cacheKey)
    
    if (!products) {
      // Build query conditions
      const where: any = { isActive: true }
      
      if (category) {
        where.categoryName = category
      }
      
      if (featured === 'true') {
        where.isFeatured = true
      }
      
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { categoryName: { contains: search, mode: 'insensitive' } }
        ]
      }
      
      // Get products with pagination
      const [data, total] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy: [
            { isFeatured: 'desc' },
            { order: 'asc' },
            { createdAt: 'desc' }
          ],
          skip: (page - 1) * limit,
          take: limit,
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            image: true,
            categoryName: true,
            price: true,
            features: true,
            isFeatured: true,
            metaTitle: true,
            metaDescription: true,
            createdAt: true,
            updatedAt: true,
          }
        }),
        prisma.product.count({ where })
      ])
      
      products = { data, total }
      
      // Cache for 5 minutes
      await cache.set(cacheKey, products, 300)
    }
    
    const totalPages = Math.ceil(products.total / limit)
    
    return new Response(JSON.stringify({
      success: true,
      data: products.data,
      pagination: {
        page,
        limit,
        total: products.total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
        'Access-Control-Allow-Origin': '*',
      }
    })
    
  } catch (error) {
    console.error('Products GET error:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Ürünler yüklenirken hata oluştu'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// POST /api/products - Create new product (Admin only)
export const onRequestPost: PagesFunction<CloudflareEnv> = async (context: EventContext<CloudflareEnv, any, any>) => {
  const { request, env } = context
  
  try {
    // TODO: Add authentication middleware
    const { prisma, cache, storage } = initializeCloudflareServices(env)
    
    const body = await request.json() as ProductCreateRequest
    const {
      title,
      slug,
      description,
      content,
      image,
      categoryName,
      price,
      specifications,
      features,
      isFeatured,
      metaTitle,
      metaDescription,
      metaKeywords
    } = body
    
    // Validate required fields
    if (!title || !slug || !categoryName) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Başlık, slug ve kategori gereklidir'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    })
    
    if (existingProduct) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Bu slug zaten kullanılıyor'
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Get next order number
    const lastProduct = await prisma.product.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    })
    
    const nextOrder = (lastProduct?.order || 0) + 1
    
    // Create product
    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        content,
        image,
        categoryName,
        price: price ? parseFloat(price.toString()) : null,
        specifications: specifications ? JSON.stringify(specifications) : null,
        features: features ? JSON.stringify(features) : null,
        isFeatured: Boolean(isFeatured),
        order: nextOrder,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || description,
        metaKeywords,
        isActive: true,
      }
    })
    
    // Clear cache
    await cache.deleteMany('products:')
    
    return new Response(JSON.stringify({
      success: true,
      data: product,
      message: 'Ürün başarıyla oluşturuldu'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Product POST error:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Ürün oluşturulurken hata oluştu'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Handle OPTIONS for CORS
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  })
} 