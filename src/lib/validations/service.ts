import { z } from "zod"

// Service Category Validation
export const serviceCategorySchema = z.object({
  name: z.string().min(2, "Kategori adı en az 2 karakter olmalı").max(100),
  slug: z.string().min(2).max(100),
  description: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
})

export const createServiceCategorySchema = serviceCategorySchema

export const updateServiceCategorySchema = serviceCategorySchema.partial()

// Service Validation  
export const serviceSchema = z.object({
  title: z.string().min(5, "Hizmet başlığı en az 5 karakter olmalı").max(200),
  slug: z.string().min(5).max(200),
  description: z.string().optional(),
  content: z.string().optional(),
  excerpt: z.string().max(500).optional(),
  thumbnail: z.string().url().optional(),
  images: z.array(z.string().url()).default([]),
  
  // SEO Fields
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  metaKeywords: z.string().max(255).optional(),
  
  // Status & Features
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  
  // Pricing
  hasPrice: z.boolean().default(false),
  priceFrom: z.number().positive().optional(),
  priceTo: z.number().positive().optional(),
  priceUnit: z.enum(["TL", "USD", "EUR"]).optional(),
  
  // Relations
  categoryId: z.string().cuid(),
})

export const createServiceSchema = serviceSchema

export const updateServiceSchema = serviceSchema.partial().extend({
  id: z.string().cuid(),
})

// API Query Schemas
export const serviceQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  categoryId: z.string().cuid().optional(),
  featured: z.coerce.boolean().optional(),
  active: z.coerce.boolean().optional(),
  sort: z.enum(["title", "createdAt", "order", "priceFrom"]).default("order"),
  order: z.enum(["asc", "desc"]).default("asc"),
})

// Types
export type ServiceCategory = z.infer<typeof serviceCategorySchema>
export type CreateServiceCategory = z.infer<typeof createServiceCategorySchema>
export type UpdateServiceCategory = z.infer<typeof updateServiceCategorySchema>

export type Service = z.infer<typeof serviceSchema>
export type CreateService = z.infer<typeof createServiceSchema>
export type UpdateService = z.infer<typeof updateServiceSchema>
export type ServiceQuery = z.infer<typeof serviceQuerySchema> 