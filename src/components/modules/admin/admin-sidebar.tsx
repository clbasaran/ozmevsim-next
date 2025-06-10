"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Wrench,
  MessageSquare, 
  HelpCircle, 
  Users, 
  Settings, 
  Image, 
  BarChart3,
  Calendar,
  Globe,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  user: {
    id: string
    email: string
    name: string | null
    role: string
  }
}

interface MenuSection {
  title: string
  items: MenuItem[]
}

interface MenuItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: string
  children?: MenuItem[]
}

const menuSections: MenuSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Genel Bakış",
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "İçerik Yönetimi",
    items: [
      {
        title: "Blog",
        href: "/admin/blog",
        icon: FileText,
        children: [
          {
            title: "Yazılar",
            href: "/admin/blog/posts",
            icon: FileText,
          },
          {
            title: "Kategoriler",
            href: "/admin/blog/categories",
            icon: FileText,
          },
          {
            title: "Etiketler",
            href: "/admin/blog/tags",
            icon: FileText,
          },
        ],
      },
      {
        title: "Hizmetler",
        href: "/admin/services",
        icon: Wrench,
        children: [
          {
            title: "Hizmetler",
            href: "/admin/services/list",
            icon: Wrench,
          },
          {
            title: "Kategoriler",
            href: "/admin/services/categories",
            icon: Wrench,
          },
        ],
      },
      {
        title: "Ürünler",
        href: "/admin/products",
        icon: Package,
        children: [
          {
            title: "Ürünler",
            href: "/admin/products/list",
            icon: Package,
          },
          {
            title: "Kategoriler",
            href: "/admin/products/categories",
            icon: Package,
          },
        ],
      },
      {
        title: "SSS",
        href: "/admin/faq",
        icon: HelpCircle,
        children: [
          {
            title: "Sorular",
            href: "/admin/faq/list",
            icon: HelpCircle,
          },
          {
            title: "Kategoriler",
            href: "/admin/faq/categories",
            icon: HelpCircle,
          },
        ],
      },
    ],
  },
  {
    title: "İletişim & Müşteriler",
    items: [
      {
        title: "İletişim Mesajları",
        href: "/admin/contacts",
        icon: MessageSquare,
        badge: "5", // This would be dynamic
      },
    ],
  },
  {
    title: "Site Yönetimi",
    items: [
      {
        title: "Ana Sayfa",
        href: "/admin/homepage",
        icon: Globe,
        children: [
          {
            title: "Hero Section",
            href: "/admin/homepage/hero",
            icon: Image,
          },
          {
            title: "Slider",
            href: "/admin/homepage/slider",
            icon: Image,
          },
        ],
      },
      {
        title: "Medya",
        href: "/admin/media",
        icon: Image,
      },
      {
        title: "Ayarlar",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
]

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    )
  }

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(href)
  }

  const isExpanded = (href: string) => expandedItems.includes(href)

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const Icon = item.icon
    const hasChildren = item.children && item.children.length > 0
    const active = isActive(item.href)
    const expanded = isExpanded(item.href)

    return (
      <div key={item.href}>
        <div
          className={cn(
            "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            level === 0 ? "ml-0" : "ml-6",
            active
              ? "bg-orange-100 text-orange-700"
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <Link
            href={item.href}
            className={cn(
              "flex items-center flex-1",
              hasChildren && "cursor-default"
            )}
            onClick={(e) => {
              if (hasChildren) {
                e.preventDefault()
                toggleExpanded(item.href)
              }
            }}
          >
            <Icon className="w-5 h-5 mr-3" />
            <span>{item.title}</span>
            {item.badge && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
          {hasChildren && (
            <button
              onClick={() => toggleExpanded(item.href)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {expanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {hasChildren && expanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/admin" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">ÖM</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">Admin Panel</h1>
            <p className="text-sm text-gray-500">Öz Mevsim Isı</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {menuSections.map((section) => (
          <div key={section.title}>
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => renderMenuItem(item))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">
              {user.name?.charAt(0) || user.email.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name || user.email}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 