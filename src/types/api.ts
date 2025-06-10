// API Request and Response Types for Öz Mevsim Isı Sistemleri

// Base API Response
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pagination
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta
}

// User Types
export interface User {
  id: string
  email: string
  name: string | null
  role: 'USER' | 'EDITOR' | 'ADMIN'
  isActive: boolean
  lastLogin: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface UserWithoutPassword extends Omit<User, 'password'> {}

// Authentication
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse extends ApiResponse {
  user?: UserWithoutPassword
  tokens?: {
    accessToken: string
    refreshToken: string
  }
}

export interface RegisterRequest {
  email: string
  password: string
  name?: string
}

// Products
export interface Product {
  id: string
  title: string
  slug: string
  description: string | null
  content: string | null
  image: string | null
  categoryName: string
  price: number | null
  specifications: string | null // JSON string
  features: string | null // JSON string array
  isActive: boolean
  isFeatured: boolean
  order: number
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ProductCreateRequest {
  title: string
  slug: string
  description?: string
  content?: string
  image?: string
  categoryName: string
  price?: number
  specifications?: Record<string, any>
  features?: string[]
  isFeatured?: boolean
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
  id: string
}

// Services
export interface Service {
  id: string
  title: string
  slug: string
  description: string | null
  content: string | null
  image: string | null
  icon: string | null
  price: number | null
  features: string | null // JSON string array
  isActive: boolean
  isFeatured: boolean
  order: number
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ServiceCreateRequest {
  title: string
  slug: string
  description?: string
  content?: string
  image?: string
  icon?: string
  price?: number
  features?: string[]
  isFeatured?: boolean
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
}

// Blog
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  image: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  authorId: string
  categoryId: string | null
  tags: string | null // JSON string array
  viewCount: number
  readTime: number
  publishedAt: Date | null
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string | null
  isActive: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface BlogPostCreateRequest {
  title: string
  slug: string
  excerpt?: string
  content: string
  image?: string
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  categoryId?: string
  tags?: string[]
  readTime?: number
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  isFeatured?: boolean
}

// FAQ
export interface Faq {
  id: string
  question: string
  answer: string
  categoryId: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface FaqCategory {
  id: string
  name: string
  slug: string
  description: string | null
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface FaqCreateRequest {
  question: string
  answer: string
  categoryId: string
  order?: number
}

// Contact
export interface Contact {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'SPAM'
  isRead: boolean
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ContactCreateRequest {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

// Media/Upload
export interface Media {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  r2Key: string
  bucket: string
  isPublic: boolean
  uploadedBy: string | null
  alt: string | null
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export interface UploadRequest {
  file: File
  alt?: string
  description?: string
}

export interface UploadResponse extends ApiResponse {
  data?: {
    id: string
    filename: string
    url: string
    r2Key: string
    size: number
  }
}

// Analytics
export interface Analytics {
  id: string
  page: string
  visits: number
  userAgent: string | null
  ip: string | null
  country: string | null
  referrer: string | null
  date: Date
}

// Settings
export interface Setting {
  id: string
  key: string
  value: string
  description: string | null
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON'
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

// Search and Filter
export interface SearchParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  featured?: boolean
  status?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Error Types
export interface ApiError {
  success: false
  error: string
  code?: string
  details?: Record<string, any>
} 