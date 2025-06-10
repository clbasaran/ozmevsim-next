"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Phone, 
  Mail, 
  ArrowRight, 
  CheckCircle,
  Thermometer,
  Snowflake,
  Shield,
  Clock
} from "lucide-react"

const features = [
  {
    icon: Thermometer,
    title: "Isıtma Sistemleri",
    description: "Kombi, kalorifer ve ısı pompası sistemleri"
  },
  {
    icon: Snowflake,
    title: "Soğutma Sistemleri",
    description: "Klima ve havalandırma çözümleri"
  },
  {
    icon: Shield,
    title: "Güvenilir Hizmet",
    description: "20+ yıl deneyim ve garanti"
  },
  {
    icon: Clock,
    title: "7/24 Destek",
    description: "Acil durum ve bakım hizmetleri"
  }
]

const benefits = [
  "Ücretsiz keşif ve teknik analiz",
  "Profesyonel montaj garantisi",
  "Kaliteli markalar ve ürünler",
  "Uygun fiyat ve ödeme seçenekleri",
  "Periyodik bakım hizmetleri"
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-heating-50 via-white to-primary-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container relative">
        <div className="grid gap-12 py-20 md:py-28 lg:grid-cols-2 lg:gap-16">
          
          {/* Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-heating-200 bg-heating-50 px-3 py-1 text-xs font-medium text-heating-700">
                <Thermometer className="mr-2 h-3 w-3" />
                Profesyonel Isı Sistemleri Uzmanı
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Evinizin</span>
                <span className="block text-gradient-heating">Konfor Uzmanı</span>
              </h1>
              
              <p className="text-lg text-gray-600 sm:text-xl">
                20+ yıllık deneyimimizle, ev ve işyerleriniz için en kaliteli ısıtma, 
                soğutma ve klima sistemleri sunuyoruz. Güvenilir hizmet, profesyonel çözümler.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-heating-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button asChild size="lg" className="btn-heating text-base">
                <Link href="/iletisim">
                  <Phone className="mr-2 h-5 w-5" />
                  Hemen Ara
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="/hizmetler">
                  Hizmetlerimiz
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200 sm:flex-row sm:space-x-6 sm:space-y-0">
              <a 
                href="tel:+905551234567" 
                className="flex items-center text-sm text-gray-600 hover:text-heating-600 transition-colors"
              >
                <Phone className="mr-2 h-4 w-4" />
                +90 555 123 45 67
              </a>
              <a 
                href="mailto:info@ozmevsim.com" 
                className="flex items-center text-sm text-gray-600 hover:text-heating-600 transition-colors"
              >
                <Mail className="mr-2 h-4 w-4" />
                info@ozmevsim.com
              </a>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card 
                  key={index} 
                  className="group card-hover border-none shadow-gentle bg-white/80 backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-heating-500 to-primary-500 text-white group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-heating-500/10 to-primary-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-10 right-10 w-20 h-20 bg-heating-200 rounded-full opacity-20 animate-bounce-gentle" />
      <div className="absolute bottom-10 left-10 w-16 h-16 bg-primary-200 rounded-full opacity-20 animate-bounce-gentle delay-1000" />
    </section>
  )
} 