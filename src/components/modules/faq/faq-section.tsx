"use client"

import * as React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  HelpCircle, 
  Search,
  Phone,
  MessageCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Simple FAQ data - API'den gelecek
const mockFAQs = [
  {
    id: "1",
    question: "Kombimin bakımını ne sıklıkla yaptırmalıyım?",
    answer: "Kombininizin uzun ömürlü ve verimli çalışması için yılda bir kez profesyonel bakım yaptırmanız gerekmektedir.",
    category: "Kombi"
  },
  {
    id: "2", 
    question: "Klimamın filtrelerini ne zaman temizlemeliyim?",
    answer: "Klima filtrelerini ayda bir kontrol etmeli ve gerektiğinde temizlemelisiniz.",
    category: "Klima"
  },
  {
    id: "3",
    question: "Acil durumda nasıl ulaşabilirim?",
    answer: "7/24 acil servis hattımız 0555 123 45 67 numarasından bize ulaşabilirsiniz.",
    category: "Genel"
  }
]

interface FAQSectionProps {
  className?: string
  maxItems?: number
}

export function FAQSection({ className, maxItems = 6 }: FAQSectionProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  
  const filteredFAQs = React.useMemo(() => {
    let filtered = mockFAQs
    
    if (searchTerm) {
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    return filtered.slice(0, maxItems)
  }, [searchTerm, maxItems])

  return (
    <section className={cn("section-padding bg-gray-50", className)}>
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 mb-4">
            <HelpCircle className="mr-2 h-3 w-3" />
            Sıkça Sorulan Sorular
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl mb-4">
            <span className="block">Merak</span>
            <span className="block text-gradient-primary">Ettikleriniz</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            En çok sorulan soruların yanıtlarını burada bulabilirsiniz.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-lg mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Soru ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <AccordionItem 
                key={faq.id} 
                value={faq.id}
                className={cn(
                  "border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden",
                  "animate-fade-in-up"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-left">
                  <div className="flex items-start gap-4 flex-1">
                    <Badge variant="secondary" className="text-xs shrink-0 mt-1">
                      {faq.category}
                    </Badge>
                    <span className="font-medium text-gray-900 text-left">
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto border-none shadow-lg bg-gradient-to-r from-heating-50 to-primary-50">
            <CardHeader className="pb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Aradığınız cevabı bulamadınız mı?
              </h3>
              <p className="text-gray-600">
                Uzman ekibimiz size yardımcı olmaya hazır.
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="btn-heating">
                  <Link href="/iletisim">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    İletişim Formu
                  </Link>
                </Button>
                
                <Button asChild variant="outline">
                  <Link href="tel:+905551234567">
                    <Phone className="mr-2 h-4 w-4" />
                    Hemen Ara
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
} 