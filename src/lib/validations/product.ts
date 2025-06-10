import { z } from "zod"

// Product Category Validation
export const productCategorySchema = z.object({
  name: z.string().min(2, "Kategori adı en az 2 karakter olmalı").max(100),
  slug: z.string().min(2).max(100),
  description: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().url().optional(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
})

export const createProductCategorySchema = productCategorySchema

export const updateProductCategorySchema = productCategorySchema.partial()

// Product Validation
export const productSchema = z.object({
  name: z.string().min(2, "Ürün adı en az 2 karakter olmalı").max(200),
  slug: z.string().min(2).max(200),
  description: z.string().optional(),
  content: z.string().optional(),
  excerpt: z.string().max(500).optional(),
  
  // Images
  thumbnail: z.string().url().optional(),
  images: z.array(z.string().url()).default([]),
  
  // Technical specifications
  specifications: z.record(z.string()).optional(),
  features: z.array(z.string()).default([]),
  
  // Product details
  brand: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  sku: z.string().max(50).optional(),
  
  // SEO Fields
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  metaKeywords: z.string().max(255).optional(),
  
  // Status & Features
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  
  // Pricing (informational only)
  hasPrice: z.boolean().default(false),
  priceFrom: z.number().positive().optional(),
  priceTo: z.number().positive().optional(),
  priceUnit: z.enum(["TL", "USD", "EUR"]).optional(),
  priceNote: z.string().max(255).optional(),
  
  // Relations
  categoryId: z.string().cuid(),
  
  // Availability
  isAvailable: z.boolean().default(true),
  availabilityNote: z.string().max(255).optional(),
})

export const createProductSchema = productSchema

export const updateProductSchema = productSchema.partial().extend({
  id: z.string().cuid(),
})

// API Query Schemas
export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  search: z.string().optional(),
  categoryId: z.string().cuid().optional(),
  brand: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  new: z.coerce.boolean().optional(),
  available: z.coerce.boolean().optional(),
  active: z.coerce.boolean().optional(),
  hasPrice: z.coerce.boolean().optional(),
  sort: z.enum(["title", "createdAt", "order", "priceFrom", "brand"]).default("order"),
  order: z.enum(["asc", "desc"]).default("asc"),
})

export const productCategoryQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  active: z.coerce.boolean().optional(),
  sort: z.enum(["name", "createdAt", "order"]).default("order"),
  order: z.enum(["asc", "desc"]).default("asc"),
})

// Types
export type ProductCategory = z.infer<typeof productCategorySchema>
export type CreateProductCategory = z.infer<typeof createProductCategorySchema>
export type UpdateProductCategory = z.infer<typeof updateProductCategorySchema>

export type Product = z.infer<typeof productSchema>
export type CreateProduct = z.infer<typeof createProductSchema>
export type UpdateProduct = z.infer<typeof updateProductSchema>
export type ProductQuery = z.infer<typeof productQuerySchema>
export type ProductCategoryQuery = z.infer<typeof productCategoryQuerySchema> 