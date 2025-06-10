'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application Error:', error)
    
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // sendToErrorTracking(error)
    }
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Bir Hata Oluştu
        </h1>
        
        <p className="text-gray-600 mb-8">
          Üzgünüz, beklenmeyen bir hata meydana geldi. Lütfen sayfayı yenileyin veya ana sayfaya dönün.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-sm text-gray-700 mb-2">Hata Detayları:</h3>
            <pre className="text-xs text-red-600 overflow-auto">
              {error.message}
            </pre>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-2">
                Hata ID: {error.digest}
              </p>
            )}
          </div>
        )}
        
        <div className="space-y-3">
          <Button
            onClick={reset}
            className="w-full"
            size="lg"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tekrar Dene
          </Button>
          
          <Button
            asChild
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Ana Sayfaya Dön
            </Link>
          </Button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Problem devam ederse{' '}
            <Link href="/iletisim" className="text-orange-600 hover:underline">
              iletişime geçin
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 