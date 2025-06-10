import { z } from "zod"

// Blog Category Validation
export const blogCategorySchema = z.object({
  name: z.string().min(2, "Kategori adı en az 2 karakter olmalı").max(100),
  slug: z.string().min(2).max(100),
  description: z.string().optional(),
  color: z.string().optional(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
})

export const createBlogCategorySchema = blogCategorySchema

export const updateBlogCategorySchema = blogCategorySchema.partial()

// Blog Tag Validation
export const blogTagSchema = z.object({
  name: z.string().min(2, "Tag adı en az 2 karakter olmalı").max(50),
  slug: z.string().min(2).max(50),
  color: z.string().optional(),
})

export const createBlogTagSchema = blogTagSchema

export const updateBlogTagSchema = blogTagSchema.partial()

// Blog Post Status Enum
export const postStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"])

// Blog Post Validation
export const blogPostSchema = z.object({
  title: z.string().min(5, "Başlık en az 5 karakter olmalı").max(200),
  slug: z.string().min(5).max(200),
  excerpt: z.string().min(50, "Özet en az 50 karakter olmalı").max(500),
  content: z.string().min(100, "İçerik en az 100 karakter olmalı"),
  
  // Media
  thumbnail: z.string().url().optional(),
  images: z.array(z.string().url()).default([]),
  
  // SEO Fields
  metaTitle: z.string().min(20).max(60).optional(),
  metaDescription: z.string().min(50).max(160).optional(),
  metaKeywords: z.string().max(255).optional(),
  canonicalUrl: z.string().url().optional(),
  
  // Status & Publishing
  status: postStatusEnum.default("DRAFT"),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isPinned: z.boolean().default(false),
  
  // Publishing schedule
  publishedAt: z.date().optional(),
  scheduledAt: z.date().optional(),
  
  // Reading & Engagement
  readingTime: z.number().int().positive().optional(),
  viewCount: z.number().int().min(0).default(0),
  
  // Author & Categories
  authorId: z.string().cuid(),
  categoryId: z.string().cuid(),
  
  // Tags (many-to-many relationship)
  tagIds: z.array(z.string().cuid()).default([]),
})

export const createBlogPostSchema = blogPostSchema.omit({ 
  viewCount: true,
  publishedAt: true 
})

export const updateBlogPostSchema = blogPostSchema.partial().extend({
  id: z.string().cuid(),
})

// Publishing specific schemas
export const publishBlogPostSchema = z.object({
  id: z.string().cuid(),
  publishedAt: z.date().optional(),
})

export const scheduleBlogPostSchema = z.object({
  id: z.string().cuid(),
  scheduledAt: z.date(),
})

// API Query Schemas
export const blogPostQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
  search: z.string().optional(),
  categoryId: z.string().cuid().optional(),
  tagId: z.string().cuid().optional(),
  authorId: z.string().cuid().optional(),
  status: postStatusEnum.optional(),
  featured: z.coerce.boolean().optional(),
  pinned: z.coerce.boolean().optional(),
  active: z.coerce.boolean().optional(),
  sort: z.enum([
    "title", 
    "createdAt", 
    "publishedAt", 
    "viewCount", 
    "readingTime"
  ]).default("publishedAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
})

export const blogCategoryQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  active: z.coerce.boolean().optional(),
  sort: z.enum(["name", "createdAt", "order"]).default("order"),
  order: z.enum(["asc", "desc"]).default("asc"),
})

export const blogTagQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  search: z.string().optional(),
  sort: z.enum(["name", "createdAt"]).default("name"),
  order: z.enum(["asc", "desc"]).default("asc"),
})

// Comment System (Future extension)
export const blogCommentSchema = z.object({
  content: z.string().min(5, "Yorum en az 5 karakter olmalı").max(1000),
  authorName: z.string().min(2).max(100),
  authorEmail: z.string().email("Geçerli email adresi giriniz"),
  authorWebsite: z.string().url().optional(),
  postId: z.string().cuid(),
  parentId: z.string().cuid().optional(), // For nested comments
  isApproved: z.boolean().default(false),
})

// Types
export type BlogCategory = z.infer<typeof blogCategorySchema>
export type CreateBlogCategory = z.infer<typeof createBlogCategorySchema>
export type UpdateBlogCategory = z.infer<typeof updateBlogCategorySchema>

export type BlogTag = z.infer<typeof blogTagSchema>
export type CreateBlogTag = z.infer<typeof createBlogTagSchema>
export type UpdateBlogTag = z.infer<typeof updateBlogTagSchema>

export type BlogPost = z.infer<typeof blogPostSchema>
export type CreateBlogPost = z.infer<typeof createBlogPostSchema>
export type UpdateBlogPost = z.infer<typeof updateBlogPostSchema>
export type PublishBlogPost = z.infer<typeof publishBlogPostSchema>
export type ScheduleBlogPost = z.infer<typeof scheduleBlogPostSchema>

export type BlogPostQuery = z.infer<typeof blogPostQuerySchema>
export type BlogCategoryQuery = z.infer<typeof blogCategoryQuerySchema>
export type BlogTagQuery = z.infer<typeof blogTagQuerySchema>

export type BlogComment = z.infer<typeof blogCommentSchema>
export type PostStatus = z.infer<typeof postStatusEnum> 