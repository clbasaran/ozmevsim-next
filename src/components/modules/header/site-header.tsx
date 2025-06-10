"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  Menu,
  X,
  Home,
  Info,
  Wrench,
  Package,
  BookOpen,
  HelpCircle,
  Phone
} from "lucide-react"

const navigation = [
  { name: "Ana Sayfa", href: "/", icon: Home },
  { name: "Hakkımızda", href: "/hakkimizda", icon: Info },
  { name: "Hizmetler", href: "/hizmetler", icon: Wrench },
  { name: "Ürünler", href: "/urunler", icon: Package },
  { name: "Blog", href: "/blog", icon: BookOpen },
  { name: "SSS", href: "/sss", icon: HelpCircle },
  { name: "İletişim", href: "/iletisim", icon: Phone },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-heating-500 to-primary-500 text-white font-bold">
            ÖM
          </div>
          <span className="hidden font-heading text-xl font-bold sm:inline-block">
            Öz Mevsim
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1">
          <ul className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 transition-colors hover:text-foreground/80",
                      pathname === item.href 
                        ? "text-foreground" 
                        : "text-foreground/60"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center space-x-4">
          <Button asChild className="btn-heating">
            <Link href="/iletisim">
              <Phone className="mr-2 h-4 w-4" />
              Hemen Ara
            </Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="border-t md:hidden">
          <div className="container py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href 
                        ? "bg-accent text-accent-foreground" 
                        : ""
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              
              {/* Mobile CTA */}
              <div className="pt-4 border-t">
                <Button asChild className="w-full btn-heating">
                  <Link href="/iletisim">
                    <Phone className="mr-2 h-4 w-4" />
                    Hemen Ara
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
} 