# 🔥 Öz Mevsim Isı Sistemleri - Enterprise Website

> **Modern, high-performance heating systems website built with Next.js 14 and powered by Cloudflare Global Network**

## 🌟 **Project Overview**

**Öz Mevsim Isı Sistemleri** - Professional heating, boiler, and thermal systems services website with enterprise-grade architecture.

### 🎯 **Key Features**
- 🌍 **Global CDN**: Cloudflare edge network
- ⚡ **Lightning Fast**: Sub-100ms response times
- 🔒 **Enterprise Security**: JWT authentication + security headers
- 📱 **PWA Ready**: Offline functionality + app-like experience
- 🎨 **Modern UI/UX**: Turkish localization + responsive design
- 🚀 **Serverless**: Auto-scaling architecture

---

## 🛠️ **Tech Stack**

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library

### **Backend**
- **Cloudflare D1** - SQLite database with global edge replication
- **Cloudflare R2** - Object storage with CDN
- **Cloudflare KV** - Edge caching layer
- **Prisma ORM** - Database toolkit with D1 adapter

### **Infrastructure**
- **Cloudflare Pages** - Static site hosting
- **Cloudflare Workers** - Serverless functions
- **JWT Authentication** - Secure session management

---

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ and npm
- Cloudflare account
- Wrangler CLI

### **Installation**

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/ozmevsim-next.git
cd ozmevsim-next

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

### **Environment Variables**

```bash
# Database
DATABASE_URL="file:./dev.db"

# JWT Secrets
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"

# Cloudflare (for production)
CLOUDFLARE_ACCOUNT_ID="your-account-id"
CLOUDFLARE_API_TOKEN="your-api-token"
```

---

## 🌐 **Deployment**

### **Automatic Deployment (Recommended)**

1. **Connect to Cloudflare Pages:**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com)
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `out`

2. **Configure Environment Variables:**
   ```bash
   # In Cloudflare Pages settings
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://ozmevsim.com
   ```

3. **Setup Cloudflare Services:**
   ```bash
   # Create D1 database
   wrangler d1 create ozmevsim-db
   
   # Create R2 bucket
   wrangler r2 bucket create ozmevsim-media
   
   # Create KV namespace
   wrangler kv namespace create ozmevsim-cache
   ```

### **Manual Deployment**

```bash
# Build production
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy out --project-name ozmevsim
```

---

## 📊 **Database Schema**

```sql
-- Users for authentication
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'USER',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts
CREATE TABLE blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'DRAFT',
  author_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category_name TEXT NOT NULL,
  price REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🎨 **Design System**

### **Colors**
- **Primary**: Green-600 (#059669) - Heating/nature theme
- **Secondary**: Gray-900 (#111827) - Professional contrast
- **Accent**: Green-500 (#10B981) - Interactive elements

### **Typography**
- **Headings**: Inter Bold
- **Body**: Inter Regular  
- **Code**: JetBrains Mono

### **Components**
- Consistent spacing (4px grid)
- Rounded corners (8px default)
- Subtle shadows and transitions
- Mobile-first responsive design

---

## 🔧 **Development**

### **Scripts**

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript check

# Database
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema to database
npx prisma studio    # Open Prisma Studio

# Deployment
npm run deploy       # Deploy to Cloudflare Pages
```

### **Project Structure**

```
ozmevsim-next/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── components/          # React components
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   └── modules/        # Feature components
│   │   ├── lib/                # Utilities and configurations
│   │   └── types/              # TypeScript type definitions
│   ├── functions/              # Cloudflare Pages Functions
│   ├── prisma/                 # Database schema and migrations
│   ├── public/                 # Static assets
│   └── docs/                   # Documentation
├── functions/              # Cloudflare Pages Functions
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
└── docs/                   # Documentation
```

---

## 🔒 **Security**

### **Authentication**
- JWT-based authentication
- Secure session management
- Role-based access control

### **Security Headers**
- Content Security Policy (CSP)
- HSTS enforcement
- X-Frame-Options protection
- XSS protection

### **Rate Limiting**
- API endpoint protection
- DDoS mitigation
- Cloudflare WAF integration

---

## 📈 **Performance**

### **Metrics**
- **Lighthouse Score**: >90
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1

### **Optimizations**
- Image optimization with Next.js
- Code splitting and lazy loading
- Edge caching with Cloudflare
- Bundle size optimization

---

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **Cloudflare** - Global edge infrastructure
- **Vercel** - Next.js development platform
- **Prisma** - Database toolkit
- **shadcn** - UI component library

---

## 📞 **Contact**

**Öz Mevsim Isı Sistemleri**
- 📧 Email: info@ozmevsim.com
- 📱 Phone: +90 555 123 45 67
- 🌐 Website: [ozmevsim.com](https://ozmevsim.com)
- 💬 WhatsApp: [+90 555 123 45 67](https://wa.me/905551234567)

---

<div align="center">

### 🚀 **Built with Enterprise-Grade Technology**

**Powered by Cloudflare Global Network** ⚡

[🌍 Live Demo](https://ozmevsim.com) • [📚 Documentation](./docs) • [🐛 Report Bug](https://github.com/YOUR_USERNAME/ozmevsim-next/issues)

</div>
