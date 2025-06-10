"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  Thermometer, 
  Snowflake, 
  Wrench, 
  Phone,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"
// Local service type for this component
interface ServiceItem {
  id: string
  title: string
  slug: string
  description?: string
  excerpt?: string
  thumbnail?: string
  images: string[]
  isActive: boolean
  isFeatured: boolean
  order: number
  hasPrice: boolean
  priceFrom?: number
  priceTo?: number
  priceUnit?: string
  categoryId: string
  category?: {
    id: string
    name: string
    slug: string
  }
  createdAt: Date
  updatedAt: Date
}

interface ServicesGridProps {
  services?: ServiceItem[]
  className?: string
  showAll?: boolean
}

// Mock data for development (API'den gelecek)
const mockServices = [
  {
    id: "1",
    title: "Kombi Montaj ve Bakım",
    slug: "kombi-montaj-bakim",
    description: "Profesyonel kombi montajı ve periyodik bakım hizmetleri",
    excerpt: "Yoğuşmalı ve konvansiyonel kombiler için uzman montaj ve bakım hizmetleri sunuyoruz.",
    thumbnail: "/images/services/kombi.jpg",
    images: ["/images/services/kombi.jpg"],
    isActive: true,
    isFeatured: true,
    order: 1,
    hasPrice: true,
    priceFrom: 500,
    priceTo: 1500,
    priceUnit: "TL" as const,
    categoryId: "1",
    category: {
      id: "1",
      name: "Isıtma Sistemleri",
      slug: "isitma-sistemleri"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2", 
    title: "Klima Sistemleri",
    slug: "klima-sistemleri",
    description: "Split, multi split ve VRF klima sistemleri",
    excerpt: "Evler ve işyerleri için profesyonel klima montajı ve bakım hizmetleri.",
    thumbnail: "/images/services/klima.jpg",
    images: ["/images/services/klima.jpg"],
    isActive: true,
    isFeatured: true,
    order: 2,
    hasPrice: true,
    priceFrom: 800,
    priceTo: 5000,
    priceUnit: "TL" as const,
    categoryId: "2",
    category: {
      id: "2",
      name: "Soğutma Sistemleri", 
      slug: "sogutma-sistemleri"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    title: "Isı Pompası Sistemleri",
    slug: "isi-pompasi-sistemleri", 
    description: "Enerji verimli ısı pompası çözümleri",
    excerpt: "Hava ve toprak kaynaklı ısı pompaları ile tasarruflu ısıtma.",
    thumbnail: "/images/services/isi-pompasi.jpg",
    images: ["/images/services/isi-pompasi.jpg"],
    isActive: true,
    isFeatured: false,
    order: 3,
    hasPrice: true,
    priceFrom: 15000,
    priceTo: 50000,
    priceUnit: "TL" as const,
    categoryId: "1",
    category: {
      id: "1",
      name: "Isıtma Sistemleri",
      slug: "isitma-sistemleri"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    title: "Radyatör ve Petek Sistemleri",
    slug: "radyator-petek-sistemleri",
    description: "Panel ve döküm radyatör montajı",
    excerpt: "Modern panel radyatörler ve klasik döküm petekler için montaj hizmeti.",
    thumbnail: "/images/services/radyator.jpg",
    images: ["/images/services/radyator.jpg"],
    isActive: true,
    isFeatured: false,
    order: 4,
    hasPrice: true,
    priceFrom: 200,
    priceTo: 800,
    priceUnit: "TL" as const,
    categoryId: "1",
    category: {
      id: "1",
      name: "Isıtma Sistemleri",
      slug: "isitma-sistemleri"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const getServiceIcon = (categorySlug: string) => {
  switch (categorySlug) {
    case "isitma-sistemleri":
      return Thermometer
    case "sogutma-sistemleri":
      return Snowflake
    default:
      return Wrench
  }
}

export function ServicesGrid({ services = mockServices, className, showAll = false }: ServicesGridProps) {
  const displayServices = showAll ? services : services.slice(0, 6)

  return (
    <section className={cn("section-padding", className)}>
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-heating-200 bg-heating-50 px-3 py-1 text-xs font-medium text-heating-700 mb-4">
            <Wrench className="mr-2 h-3 w-3" />
            Profesyonel Hizmetlerimiz
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl mb-4">
            <span className="block">Uzman</span>
            <span className="block text-gradient-heating">Hizmet Çözümleri</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            20+ yıllık deneyimimizle, ısıtma ve soğutma sistemleriniz için
            en kaliteli hizmetleri sunuyoruz.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {displayServices.map((service, index) => {
            const Icon = getServiceIcon(service.category?.slug || "")
            
            return (
              <Card 
                key={service.id}
                className={cn(
                  "group relative card-hover border-none shadow-card bg-white overflow-hidden",
                  "animate-fade-in-up"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Featured Badge */}
                {service.isFeatured && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-heating-500 text-white">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      Popüler
                    </Badge>
                  </div>
                )}

                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-heating-100 to-primary-100 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className="h-20 w-20 text-heating-500 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute bottom-4 right-4">
                    <Badge variant="secondary" className="text-xs">
                      {service.category?.name}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-heating-600 transition-colors">
                    {service.title}
                  </h3>
                  {service.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {service.excerpt}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Price Range */}
                  {service.hasPrice && service.priceFrom && (
                    <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Fiyat Aralığı:</span>
                      <span className="font-semibold text-heating-600">
                        {service.priceFrom}
                        {service.priceTo && service.priceTo !== service.priceFrom && ` - ${service.priceTo}`}
                        {" "}{service.priceUnit}
                      </span>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-0 gap-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={`/hizmetler/${service.slug}`}>
                      Detaylar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <Button asChild size="sm" className="btn-heating">
                    <Link href="/iletisim">
                      <Phone className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* View All Button */}
        {!showAll && services.length > 6 && (
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="btn-secondary">
              <Link href="/hizmetler">
                Tüm Hizmetleri Gör
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
} 