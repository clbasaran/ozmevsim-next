"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Thermometer,
  Award,
  Users,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SiteFooterProps {
  className?: string
}

export function SiteFooter({ className }: SiteFooterProps) {
  const [email, setEmail] = React.useState("")
  const [isSubscribing, setIsSubscribing] = React.useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setEmail("")
    setIsSubscribing(false)
  }

  const quickLinks = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Hizmetlerimiz", href: "/hizmetler" },
    { label: "Ürünlerimiz", href: "/urunler" },
    { label: "Blog", href: "/blog" },
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "İletişim", href: "/iletisim" }
  ]

  const services = [
    { label: "Kombi Kurulum", href: "/hizmetler/kombi-kurulum" },
    { label: "Klima Sistemleri", href: "/hizmetler/klima-sistemleri" },
    { label: "Radyatör Montajı", href: "/hizmetler/radyator-montaji" },
    { label: "Isı Pompası", href: "/hizmetler/isi-pompasi" },
    { label: "Bakım Hizmeti", href: "/hizmetler/bakim" },
    { label: "Acil Servis", href: "/hizmetler/acil-servis" }
  ]

  const legalLinks = [
    { label: "Gizlilik Politikası", href: "/gizlilik" },
    { label: "Kullanım Şartları", href: "/kullanim-sartlari" },
    { label: "Çerez Politikası", href: "/cerez-politikasi" },
    { label: "KVKK", href: "/kvkk" }
  ]

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/ozmevsim", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com/ozmevsim", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com/ozmevsim", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com/company/ozmevsim", label: "LinkedIn" },
    { icon: Youtube, href: "https://youtube.com/@ozmevsim", label: "YouTube" }
  ]

  const stats = [
    { icon: Users, value: "5000+", label: "Mutlu Müşteri" },
    { icon: Award, value: "15+", label: "Yıl Deneyim" },
    { icon: Thermometer, value: "24/7", label: "Acil Servis" },
    { icon: Clock, value: "2000+", label: "Tamamlanan Proje" }
  ]

  return (
    <footer className={cn("bg-gray-900 text-white", className)}>
      {/* Stats Section */}
      <div className="border-b border-gray-800">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4">
                  <stat.icon className="h-8 w-8 text-heating-400 mx-auto" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-gradient-to-br from-heating-500 to-heating-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">ÖM</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-white">Öz Mevsim</span>
                  <p className="text-xs text-gray-400">Isı Sistemleri</p>
                </div>
              </Link>
              
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                20+ yıllık deneyimimizle, ısıtma ve soğutma sistemlerinde
                uzman çözümler sunuyoruz. Evinizdeki konforun adresi.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-heating-400 flex-shrink-0" />
                  <span className="text-gray-300">0555 123 45 67</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-heating-400 flex-shrink-0" />
                  <span className="text-gray-300">info@ozmevsim.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-heating-400 flex-shrink-0" />
                  <span className="text-gray-300">Merkez Mah. İstanbul</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-semibold text-white mb-4">Sosyal Medya</h4>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 bg-gray-800 hover:bg-heating-500 rounded-lg flex items-center justify-center transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-6">Hızlı Bağlantılar</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-6">Hizmetlerimiz</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <Link 
                    href={service.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-6">Bülten</h4>
            <p className="text-gray-400 text-sm mb-4">
              Kampanyalar ve teknik bilgiler için e-bültenimize kayıt olun.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="E-posta adresiniz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-heating-500"
                required
              />
              <Button 
                type="submit"
                className="w-full btn-heating"
                disabled={isSubscribing}
              >
                {isSubscribing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Kayıt Ol
                  </>
                )}
              </Button>
            </form>

            {/* Certifications */}
            <div className="mt-6">
              <h5 className="font-medium text-white mb-3 text-sm">Sertifikalarımız</h5>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  ISO 9001
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  TSE
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  CE
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} Öz Mevsim Isı Sistemleri. Tüm hakları saklıdır.
            </div>
            
            <div className="flex flex-wrap gap-4">
              {legalLinks.map((link, index) => (
                <Link 
                  key={index}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 