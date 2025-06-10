import { Button } from '@/components/ui/button'
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-8 h-8 text-orange-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Sayfa Bulunamadı
        </h2>
        
        <p className="text-gray-600 mb-8">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir. Lütfen URL'yi kontrol edin.
        </p>
        
        <div className="space-y-3">
          <Button
            asChild
            className="w-full"
            size="lg"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Ana Sayfaya Dön
            </Link>
          </Button>
          
          <Button
            asChild
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => window.history.back()}
          >
            <button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri Dön
            </button>
          </Button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">Popüler Sayfalar</h3>
          <div className="space-y-2">
            <Link
              href="/hizmetler"
              className="block text-sm text-orange-600 hover:underline"
            >
              Hizmetlerimiz
            </Link>
            <Link
              href="/urunler"
              className="block text-sm text-orange-600 hover:underline"
            >
              Ürünlerimiz
            </Link>
            <Link
              href="/blog"
              className="block text-sm text-orange-600 hover:underline"
            >
              Blog
            </Link>
            <Link
              href="/iletisim"
              className="block text-sm text-orange-600 hover:underline"
            >
              İletişim
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 