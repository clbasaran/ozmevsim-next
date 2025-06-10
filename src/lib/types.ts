// 🔐 Auth Types
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  avatar: string | null;
  isActive: boolean;
  twoFAEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// 📧 Contact Types
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'SPAM';
  isRead: boolean;
  notes?: string;
  ipAddress?: string;
  userAgent?: string;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}

// 🛠️ Service Types
export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  services?: Service[];
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  excerpt?: string;
  thumbnail?: string;
  images: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  hasPrice: boolean;
  priceFrom?: number;
  priceTo?: number;
  priceUnit?: string;
  categoryId: string;
  category?: ServiceCategory;
  createdAt: Date;
  updatedAt: Date;
}

// 📦 Product Types
export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  products?: Product[];
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  excerpt?: string;
  thumbnail?: string;
  images: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  sku?: string;
  hasStock: boolean;
  stockQuantity?: number;
  hasPrice: boolean;
  price?: number;
  priceUnit?: string;
  specifications?: any;
  categoryId: string;
  category?: ProductCategory;
  createdAt: Date;
  updatedAt: Date;
}

// 📝 Blog Types
export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  posts?: BlogPost[];
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  createdAt: Date;
  posts?: BlogPost[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  thumbnail?: string;
  images: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isActive: boolean;
  isFeatured: boolean;
  publishedAt?: Date;
  readTime?: number;
  viewCount: number;
  likeCount: number;
  authorId: string;
  author?: User;
  categoryId: string;
  category?: BlogCategory;
  tags?: BlogTag[];
  createdAt: Date;
  updatedAt: Date;
}

// ❓ FAQ Types
export interface FaqCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  faqs?: Faq[];
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  categoryId: string;
  category?: FaqCategory;
  createdAt: Date;
  updatedAt: Date;
}

// 🏠 Hero Slider Types
export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  mobileImage?: string;
  buttonText?: string;
  buttonLink?: string;
  buttonType?: 'primary' | 'secondary' | 'outline';
  textPosition?: 'left' | 'center' | 'right';
  overlay: boolean;
  overlayColor?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// ⚙️ Site Settings Types
export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  type: 'text' | 'number' | 'boolean' | 'json' | 'image';
  group: 'general' | 'seo' | 'social' | 'contact' | 'smtp';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 📊 Analytics Types
export interface PageView {
  id: string;
  path: string;
  userAgent?: string;
  referer?: string;
  ipAddress?: string;
  country?: string;
  device?: 'desktop' | 'mobile' | 'tablet';
  createdAt: Date;
}

export interface Event {
  id: string;
  name: string;
  data?: Record<string, any>;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  oldData?: Record<string, any>;
  newData?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  userId: string;
  user?: User;
  createdAt: Date;
}

// 🌐 API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

// 🎨 UI Component Types
export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;
  description?: string;
  children?: NavItem[];
}

export interface SidebarNavItem extends NavItem {
  items?: SidebarNavItem[];
}

// 📱 PWA Types
export interface PWAConfig {
  name: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  orientation: 'portrait' | 'landscape' | 'any';
  icons: {
    src: string;
    sizes: string;
    type: string;
    purpose?: string;
  }[];
}

// 🔍 Search Types
export interface SearchResult {
  id: string;
  title: string;
  excerpt?: string;
  type: 'service' | 'product' | 'blog' | 'faq';
  url: string;
  thumbnail?: string;
  score: number;
}

// 📊 Dashboard Stats Types
export interface DashboardStats {
  totalContacts: number;
  newContacts: number;
  totalServices: number;
  totalProducts: number;
  totalBlogPosts: number;
  totalPageViews: number;
  monthlyPageViews: number;
  topPages: {
    path: string;
    views: number;
  }[];
  recentContacts: Contact[];
  recentActivities: AuditLog[];
}

// 🎯 SEO Types
export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
} 