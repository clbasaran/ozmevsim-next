import { SiteHeader } from "@/components/modules/header/site-header"
import { HeroSection } from "@/components/modules/hero/hero-section"
import { ServicesGrid } from "@/components/modules/services/services-grid"
import { ProductsGrid } from "@/components/modules/products/products-grid"
import { BlogGrid } from "@/components/modules/blog/blog-grid"
import { FAQSection } from "@/components/modules/faq/faq-section"
import { ContactSection } from "@/components/modules/contact/contact-section"
import { SiteFooter } from "@/components/modules/footer/site-footer"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <HeroSection />
      <ServicesGrid />
      <ProductsGrid />
      <BlogGrid />
      <FAQSection />
      <ContactSection />
      <SiteFooter />
    </>
  )
}
