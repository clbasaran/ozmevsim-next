import { z } from "zod"

// Contact form submission schema
export const createContactSchema = z.object({
  name: z
    .string()
    .min(2, "İsim en az 2 karakter olmalıdır")
    .max(100, "İsim en fazla 100 karakter olabilir"),
  
  email: z
    .string()
    .email("Geçerli bir e-posta adresi girin")
    .max(255, "E-posta adresi en fazla 255 karakter olabilir"),
  
  phone: z
    .string()
    .optional()
    .refine(
      (phone) => {
        if (!phone) return true
        // Turkish phone number validation
        const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/
        return phoneRegex.test(phone.replace(/\s/g, ""))
      },
      {
        message: "Geçerli bir telefon numarası girin (örn: 05XX XXX XX XX)",
      }
    ),
  
  company: z
    .string()
    .max(200, "Şirket adı en fazla 200 karakter olabilir")
    .optional(),
  
  subject: z
    .string()
    .min(3, "Konu en az 3 karakter olmalıdır")
    .max(200, "Konu en fazla 200 karakter olabilir"),
  
  message: z
    .string()
    .min(10, "Mesaj en az 10 karakter olmalıdır")
    .max(2000, "Mesaj en fazla 2000 karakter olabilir"),
})

// Contact update schema for admin panel
export const updateContactSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "COMPLETED", "SPAM"]).optional(),
  isRead: z.boolean().optional(),
  notes: z.string().max(1000, "Notlar en fazla 1000 karakter olabilir").optional(),
})

// Contact query schema for filtering
export const contactQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.enum(["NEW", "IN_PROGRESS", "COMPLETED", "SPAM"]).optional(),
  isRead: z.enum(["true", "false"]).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sort: z.enum(["createdAt", "updatedAt", "name", "email"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
})

export type CreateContactData = z.infer<typeof createContactSchema>
export type UpdateContactData = z.infer<typeof updateContactSchema>
export type ContactQueryData = z.infer<typeof contactQuerySchema> 