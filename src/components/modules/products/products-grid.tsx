"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  Package, 
  Phone,
  Star,
  Zap,
  Award,
  CheckCircle,
  Eye
} from "lucide-react"
import { cn } from "@/lib/utils"

// Local product type for this component
interface ProductItem {
  id: string
  name: string
  slug: string
  description?: string
  excerpt?: string
  thumbnail?: string
  images: string[]
  brand?: string
  model?: string
  sku?: string
  specifications?: Record<string, string | undefined>
  features: string[]
  isActive: boolean
  isFeatured: boolean
  isNew: boolean
  order: number
  hasPrice: boolean
  priceFrom?: number
  priceTo?: number
  priceUnit?: string
  priceNote?: string
  isAvailable: boolean
  availabilityNote?: string
  categoryId: string
  category?: {
    id: string
    name: string
    slug: string
  }
  createdAt: Date
  updatedAt: Date
}

interface ProductsGridProps {
  products?: ProductItem[]
  className?: string
  showAll?: boolean
}

// Mock data for development (API'den gelecek)
const mockProducts = [
  {
    id: "1",
    name: "Bosch Condens 7000W Yoğuşmalı Kombi",
    slug: "bosch-condens-7000w",
    description: "Yüksek verimli yoğuşmalı kombi sistemi",
    excerpt: "Enerji tasarrufu sağlayan, çevre dostu yoğuşmalı kombi teknolojisi.",
    thumbnail: "/images/products/kombi-bosch.jpg",
    images: ["/images/products/kombi-bosch.jpg"],
    brand: "Bosch",
    model: "Condens 7000W",
    sku: "BSH-C7000W-24",
    specifications: {
      "Güç": "24 kW",
      "Enerji Sınıfı": "A",
      "Verim": "%109",
      "Yakıt": "Doğalgaz"
    },
    features: ["Yoğuşmalı teknoloji", "Dijital ekran", "Hava atma koruması", "Donma koruması"],
    isActive: true,
    isFeatured: true,
    isNew: false,
    order: 1,
    hasPrice: true,
    priceFrom: 8500,
    priceTo: 12000,
    priceUnit: "TL",
    priceNote: "Montaj dahil",
    isAvailable: true,
    categoryId: "1",
    category: {
      id: "1",
      name: "Kombiler",
      slug: "kombiler"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    name: "Mitsubishi Electric MSZ-LN Serisi Klima",
    slug: "mitsubishi-msz-ln",
    description: "Inverter teknolojili A++ enerji sınıfı klima",
    excerpt: "Sessiz çalışma ve hızlı soğutma özellikli inverter klima.",
    thumbnail: "/images/products/klima-mitsubishi.jpg",
    images: ["/images/products/klima-mitsubishi.jpg"],
    brand: "Mitsubishi Electric",
    model: "MSZ-LN35VG",
    sku: "MIT-LN35VG",
    specifications: {
      "Kapasite": "12.000 BTU/h",
      "Enerji Sınıfı": "A++",
      "Soğutma Gücü": "3.5 kW",
      "Isıtma Gücü": "4.0 kW"
    },
    features: ["Inverter teknoloji", "WiFi kontrol", "3D hava akımı", "Gece modu"],
    isActive: true,
    isFeatured: true,
    isNew: true,
    order: 2,
    hasPrice: true,
    priceFrom: 5500,
    priceTo: 7500,
    priceUnit: "TL",
    priceNote: "Montaj dahil değil",
    isAvailable: true,
    categoryId: "2",
    category: {
      id: "2",
      name: "Klimalar",
      slug: "klimalar"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    name: "Vaillant EcoTEC Plus Yer Tipi Kazan",
    slug: "vaillant-ecotec-plus",
    description: "Yüksek verimli yoğuşmalı yer tipi kazan",
    excerpt: "Geniş alanlar için ideal, ekonomik ve verimli ısıtma çözümü.",
    thumbnail: "/images/products/kazan-vaillant.jpg",
    images: ["/images/products/kazan-vaillant.jpg"],
    brand: "Vaillant",
    model: "EcoTEC Plus VU 486/5-5",
    sku: "VAI-ETPVU486",
    specifications: {
      "Güç": "48 kW",
      "Enerji Sınıfı": "A",
      "Verim": "%110",
      "Tip": "Yer tipi"
    },
    features: ["Yoğuşmalı teknoloji", "Modüler yapı", "Akıllı kontrol", "Uzaktan yönetim"],
    isActive: true,
    isFeatured: false,
    isNew: false,
    order: 3,
    hasPrice: true,
    priceFrom: 25000,
    priceTo: 35000,
    priceUnit: "TL",
    isAvailable: true,
    categoryId: "3",
    category: {
      id: "3",
      name: "Kazanlar",
      slug: "kazanlar"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    name: "Purmo Plan Compact Panel Radyatör",
    slug: "purmo-plan-compact",
    description: "Yüksek ısı verimi sağlayan çelik panel radyatör",
    excerpt: "Kompakt tasarım ve yüksek ısı verimi ile ideal ısıtma çözümü.",
    thumbnail: "/images/products/radyator-purmo.jpg",
    images: ["/images/products/radyator-purmo.jpg"],
    brand: "Purmo",
    model: "Plan Compact 22",
    sku: "PUR-PC22-600",
    specifications: {
      "Tip": "Plan Compact 22",
      "Yükseklik": "600 mm",
      "Malzeme": "Çelik",
      "Bağlantı": "Alt bağlantı"
    },
    features: ["Kompakt tasarım", "Yüksek ısı verimi", "Kolay montaj", "10 yıl garanti"],
    isActive: true,
    isFeatured: false,
    isNew: false,
    order: 4,
    hasPrice: true,
    priceFrom: 800,
    priceTo: 1500,
    priceUnit: "TL",
    priceNote: "Uzunluğa göre değişir",
    isAvailable: true,
    categoryId: "4",
    category: {
      id: "4",
      name: "Radyatörler",
      slug: "radyatorler"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export function ProductsGrid({ products = mockProducts, className, showAll = false }: ProductsGridProps) {
  const displayProducts = showAll ? products : products.slice(0, 8)

  return (
    <section className={cn("section-padding bg-gray-50", className)}>
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 mb-4">
            <Package className="mr-2 h-3 w-3" />
            Kaliteli Ürünlerimiz
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl mb-4">
            <span className="block">Premium</span>
            <span className="block text-gradient-heating">Ürün Kataloğu</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dünya markalarından seçtiğimiz kaliteli ürünlerle
            evinizdeki konforun adresi olmaya devam ediyoruz.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayProducts.map((product, index) => (
            <Card 
              key={product.id}
              className={cn(
                "group relative card-hover border-none shadow-card bg-white overflow-hidden",
                "animate-fade-in-up h-full"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                {product.isFeatured && (
                  <Badge className="bg-heating-500 text-white text-xs">
                    <Star className="mr-1 h-3 w-3" />
                    Öne Çıkan
                  </Badge>
                )}
                {product.isNew && (
                  <Badge className="bg-green-500 text-white text-xs">
                    <Zap className="mr-1 h-3 w-3" />
                    Yeni
                  </Badge>
                )}
              </div>

              {/* Availability Status */}
              <div className="absolute top-4 right-4 z-10">
                {product.isAvailable ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Mevcut
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                    Tükendi
                  </Badge>
                )}
              </div>

              {/* Product Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="h-16 w-16 text-gray-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                {/* Brand Badge */}
                {product.brand && (
                  <div className="absolute bottom-4 right-4">
                    <Badge className="bg-white/90 text-gray-700 text-xs">
                      <Award className="mr-1 h-3 w-3" />
                      {product.brand}
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader className="pb-3">
                {/* Category */}
                {product.category && (
                  <Badge variant="outline" className="w-fit text-xs mb-2">
                    {product.category.name}
                  </Badge>
                )}
                
                <h3 className="font-semibold text-gray-900 group-hover:text-heating-600 transition-colors line-clamp-2 leading-tight">
                  {product.name}
                </h3>
                
                {product.excerpt && (
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {product.excerpt}
                  </p>
                )}

                {/* Key Specifications */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <div className="mt-3 space-y-1">
                    {Object.entries(product.specifications).slice(0, 2).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-gray-500">{key}:</span>
                        <span className="text-gray-700 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardHeader>

              <CardContent className="pt-0 pb-3 flex-1">
                {/* Price Range */}
                {product.hasPrice && product.priceFrom && (
                  <div className="p-3 bg-heating-50 rounded-lg mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Fiyat:</span>
                      <div className="text-right">
                        <span className="font-semibold text-heating-600">
                          {product.priceFrom}
                          {product.priceTo && product.priceTo !== product.priceFrom && ` - ${product.priceTo}`}
                          {" "}{product.priceUnit}
                        </span>
                        {product.priceNote && (
                          <p className="text-xs text-gray-500">{product.priceNote}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Key Features */}
                {product.features.length > 0 && (
                  <div className="space-y-1">
                    {product.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-center text-xs text-gray-600">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                        <span className="line-clamp-1">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-0 gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href={`/urunler/${product.slug}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    İncele
                  </Link>
                </Button>
                
                <Button asChild size="sm" className="btn-heating">
                  <Link href="/iletisim">
                    <Phone className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        {!showAll && products.length > 8 && (
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="btn-secondary">
              <Link href="/urunler">
                Tüm Ürünleri Gör
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
} 