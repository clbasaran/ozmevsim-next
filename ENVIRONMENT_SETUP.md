# 🔧 **ENVIRONMENT VARIABLES SETUP - ÖZ MEVSİM ISI SİSTEMLERİ**

## **PRODUCTION DEPLOYMENT ENV AYARLARI**

### **1. APPLICATION SETTINGS**
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://ozmevsim.com
NEXT_PUBLIC_API_URL=https://ozmevsim.com/api
```

### **2. CLOUDFLARE D1 DATABASE**
```bash
DATABASE_URL="YOUR_D1_DATABASE_URL"
D1_DATABASE_ID="YOUR_D1_DATABASE_ID"
```

### **3. JWT AUTHENTICATION**
```bash
JWT_SECRET="your-super-secret-jwt-key-min-32-characters"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-min-32-characters"
```

### **4. CLOUDFLARE R2 STORAGE**
```bash
R2_BUCKET_NAME=ozmevsim-media
R2_ACCOUNT_ID="your-cloudflare-account-id"
```

### **5. CLOUDFLARE KV CACHE**
```bash
KV_NAMESPACE_ID="your-kv-namespace-id"
```

---

## **WRANGLER SECRETS SETUP**

```bash
# JWT Authentication
wrangler secret put JWT_SECRET
wrangler secret put JWT_REFRESH_SECRET

# Database
wrangler secret put DATABASE_URL

# Email (if using SMTP)
wrangler secret put SMTP_USER
wrangler secret put SMTP_PASS
```

---

## **CLOUDFLARE SERVICES CREATION**

### **D1 Database**
```bash
wrangler d1 create ozmevsim
# Output database_id'yi wrangler.toml'a ekleyin
```

### **R2 Bucket**
```bash
wrangler r2 bucket create ozmevsim-media
```

### **KV Namespace**
```bash
wrangler kv:namespace create CACHE
# Output id'yi wrangler.toml'a ekleyin
```

---

## **SECURITY CONFIGURATION**

### **Required Settings**
- **JWT_SECRET**: Minimum 32 characters
- **JWT_REFRESH_SECRET**: Different from JWT_SECRET
- **Database Access**: Restricted IP access
- **HTTPS Only**: SSL/TLS enforced

### **Optional Settings**
- **SMTP Configuration**: Email functionality
- **Analytics**: Performance tracking
- **Rate Limiting**: API protection

---

## **DEPLOYMENT CHECKLIST**

- [ ] All environment variables configured
- [ ] Wrangler secrets set
- [ ] D1 database created and migrated
- [ ] R2 bucket permissions configured
- [ ] KV namespace active
- [ ] Domain DNS pointed to Cloudflare
- [ ] SSL certificate issued
- [ ] Security headers active

---

## **TROUBLESHOOTING**

### **Common Issues**
1. **JWT Token Errors**: Check secret length and encoding
2. **Database Connection**: Verify D1 database ID
3. **R2 Upload Fails**: Check bucket permissions
4. **Cache Issues**: Verify KV namespace ID

### **Debug Commands**
```bash
# Test database connection
wrangler d1 execute ozmevsim --command "SELECT 1"

# List R2 objects
wrangler r2 object list ozmevsim-media

# Check KV namespace
wrangler kv:key list --namespace-id=YOUR_KV_ID
``` 