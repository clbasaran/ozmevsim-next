"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Search, 
  Bell, 
  Menu, 
  User, 
  Settings, 
  LogOut,
  Plus,
  Eye,
  BarChart3
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminHeaderProps {
  user: {
    id: string
    email: string
    name: string | null
    role: string
  }
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })
      
      if (response.ok) {
        router.push("/admin/login")
        router.refresh()
      }
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const quickActions = [
    {
      title: "Yeni Blog Yazısı",
      href: "/admin/blog/posts/new",
      icon: Plus,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Yeni Hizmet",
      href: "/admin/services/new",
      icon: Plus,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Site Önizleme",
      href: "/",
      icon: Eye,
      color: "bg-purple-500 hover:bg-purple-600",
      external: true,
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ]

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      {/* Mobile menu button */}
      <button
        className="lg:hidden p-2 rounded-md hover:bg-gray-100"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Ara... (blog, hizmet, ürün, iletişim)"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="hidden md:flex items-center space-x-2 mr-4">
        {quickActions.map((action) => {
          const Icon = action.icon
          const isExternal = action.external
          
          if (isExternal) {
            return (
              <Link
                key={action.href}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${action.color} text-white p-2 rounded-md transition-colors`}
                title={action.title}
              >
                <Icon className="h-4 w-4" />
              </Link>
            )
          }

          return (
            <Link
              key={action.href}
              href={action.href}
              className={`${action.color} text-white p-2 rounded-md transition-colors`}
              title={action.title}
            >
              <Icon className="h-4 w-4" />
            </Link>
          )
        })}
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Bildirimler</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-2 p-2">
              <div className="p-3 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                <p className="text-sm font-medium">Yeni İletişim Mesajı</p>
                <p className="text-xs text-gray-600">Ahmet Yılmaz'dan klima servisi talebi</p>
                <p className="text-xs text-gray-400 mt-1">5 dakika önce</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50 border-l-4 border-green-500">
                <p className="text-sm font-medium">Yeni Blog Yorumu</p>
                <p className="text-xs text-gray-600">"Kombiler" yazısına yorum yapıldı</p>
                <p className="text-xs text-gray-400 mt-1">2 saat önce</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50 border-l-4 border-orange-500">
                <p className="text-sm font-medium">Site Performansı</p>
                <p className="text-xs text-gray-600">Lighthouse skoru güncellendi: 95/100</p>
                <p className="text-xs text-gray-400 mt-1">1 gün önce</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/admin/notifications" className="w-full text-center text-sm">
                Tüm bildirimleri görüntüle
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">
                  {user.name?.charAt(0) || user.email.charAt(0)}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{user.name || "Admin"}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Ayarlar</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Çıkış Yap</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
} 