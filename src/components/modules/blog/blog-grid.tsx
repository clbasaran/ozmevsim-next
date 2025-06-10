"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  BookOpen, 
  Calendar,
  Clock,
  User,
  Eye,
  Tag,
  Pin
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"

// Local blog post type for this component
interface BlogPostItem {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  thumbnail?: string
  images: string[]
  metaTitle?: string
  metaDescription?: string
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  isActive: boolean
  isFeatured: boolean
  isPinned: boolean
  publishedAt?: Date
  readingTime?: number
  viewCount: number
  authorId: string
  categoryId: string
  category?: {
    id: string
    name: string
    slug: string
    color?: string
  }
  author?: {
    id: string
    name: string
    email: string
  }
  tags?: Array<{
    id: string
    name: string
    slug: string
    color?: string
  }>
  createdAt: Date
  updatedAt: Date
}

interface BlogGridProps {
  posts?: BlogPostItem[]
  className?: string
  showAll?: boolean
  layout?: "grid" | "list"
}

// Mock data for development (API'den gelecek)
const mockBlogPosts = [
  {
    id: "1",
    title: "Kombinizin Verimini Artırmak İçin 10 Altın Kural",
    slug: "kombinin-verimini-artirmak-icin-10-altin-kural",
    excerpt: "Doğru kullanım teknikleri ve bakım uygulamaları ile kombininizin verimini %30'a kadar artırabilirsiniz. İşte uzmanlardan tavsiyeler...",
    content: "Lorem ipsum dolor sit amet...",
    thumbnail: "/images/blog/kombi-verim.jpg",
    images: ["/images/blog/kombi-verim.jpg"],
    metaTitle: "Kombi Verimini Artırma Yöntemleri - Uzman Tavsiyeleri",
    metaDescription: "Kombininizin verimini artırmak için profesyonel tavsiyeler. Doğru kullanım ve bakım ile enerji tasarrufu sağlayın.",
    status: "PUBLISHED" as const,
    isActive: true,
    isFeatured: true,
    isPinned: false,
    publishedAt: new Date("2024-01-15"),
    readingTime: 5,
    viewCount: 1247,
    authorId: "admin1",
    categoryId: "1",
    category: {
      id: "1",
      name: "Kombi Bakımı",
      slug: "kombi-bakimi",
      color: "#f97316"
    },
    author: {
      id: "admin1",
      name: "Ahmet Yılmaz",
      email: "ahmet@ozmevsim.com"
    },
    tags: [
      { id: "1", name: "kombi", slug: "kombi", color: "#ef4444" },
      { id: "2", name: "verimlilik", slug: "verimlilik", color: "#10b981" },
      { id: "3", name: "bakım", slug: "bakim", color: "#3b82f6" }
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "2",
    title: "2024 Yılında En Trend Klima Modelleri ve Özellikleri",
    slug: "2024-yilinda-en-trend-klima-modelleri",
    excerpt: "Yeni nesil klimaların sunduğu akıllı özellikler ve enerji verimliliği hakkında detaylı rehber. IoT entegrasyonu ve WiFi kontrolü...",
    content: "Lorem ipsum dolor sit amet...",
    thumbnail: "/images/blog/klima-modelleri.jpg",
    images: ["/images/blog/klima-modelleri.jpg"],
    status: "PUBLISHED" as const,
    isActive: true,
    isFeatured: true,
    isPinned: true,
    publishedAt: new Date("2024-01-10"),
    readingTime: 8,
    viewCount: 892,
    authorId: "admin2",
    categoryId: "2",
    category: {
      id: "2",
      name: "Klima Sistemleri",
      slug: "klima-sistemleri",
      color: "#06b6d4"
    },
    author: {
      id: "admin2",
      name: "Fatma Demir",
      email: "fatma@ozmevsim.com"
    },
    tags: [
      { id: "4", name: "klima", slug: "klima", color: "#06b6d4" },
      { id: "5", name: "teknoloji", slug: "teknoloji", color: "#8b5cf6" },
      { id: "6", name: "enerji", slug: "enerji", color: "#eab308" }
    ],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10")
  },
  {
    id: "3",
    title: "Isı Pompası Nedir? Avantajları ve Dezavantajları",
    slug: "isi-pompasi-nedir-avantajlari-dezavantajlari",
    excerpt: "Çevre dostu ısıtma çözümü olarak öne çıkan ısı pompalarının çalışma prensibi, maliyet analizi ve kurulum süreçleri hakkında her şey...",
    content: "Lorem ipsum dolor sit amet...",
    thumbnail: "/images/blog/isi-pompasi.jpg",
    images: ["/images/blog/isi-pompasi.jpg"],
    status: "PUBLISHED" as const,
    isActive: true,
    isFeatured: false,
    isPinned: false,
    publishedAt: new Date("2024-01-05"),
    readingTime: 12,
    viewCount: 634,
    authorId: "admin1",
    categoryId: "3",
    category: {
      id: "3",
      name: "Enerji Verimliliği",
      slug: "enerji-verimliligi",
      color: "#10b981"
    },
    author: {
      id: "admin1",
      name: "Ahmet Yılmaz",
      email: "ahmet@ozmevsim.com"
    },
    tags: [
      { id: "7", name: "ısı pompası", slug: "isi-pompasi", color: "#10b981" },
      { id: "2", name: "verimlilik", slug: "verimlilik", color: "#10b981" },
      { id: "8", name: "çevre", slug: "cevre", color: "#22c55e" }
    ],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05")
  }
]

export function BlogGrid({ posts = mockBlogPosts, className, showAll = false, layout = "grid" }: BlogGridProps) {
  const displayPosts = showAll ? posts : posts.slice(0, 6)

  return (
    <section className={cn("section-padding", className)}>
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 mb-4">
            <BookOpen className="mr-2 h-3 w-3" />
            Uzman İçeriklerimiz
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl mb-4">
            <span className="block">Faydalı</span>
            <span className="block text-gradient-primary">Blog Yazıları</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sektörün en güncel bilgileri, uzman tavsiyeleri ve pratik çözümlerle
            size rehberlik ediyoruz.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className={cn(
          layout === "grid" 
            ? "grid gap-8 md:grid-cols-2 lg:grid-cols-3" 
            : "space-y-8"
        )}>
          {displayPosts.map((post, index) => (
            <Card 
              key={post.id}
              className={cn(
                "group relative card-hover border-none shadow-card bg-white overflow-hidden",
                "animate-fade-in-up",
                layout === "list" && "md:flex md:h-64"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Featured & Pinned Badges */}
              {(post.isFeatured || post.isPinned) && (
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  {post.isPinned && (
                    <Badge className="bg-red-500 text-white text-xs">
                      <Pin className="mr-1 h-3 w-3" />
                      Sabitlendi
                    </Badge>
                  )}
                  {post.isFeatured && (
                    <Badge className="bg-blue-500 text-white text-xs">
                      Öne Çıkan
                    </Badge>
                  )}
                </div>
              )}

              {/* Thumbnail */}
              <div className={cn(
                "relative bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden",
                layout === "grid" ? "h-48" : "md:w-80 md:h-full h-48"
              )}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-gray-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                {/* Category Badge */}
                {post.category && (
                  <div className="absolute bottom-4 right-4">
                    <Badge 
                      className="text-xs text-white"
                      style={{ backgroundColor: post.category.color || "#6b7280" }}
                    >
                      {post.category.name}
                    </Badge>
                  </div>
                )}
              </div>

              <div className={cn(
                "flex flex-col",
                layout === "list" ? "flex-1" : ""
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    {/* Author */}
                    {post.author && (
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{post.author.name}</span>
                      </div>
                    )}
                    
                    {/* Published Date */}
                    {post.publishedAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {formatDistanceToNow(post.publishedAt, { 
                            addSuffix: true, 
                            locale: tr 
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 line-clamp-3 mt-2">
                    {post.excerpt}
                  </p>
                </CardHeader>

                <CardContent className="pt-0 pb-3 flex-1">
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge 
                          key={tag.id} 
                          variant="outline" 
                          className="text-xs"
                          style={{ 
                            borderColor: tag.color || "#d1d5db",
                            color: tag.color || "#6b7280"
                          }}
                        >
                          <Tag className="mr-1 h-3 w-3" />
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Reading Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {post.readingTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readingTime} dk okuma</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.viewCount.toLocaleString()} görüntüleme</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button asChild variant="outline" className="w-full group">
                    <Link href={`/blog/${post.slug}`}>
                      Devamını Oku
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        {!showAll && posts.length > 6 && (
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="btn-secondary">
              <Link href="/blog">
                Tüm Blog Yazılarını Gör
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
} 