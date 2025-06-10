import { PrismaClient } from '../src/generated/prisma'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await hashPassword('admin123')
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ozmevsim.com' },
    update: {},
    create: {
      email: 'admin@ozmevsim.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create service categories
  const serviceCategories = [
    {
      name: 'Kombi Servisi',
      slug: 'kombi-servisi',
      description: 'Profesyonel kombi bakım ve onarım hizmetleri',
      icon: 'Wrench',
      order: 1,
    },
    {
      name: 'Klima Servisi',
      slug: 'klima-servisi',
      description: 'Klima montaj, bakım ve onarım hizmetleri',
      icon: 'Snowflake',
      order: 2,
    },
    {
      name: 'Radyatör Servisi',
      slug: 'radyator-servisi',
      description: 'Radyatör bakım ve onarım hizmetleri',
      icon: 'Thermometer',
      order: 3,
    },
  ]

  for (const category of serviceCategories) {
    await prisma.serviceCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  console.log('✅ Service categories created')

  // Create product categories
  const productCategories = [
    {
      name: 'Kombiler',
      slug: 'kombiler',
      description: 'Yüksek kaliteli kombi modelleri',
      icon: 'Package',
      order: 1,
    },
    {
      name: 'Klimalar',
      slug: 'klimalar',
      description: 'Enerji verimli klima sistemleri',
      icon: 'Wind',
      order: 2,
    },
    {
      name: 'Radyatörler',
      slug: 'radyatorler',
      description: 'Panel ve döküm radyatör çeşitleri',
      icon: 'Square',
      order: 3,
    },
  ]

  for (const category of productCategories) {
    await prisma.productCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  console.log('✅ Product categories created')

  // Create blog categories
  const blogCategories = [
    {
      name: 'Kombi Rehberi',
      slug: 'kombi-rehberi',
      description: 'Kombi bakım ve kullanım rehberleri',
      color: '#ef4444',
      order: 1,
    },
    {
      name: 'Klima İpuçları',
      slug: 'klima-ipuclari',
      description: 'Klima bakım ve verimlilik ipuçları',
      color: '#3b82f6',
      order: 2,
    },
    {
      name: 'Enerji Tasarrufu',
      slug: 'enerji-tasarrufu',
      description: 'Enerji tasarrufu yöntemleri',
      color: '#22c55e',
      order: 3,
    },
  ]

  for (const category of blogCategories) {
    await prisma.blogCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  console.log('✅ Blog categories created')

  // Create FAQ categories
  const faqCategories = [
    {
      name: 'Genel',
      slug: 'genel',
      description: 'Genel sorular',
      icon: 'HelpCircle',
      order: 1,
    },
    {
      name: 'Kombi',
      slug: 'kombi',
      description: 'Kombi ile ilgili sorular',
      icon: 'Wrench',
      order: 2,
    },
    {
      name: 'Klima',
      slug: 'klima',
      description: 'Klima ile ilgili sorular',
      icon: 'Snowflake',
      order: 3,
    },
  ]

  for (const category of faqCategories) {
    await prisma.faqCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  console.log('✅ FAQ categories created')

  // Create sample FAQs
  const generalCategory = await prisma.faqCategory.findUnique({
    where: { slug: 'genel' }
  })

  if (generalCategory) {
    const faqs = [
      {
        question: 'Hizmet saatleriniz nedir?',
        answer: 'Pazartesi-Cumartesi 08:00-18:00 saatleri arasında hizmet vermekteyiz. Acil durumlar için 24 saat destek sağlamaktayız.',
        order: 1,
        categoryId: generalCategory.id,
      },
      {
        question: 'Hangi bölgelerde hizmet veriyorsunuz?',
        answer: 'İstanbul Anadolu ve Avrupa yakasının tüm ilçelerinde hizmet vermekteyiz. Detaylı bilgi için iletişime geçiniz.',
        order: 2,
        categoryId: generalCategory.id,
      },
      {
        question: 'Garantili hizmet veriyor musunuz?',
        answer: 'Tüm hizmetlerimiz için garanti vermekteyiz. Garanti süresi hizmet türüne göre değişiklik göstermektedir.',
        order: 3,
        categoryId: generalCategory.id,
      },
    ]

    for (const faq of faqs) {
      await prisma.faq.upsert({
        where: { id: `faq-${faq.order}` },
        update: {},
        create: {
          id: `faq-${faq.order}`,
          ...faq,
        },
      })
    }
  }

  console.log('✅ Sample FAQs created')

  // Create hero slides
  const heroSlides = [
    {
      title: 'Profesyonel Kombi Servisi',
      subtitle: 'Güvenilir ve Hızlı',
      description: 'Deneyimli teknisyenlerimizle tüm marka kombiler için profesyonel bakım ve onarım hizmeti.',
      image: '/images/hero-kombi.jpg',
      buttonText: 'Hemen Ara',
      buttonLink: 'tel:+902121234567',
      buttonType: 'primary',
      textPosition: 'left',
      overlay: true,
      overlayColor: '#000000',
      isActive: true,
      order: 1,
    },
    {
      title: 'Klima Montaj ve Servisi',
      subtitle: 'Enerji Verimli Çözümler',
      description: 'Klima montajından bakımına kadar tüm ihtiyaçlarınız için profesyonel hizmet.',
      image: '/images/hero-klima.jpg',
      buttonText: 'Keşfet',
      buttonLink: '/hizmetler/klima-servisi',
      buttonType: 'secondary',
      textPosition: 'center',
      overlay: true,
      overlayColor: '#1e40af',
      isActive: true,
      order: 2,
    },
  ]

  for (const slide of heroSlides) {
    await prisma.heroSlide.upsert({
      where: { id: `hero-${slide.order}` },
      update: {},
      create: {
        id: `hero-${slide.order}`,
        ...slide,
      },
    })
  }

  console.log('✅ Hero slides created')

  // Create site settings
  const siteSettings = [
    {
      key: 'site_title',
      value: 'Öz Mevsim Isı Sistemleri',
      type: 'text',
      group: 'general',
      description: 'Site başlığı',
    },
    {
      key: 'site_description',
      value: 'İstanbul\'da kombi, klima ve radyatör servisi. Profesyonel bakım ve onarım hizmetleri.',
      type: 'text',
      group: 'general',
      description: 'Site açıklaması',
    },
    {
      key: 'contact_phone',
      value: '+90 212 123 45 67',
      type: 'text',
      group: 'contact',
      description: 'İletişim telefonu',
    },
    {
      key: 'contact_email',
      value: 'info@ozmevsim.com',
      type: 'text',
      group: 'contact',
      description: 'İletişim e-postası',
    },
    {
      key: 'contact_address',
      value: 'İstanbul, Türkiye',
      type: 'text',
      group: 'contact',
      description: 'Adres bilgisi',
    },
  ]

  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }

  console.log('✅ Site settings created')

  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 