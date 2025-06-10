import { 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  Package,
  Wrench,
  HelpCircle,
  Eye,
  Calendar,
  Clock
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// This would normally come from the database
const mockStats = {
  totalVisitors: 12847,
  visitorsChange: 12.5,
  totalMessages: 23,
  messagesChange: -5.2,
  totalPosts: 45,
  postsChange: 8.3,
  totalServices: 12,
  servicesChange: 0,
}

const mockRecentActivities = [
  {
    id: 1,
    type: "contact",
    title: "Yeni İletişim Mesajı",
    description: "Ahmet Yılmaz'dan klima servisi talebi",
    time: "5 dakika önce",
    icon: MessageSquare,
    color: "text-blue-600",
  },
  {
    id: 2,
    type: "blog",
    title: "Blog Yazısı Yayınlandı",
    description: '"Enerji Tasarruflu Kombiler" yazısı yayınlandı',
    time: "2 saat önce",
    icon: FileText,
    color: "text-green-600",
  },
  {
    id: 3,
    type: "service",
    title: "Hizmet Güncellendi",
    description: "Klima Bakım Servisi bilgileri güncellendi",
    time: "1 gün önce",
    icon: Wrench,
    color: "text-orange-600",
  },
  {
    id: 4,
    type: "visit",
    title: "Yüksek Trafik",
    description: "Son 24 saatte 1,200+ ziyaretçi",
    time: "1 gün önce",
    icon: TrendingUp,
    color: "text-purple-600",
  },
]

const quickActions = [
  {
    title: "Yeni Blog Yazısı",
    description: "Blog içeriği oluşturun",
    href: "/admin/blog/posts/new",
    icon: FileText,
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    title: "Yeni Hizmet",
    description: "Hizmet sayfası ekleyin",
    href: "/admin/services/new",
    icon: Wrench,
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    title: "Ürün Ekle",
    description: "Kataloga ürün ekleyin",
    href: "/admin/products/new",
    icon: Package,
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    title: "SSS Ekle",
    description: "Sık sorulan soru ekleyin",
    href: "/admin/faq/new",
    icon: HelpCircle,
    color: "bg-orange-500 hover:bg-orange-600",
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Öz Mevsim Isı Sistemleri - Admin Panel Genel Bakış
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button asChild>
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <Eye className="w-4 h-4 mr-2" />
              Site Önizleme
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Ziyaretçi</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={mockStats.visitorsChange > 0 ? "text-green-600" : "text-red-600"}>
                {mockStats.visitorsChange > 0 ? "+" : ""}{mockStats.visitorsChange}%
              </span>{" "}
              geçen aya göre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">İletişim Mesajları</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              <span className={mockStats.messagesChange > 0 ? "text-green-600" : "text-red-600"}>
                {mockStats.messagesChange > 0 ? "+" : ""}{mockStats.messagesChange}%
              </span>{" "}
              geçen aya göre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Yazıları</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              <span className={mockStats.postsChange > 0 ? "text-green-600" : "text-red-600"}>
                {mockStats.postsChange > 0 ? "+" : ""}{mockStats.postsChange}%
              </span>{" "}
              geçen aya göre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hizmetler</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalServices}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-gray-600">Aktif hizmet sayısı</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Son Aktiviteler</CardTitle>
            <CardDescription>
              Sistem genelindeki son aktiviteler
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentActivities.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                      <div className="flex items-center pt-2">
                        <Clock className="w-3 h-3 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full">
                Tüm Aktiviteleri Görüntüle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Hızlı İşlemler</CardTitle>
            <CardDescription>
              Sık kullanılan işlemler
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={`${action.color} text-white p-4 rounded-lg block transition-colors`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <div>
                        <p className="font-medium">{action.title}</p>
                        <p className="text-sm opacity-90">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>Sistem Durumu</CardTitle>
          <CardDescription>
            Sistem sağlığı ve performans metrikleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <h3 className="font-medium">Database</h3>
              <p className="text-sm text-green-600">Çalışıyor</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <h3 className="font-medium">API</h3>
              <p className="text-sm text-green-600">Çalışıyor</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <h3 className="font-medium">CDN</h3>
              <p className="text-sm text-green-600">Çalışıyor</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 