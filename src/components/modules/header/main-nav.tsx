"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { 
  Home, 
  Info, 
  Wrench, 
  Package, 
  BookOpen, 
  HelpCircle, 
  Phone,
  ChevronDown,
  Menu,
  X
} from "lucide-react"
import { type NavItem } from "@/lib/types"

const mainNavItems: NavItem[] = [
  {
    title: "Ana Sayfa",
    href: "/",
    icon: Home,
  },
  {
    title: "Hakkımızda",
    href: "/hakkimizda",
    icon: Info,
  },
  {
    title: "Hizmetlerimiz",
    href: "/hizmetler",
    icon: Wrench,
    children: [
      {
        title: "Isıtma Sistemleri",
        href: "/hizmetler/isitma",
        description: "Kombi, kalorifer ve ısı pompası sistemleri"
      },
      {
        title: "Soğutma Sistemleri", 
        href: "/hizmetler/sogutma",
        description: "Klima ve soğutma çözümleri"
      },
      {
        title: "Bakım & Onarım",
        href: "/hizmetler/bakim",
        description: "Periyodik bakım ve onarım hizmetleri"
      },
      {
        title: "Montaj & Kurulum",
        href: "/hizmetler/montaj",
        description: "Profesyonel montaj ve kurulum"
      }
    ]
  },
  {
    title: "Ürünlerimiz",
    href: "/urunler",
    icon: Package,
    children: [
      {
        title: "Kombiler",
        href: "/urunler/kombiler",
        description: "Yoğuşmalı ve konvansiyonel kombiler"
      },
      {
        title: "Klimalar",
        href: "/urunler/klimalar", 
        description: "Split, multi split ve VRF sistemler"
      },
      {
        title: "Radyatörler",
        href: "/urunler/radyatorler",
        description: "Panel ve döküm radyatörler"
      },
      {
        title: "Isı Pompaları",
        href: "/urunler/isi-pompalari",
        description: "Hava ve toprak kaynaklı ısı pompaları"
      }
    ]
  },
  {
    title: "Blog",
    href: "/blog",
    icon: BookOpen,
  },
  {
    title: "SSS",
    href: "/sss",
    icon: HelpCircle,
  },
  {
    title: "İletişim",
    href: "/iletisim",
    icon: Phone,
  },
]

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const renderIcon = (IconComponent: React.ComponentType<any>, className: string) => {
    return <IconComponent className={className} />
  }

  return (
    <div className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {/* Desktop Navigation */}
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList>
          {mainNavItems.map((item) => (
            <NavigationMenuItem key={item.href}>
              {item.children ? (
                <>
                  <NavigationMenuTrigger 
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname?.startsWith(item.href!) ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {item.icon && renderIcon(item.icon, "mr-2 h-4 w-4")}
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {item.children.map((child) => (
                        <ListItem
                          key={child.href}
                          title={child.title}
                          href={child.href!}
                        >
                          {child.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <Link href={item.href!} legacyBehavior passHref>
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname === item.href ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {item.icon && renderIcon(item.icon, "mr-2 h-4 w-4")}
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 top-full z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
          <div className="container py-4">
            <nav className="grid gap-2">
              {mainNavItems.map((item) => (
                <div key={item.href}>
                  {item.children ? (
                    <details className="group">
                      <summary className="flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-accent">
                        <div className="flex items-center">
                          {item.icon && renderIcon(item.icon, "mr-3 h-4 w-4")}
                          <span className="text-sm font-medium">{item.title}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="ml-7 mt-2 space-y-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href!}
                            className={cn(
                              "block rounded-md p-2 text-sm hover:bg-accent",
                              pathname === child.href ? "bg-accent text-accent-foreground" : ""
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    </details>
                  ) : (
                    <Link
                      href={item.href!}
                      className={cn(
                        "flex items-center rounded-md p-2 text-sm font-medium hover:bg-accent",
                        pathname === item.href ? "bg-accent text-accent-foreground" : ""
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon && renderIcon(item.icon, "mr-3 h-4 w-4")}
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem" 