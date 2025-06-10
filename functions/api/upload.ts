import { CloudflareEnv, initializeCloudflareServices } from '../../src/lib/cloudflare-db'

// File upload interface
export interface UploadRequest {
  filename: string
  contentType: string
  alt?: string
  description?: string
}

export interface UploadResponse {
  success: boolean
  data?: {
    id: string
    filename: string
    url: string
    r2Key: string
    size: number
  }
  error?: string
}

// POST /api/upload - Upload file to R2
export const onRequestPost: PagesFunction<CloudflareEnv> = async (context: EventContext<CloudflareEnv, any, any>) => {
  const { request, env } = context
  
  try {
    // TODO: Add authentication check
    const { prisma, storage } = initializeCloudflareServices(env)
    
    // Check if request is multipart/form-data
    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('multipart/form-data')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Lütfen multipart/form-data formatında dosya gönderin'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const alt = formData.get('alt') as string || null
    const description = formData.get('description') as string || null
    
    if (!file) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Dosya bulunamadı'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
      'text/plain'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Desteklenmeyen dosya türü. JPG, PNG, WebP, GIF, PDF veya TXT dosyaları yükleyebilirsiniz.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Dosya boyutu çok büyük. Maksimum 10MB dosya yükleyebilirsiniz.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const uniqueFilename = `${timestamp}_${sanitizedName}`
    const r2Key = `uploads/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${uniqueFilename}`
    
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    
    // Upload to R2
    const uploadResult = await storage.upload(r2Key, arrayBuffer, {
      contentType: file.type,
      metadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
        alt: alt || '',
        description: description || '',
      }
    })
    
    if (!uploadResult) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Dosya yüklenirken hata oluştu'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Save media record to database
    const media = await prisma.media.create({
      data: {
        filename: uniqueFilename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: `https://pub-ozmevsim-media.r2.dev/${r2Key}`,
        r2Key: r2Key,
        bucket: 'ozmevsim-media',
        isPublic: true,
        alt: alt,
        description: description,
      }
    })
    
    const response: UploadResponse = {
      success: true,
      data: {
        id: media.id,
        filename: media.filename,
        url: media.url,
        r2Key: media.r2Key,
        size: media.size,
      }
    }
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://ozmevsim.com',
        'Access-Control-Allow-Credentials': 'true',
      }
    })
    
  } catch (error) {
    console.error('Upload error:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Dosya yüklenirken sunucu hatası oluştu'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// GET /api/upload/[key] - Get file info or download
export const onRequestGet: PagesFunction<CloudflareEnv> = async (context: EventContext<CloudflareEnv, any, any>) => {
  const { request, env, params } = context
  const r2Key = params.key as string
  
  try {
    const { storage, prisma } = initializeCloudflareServices(env)
    
    // Get file from R2
    const file = await storage.download(r2Key)
    
    if (!file) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Dosya bulunamadı'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Get media info from database
    const media = await prisma.media.findUnique({
      where: { r2Key: r2Key }
    })
    
    if (!media) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Medya kaydı bulunamadı'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Return file content
    return new Response(file.body, {
      status: 200,
      headers: {
        'Content-Type': media.mimeType,
        'Content-Disposition': `inline; filename="${media.originalName}"`,
        'Cache-Control': 'public, max-age=31536000',
        'ETag': file.etag || '',
      }
    })
    
  } catch (error) {
    console.error('Download error:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Dosya indirilirken hata oluştu'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// DELETE /api/upload/[key] - Delete file
export const onRequestDelete: PagesFunction<CloudflareEnv> = async (context: EventContext<CloudflareEnv, any, any>) => {
  const { request, env, params } = context
  const r2Key = params.key as string
  
  try {
    // TODO: Add admin authentication check
    const { storage, prisma } = initializeCloudflareServices(env)
    
    // Delete from R2
    await storage.delete(r2Key)
    
    // Delete from database
    await prisma.media.delete({
      where: { r2Key: r2Key }
    })
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Dosya başarıyla silindi'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Delete error:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Dosya silinirken hata oluştu'
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
      'Access-Control-Allow-Origin': 'https://ozmevsim.com',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    }
  })
} 