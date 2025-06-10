# 🚀 Öz Mevsim Isı Sistemleri - Production Deployment Guide

## 📋 Deployment Overview

Bu proje **Next.js 14** ile geliştirilmiş, **holding kalitesinde** bir ısıtma sistemleri web sitesidir. Aşağıdaki adımlar ile production ortamında deploy edilir.

## 🔧 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Git repository
- Domain name (ozmevsim.com)

## 🌐 Recommended Deployment Stack

### Option 1: Cloudflare Pages + Supabase (Recommended)
```bash
# Database: Supabase PostgreSQL
# Frontend: Cloudflare Pages
# CDN: Cloudflare
# SSL: Cloudflare SSL
```

### Option 2: Vercel + Railway
```bash
# Database: Railway PostgreSQL  
# Frontend: Vercel
# CDN: Vercel Edge Network
```

## 📦 Environment Variables

### Production Environment (.env.production)
```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/ozmevsim_prod"

# Authentication  
JWT_SECRET="production-super-secret-jwt-key-minimum-32-characters"
JWT_REFRESH_SECRET="production-super-secret-refresh-jwt-key-minimum-32-characters"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
BCRYPT_SALT_ROUNDS="12"

# Site Configuration
SITE_URL="https://ozmevsim.com"
NEXT_PUBLIC_SITE_URL="https://ozmevsim.com"
NEXT_PUBLIC_SITE_NAME="Öz Mevsim Isı Sistemleri"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
CONTACT_EMAIL="info@ozmevsim.com"

# Security
SECURITY_HEADERS="true"
RATE_LIMIT_ENABLED="true"

# Production Mode
NODE_ENV="production"
```

## 🔄 Deployment Steps

### Step 1: Database Setup (Supabase)

1. **Create Supabase Project:**
   ```bash
   # Go to https://supabase.com
   # Create new project: "ozmevsim-prod"
   # Copy database URL
   ```

2. **Database Migration:**
   ```bash
   # Set environment variable
   export DATABASE_URL="postgresql://user:password@db.xyz.supabase.co:5432/postgres"
   
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed initial data (optional)
   npm run db:seed
   ```

### Step 2: Build and Test

```bash
# Install dependencies
npm ci

# Type check
npm run type-check

# Lint check
npm run lint

# Build production
npm run build:production

# Test build locally
npm run start
```

### Step 3: Cloudflare Pages Deployment

1. **Connect Repository:**
   ```bash
   # Push to GitHub/GitLab
   git add .
   git commit -m "Production ready deployment"
   git push origin main
   ```

2. **Configure Cloudflare Pages:**
   ```yaml
   # Build configuration
   Build command: npm run build:production
   Build output directory: .next
   Root directory: ozmevsim-next
   
   # Environment variables
   NODE_ENV=production
   DATABASE_URL=your_supabase_url
   JWT_SECRET=your_jwt_secret
   # ... add all other env vars
   ```

3. **Custom Domain Setup:**
   ```bash
   # Add custom domain: ozmevsim.com
   # Configure DNS records:
   # A record: @ -> Cloudflare IP
   # CNAME: www -> ozmevsim.com
   ```

### Step 4: SSL and Security

```bash
# Cloudflare SSL/TLS settings:
# - Full (strict) encryption
# - Always Use HTTPS: On
# - HTTP Strict Transport Security: Enabled
# - Minimum TLS Version: 1.2
```

## 🔒 Security Checklist

- [ ] JWT secrets are strong (32+ characters)
- [ ] Database credentials are secure
- [ ] HTTPS is enforced
- [ ] Rate limiting is enabled
- [ ] Security headers are configured
- [ ] Admin panel is protected
- [ ] Input validation is active
- [ ] CORS is properly configured

## 📊 Performance Checklist

- [ ] Images are optimized (WebP format)
- [ ] Bundle size is analyzed
- [ ] Static assets are compressed
- [ ] CDN is configured
- [ ] Database queries are optimized
- [ ] Caching strategies are implemented

## 🔍 Monitoring Setup

### 1. Analytics
```bash
# Add Google Analytics
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"

# Add Google Tag Manager  
GOOGLE_TAG_MANAGER_ID="GTM-XXXXXXX"
```

### 2. Error Tracking
```bash
# Optional: Add Sentry or similar
# Configure error monitoring in production
```

### 3. Uptime Monitoring
```bash
# Configure uptime monitoring
# Recommended: UptimeRobot, Pingdom
```

## 🚀 Post-Deployment Tasks

1. **Domain Verification:**
   ```bash
   curl -I https://ozmevsim.com
   # Should return 200 status with HTTPS
   ```

2. **Admin Panel Test:**
   ```bash
   # Visit: https://ozmevsim.com/admin/login
   # Test authentication
   # Test CRUD operations
   ```

3. **Performance Test:**
   ```bash
   # Run Lighthouse audit
   npx lighthouse https://ozmevsim.com --view
   
   # Target scores:
   # Performance: 95+
   # Accessibility: 95+
   # Best Practices: 95+
   # SEO: 95+
   ```

4. **Security Test:**
   ```bash
   # Test security headers
   curl -I https://ozmevsim.com
   
   # Verify:
   # - X-Frame-Options: DENY
   # - X-Content-Type-Options: nosniff
   # - Strict-Transport-Security
   ```

## 🔧 Maintenance

### Daily Tasks
- Monitor uptime and performance
- Check error logs
- Verify backup status

### Weekly Tasks  
- Review analytics data
- Update content as needed
- Check security alerts

### Monthly Tasks
- Update dependencies
- Performance optimization
- Security audit

## 📞 Support

For technical support and maintenance:
- **Developer:** Contact development team
- **Hosting:** Cloudflare support
- **Database:** Supabase support

## 🎯 Success Metrics

### Performance KPIs
- **Page Load Time:** < 3 seconds
- **Time to First Byte:** < 800ms
- **Cumulative Layout Shift:** < 0.1
- **First Contentful Paint:** < 1.5 seconds

### Business KPIs
- **Uptime:** 99.9%+
- **Contact Form Submissions:** Track monthly
- **Page Views:** Monitor growth
- **Bounce Rate:** < 40%

---

## 🏆 Production Readiness Checklist

- [x] Database schema migrated
- [x] Environment variables configured
- [x] Security headers implemented
- [x] Error handling configured
- [x] Rate limiting enabled
- [x] Admin panel secured
- [x] PWA features active
- [x] SEO optimized
- [x] Performance optimized
- [x] Monitoring configured

**Status: ✅ PRODUCTION READY** 