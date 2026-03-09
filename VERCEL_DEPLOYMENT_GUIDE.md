# 🚀 Vercel Deployment Guide

## ⚠️ Database Migration Required

Your project uses **SQLite** which is not compatible with Vercel's serverless environment. You need to migrate to a cloud database.

## Option 1: Vercel Postgres (Recommended) ⭐

### Step 1: Create Vercel Postgres Database
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project → Storage → Create Database → Postgres
3. Copy the `DATABASE_URL` from the connection details

### Step 2: Update Environment Variables
In Vercel dashboard, add these environment variables:
```
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secure_jwt_secret
```

### Step 3: Update Prisma Schema
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

### Step 4: Update Prisma Config
```typescript
// prisma.config.ts
import { config } from 'dotenv';
config();

export default {
  schema: './prisma/schema.prisma',
};
```

### Step 5: Deploy
```bash
# Push schema to new database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Deploy to Vercel
vercel --prod
```

## Option 2: PlanetScale (MySQL)

### Step 1: Create PlanetScale Database
1. Sign up at [PlanetScale](https://planetscale.com)
2. Create a new database
3. Get the connection string

### Step 2: Update Schema
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

## Option 3: Supabase (PostgreSQL)

### Step 1: Create Supabase Project
1. Sign up at [Supabase](https://supabase.com)
2. Create a new project
3. Get the connection string from Settings → Database

### Step 2: Update Schema
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 📋 Deployment Checklist

- [ ] Choose and set up cloud database
- [ ] Update `DATABASE_URL` in Vercel environment variables
- [ ] Set `JWT_SECRET` in Vercel environment variables
- [ ] Update Prisma schema provider
- [ ] Run `npx prisma db push` to migrate data
- [ ] Test locally with new database
- [ ] Deploy to Vercel

## 🔧 Vercel Configuration

The `vercel.json` is already configured for:
- Next.js framework detection
- API route handling
- Build optimization
- Function timeout settings

## 🚀 Quick Deploy (After Database Setup)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## 📊 Expected Costs

- **Vercel Hobby Plan**: Free for personal projects
- **Database**: Free tiers available on all platforms
- **Total Cost**: $0 for small projects

Would you like me to help you set up any of these database options?