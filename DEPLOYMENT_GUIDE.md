# 🚀 Production Deployment Guide

## Overview

Your VoyageShield app has 3 components that need to be deployed separately:

1. **Frontend** (React) → Vercel
2. **Backend** (Node.js/Express) → Railway
3. **Database** (PostgreSQL) → Neon

All services have FREE tiers that are perfect for your app!

---

## 📦 Part 1: Deploy Database (Neon PostgreSQL)

### Step 1: Create Neon Account

1. Go to: https://neon.tech
2. Sign up with GitHub (easiest)
3. Click "Create Project"
4. Name: "VoyageShield"
5. Region: Choose closest to your users
6. Click "Create Project"

### Step 2: Get Database URL

1. After project is created, you'll see a connection string
2. It looks like: `postgresql://user:password@host.neon.tech/dbname`
3. **Copy this URL** - you'll need it for backend deployment

### Step 3: Run Migrations

On your local machine:

```bash
cd backend

# Update DATABASE_URL in .env temporarily with Neon URL
# Then run:
npx prisma migrate deploy
npx prisma db push
npx prisma db seed  # Optional: seed with initial data
```

✅ **Database is now live and accessible 24/7!**

---

## 🔧 Part 2: Deploy Backend (Railway)

### Step 1: Create Railway Account

1. Go to: https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Connect your GitHub account
6. Select your repository: `SmartTravel`

### Step 2: Configure Backend Service

1. Railway will detect your backend folder
2. Click "Add variables" to add environment variables:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=your_neon_database_url_here
JWT_SECRET=your_secure_random_secret_here
EMAIL_USER=ngabolu@gmail.com
EMAIL_PASSWORD=tlqnvynfqmelkiyc
STRIPE_SECRET_KEY=your_stripe_key_here
```

### Step 3: Set Root Directory

1. In Railway settings, set "Root Directory" to: `backend`
2. Set "Start Command" to: `npm run start`
3. Make sure you have a start script in backend/package.json:

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "build": "tsc",
    "dev": "tsx watch src/index.ts"
  }
}
```

### Step 4: Deploy

1. Railway will automatically deploy
2. You'll get a URL like: `https://your-app.railway.app`
3. **Copy this URL** - you'll need it for frontend

✅ **Backend is now live 24/7!**

---

## 🎨 Part 3: Deploy Frontend (Vercel)

### Step 1: Create Vercel Account

1. Go to: https://vercel.com
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your GitHub repository: `SmartTravel`

### Step 2: Configure Frontend

1. Set "Root Directory" to: `travel-smart-pay-main`
2. Framework Preset: Vite
3. Build Command: `npm run build`
4. Output Directory: `dist`

### Step 3: Add Environment Variable

Click "Environment Variables" and add:

```env
VITE_API_URL=https://your-backend.railway.app/api
```

Replace with your actual Railway backend URL.

### Step 4: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes
3. You'll get a URL like: `https://your-app.vercel.app`

✅ **Frontend is now live!**

---

## 🔄 Update Frontend API URL

After deployment, update your frontend to use the production backend:

In `travel-smart-pay-main/.env.production`:
```env
VITE_API_URL=https://your-backend.railway.app/api
```

Redeploy frontend on Vercel.

---

## ✅ Verification Checklist

After deployment, test these:

- [ ] Frontend loads at Vercel URL
- [ ] Can register new user
- [ ] Receive verification email
- [ ] Can verify email
- [ ] Can complete onboarding
- [ ] Can make payments
- [ ] Can view certificate
- [ ] Admin dashboard works
- [ ] Certificate verification works

---

## 💰 Cost Breakdown (FREE Tier)

### Neon PostgreSQL
- **FREE**: 0.5 GB storage
- **FREE**: 1 project
- **Enough for**: 10,000+ users

### Railway
- **FREE**: $5/month credit
- **Enough for**: ~500 hours/month
- **Upgrade**: $5/month for unlimited

### Vercel
- **FREE**: Unlimited deployments
- **FREE**: 100 GB bandwidth/month
- **Enough for**: Thousands of visitors

### Total Cost: $0/month (FREE tier)
### Upgrade Cost: ~$5-10/month for more resources

---

## 🔒 Security Checklist

Before going live:

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use production Stripe keys (not test keys)
- [ ] Enable HTTPS (automatic on Vercel/Railway)
- [ ] Set up CORS properly in backend
- [ ] Add rate limiting to prevent abuse
- [ ] Review all environment variables
- [ ] Test email sending in production
- [ ] Set up error monitoring (Sentry)

---

## 🚨 Common Issues & Solutions

### Issue: "Failed to fetch" error
**Solution**: Check VITE_API_URL in frontend .env.production

### Issue: Database connection error
**Solution**: Verify DATABASE_URL in Railway environment variables

### Issue: Emails not sending
**Solution**: Check EMAIL_USER and EMAIL_PASSWORD in Railway

### Issue: CORS errors
**Solution**: Add frontend URL to CORS whitelist in backend

### Issue: 404 on API routes
**Solution**: Make sure backend URL includes `/api` path

---

## 📊 Monitoring Your App

### Railway Dashboard
- View backend logs
- Monitor CPU/memory usage
- Check deployment status

### Vercel Dashboard
- View frontend analytics
- Check build logs
- Monitor bandwidth usage

### Neon Dashboard
- View database size
- Monitor queries
- Check connection count

---

## 🔄 Continuous Deployment

Both Vercel and Railway support automatic deployments:

1. **Push to GitHub** → Automatic deployment
2. **No manual steps needed**
3. **Rollback available** if something breaks

To deploy updates:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Both services will automatically deploy the new version!

---

## 🎯 Alternative Deployment Options

### Option 2: Render (All-in-One)

**Pros**: Single platform for backend + database
**Cons**: Free tier has cold starts (slow first request)

1. Go to: https://render.com
2. Create Web Service for backend
3. Create PostgreSQL database
4. Deploy frontend to Vercel

### Option 3: Heroku

**Pros**: Easy to use, well-documented
**Cons**: No free tier anymore ($7/month minimum)

### Option 4: DigitalOcean App Platform

**Pros**: $5/month for everything
**Cons**: No free tier

---

## 📝 Post-Deployment Tasks

1. **Update README** with production URLs
2. **Set up custom domain** (optional)
3. **Configure email DNS** for better deliverability
4. **Set up monitoring** (UptimeRobot, Sentry)
5. **Create backup strategy** for database
6. **Document deployment process** for team

---

## 🆘 Need Help?

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Prisma Deployment**: https://www.prisma.io/docs/guides/deployment

---

## 🎉 You're Live!

Once deployed, your app will be:
- ✅ Accessible 24/7 from anywhere
- ✅ Independent of your laptop
- ✅ Scalable to thousands of users
- ✅ Backed up and secure
- ✅ Free to run (on free tiers)

Share your production URL with users and start getting real traffic! 🚀
