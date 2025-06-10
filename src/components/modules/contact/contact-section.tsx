"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  CheckCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ContactSectionProps {
  className?: string
}

export function ContactSection({ className }: ContactSectionProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    serviceType: ""
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setSubmitted(true)
    setIsSubmitting(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (submitted) {
    return (
      <section className={cn("section-padding", className)}>
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Mesajınız Başarıyla Gönderildi!
              </h2>
              <p className="text-gray-600">
                En kısa sürede size geri dönüş yapacağız. İletişim bilgilerinizi kontrol etmeyi unutmayın.
              </p>
            </div>
            <Button onClick={() => setSubmitted(false)} variant="outline">
              Yeni Mesaj Gönder
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={cn("section-padding", className)}>
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 mb-4">
            <MessageCircle className="mr-2 h-3 w-3" />
            Bize Ulaşın
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl mb-4">
            <span className="block">Hemen</span>
            <span className="block text-gradient-heating">İletişime Geçin</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Uzman ekibimiz size en iyi hizmeti sunmak için hazır.
            Projeleriniz için ücretsiz keşif ve danışmanlık hizmeti alın.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            {/* Quick Contact Cards */}
            <div className="space-y-6">
              <Card className="border-none shadow-card bg-gradient-to-br from-heating-50 to-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-heating-500 rounded-lg flex items-center justify-center">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Hemen Arayın</h3>
                      <p className="text-heating-600 font-medium">0555 123 45 67</p>
                      <p className="text-sm text-gray-600">7/24 Acil Servis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-card bg-gradient-to-br from-blue-50 to-primary-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">E-posta Gönderin</h3>
                      <p className="text-blue-600 font-medium">info@ozmevsim.com</p>
                      <p className="text-sm text-gray-600">24 saat içinde yanıt</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-card bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Ofisimizi Ziyaret Edin</h3>
                      <p className="text-green-600 font-medium">Merkez Mahallesi</p>
                      <p className="text-sm text-gray-600">İstanbul, Türkiye</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Working Hours */}
            <Card className="border-none shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-heating-500" />
                  Çalışma Saatleri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pazartesi - Cuma</span>
                  <span className="font-medium">08:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cumartesi</span>
                  <span className="font-medium">09:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pazar</span>
                  <Badge variant="secondary">Acil Servis</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-card">
              <CardHeader>
                <CardTitle className="text-xl">İletişim Formu</CardTitle>
                <p className="text-gray-600">
                  Detaylı bilgi ve ücretsiz keşif için formu doldurun.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Service Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hizmet Türü
                    </label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-heating-500 focus:border-transparent"
                      required
                    >
                      <option value="">Seçiniz</option>
                      <option value="kombi">Kombi Kurulum/Bakım</option>
                      <option value="klima">Klima Sistemleri</option>
                      <option value="radyator">Radyatör/Petek</option>
                      <option value="isi-pompasi">Isı Pompası</option>
                      <option value="genel">Genel Danışmanlık</option>
                      <option value="acil">Acil Servis</option>
                    </select>
                  </div>

                  {/* Name and Email Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ad Soyad *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Adınız ve soyadınız"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-posta *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="ornek@email.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone and Subject Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefon *
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="0555 123 45 67"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Konu
                      </label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Konu başlığı"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mesajınız *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Detaylı mesajınızı buraya yazın..."
                      rows={6}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      type="submit" 
                      className="btn-heating flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Gönderiliyor...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Mesaj Gönder
                        </>
                      )}
                    </Button>
                    
                    <Button asChild variant="outline" className="sm:w-auto">
                      <a href="tel:+905551234567">
                        <Phone className="mr-2 h-4 w-4" />
                        Hemen Ara
                      </a>
                    </Button>
                  </div>

                  {/* Privacy Notice */}
                  <p className="text-xs text-gray-500">
                    Formu göndererek kişisel verilerinizin işlenmesini kabul etmiş olursunuz.
                    Detaylı bilgi için{" "}
                    <a href="/gizlilik" className="text-heating-500 hover:underline">
                      Gizlilik Politikası
                    </a>
                    'nı inceleyebilirsiniz.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
} 