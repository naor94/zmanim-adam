# Deployment Guide - זמני אדם

## Prerequisites
- Node.js 18+
- Supabase account
- Vercel account (recommended)

## Setup Steps

### 1. Database (Supabase)
1. Create a new Supabase project
2. Run the SQL schema from `supabase/schema.sql` in the SQL editor
3. Copy the project URL and anon key

### 2. Environment Variables
Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ADMIN_PASSWORD=choose-a-strong-password
ADMIN_SESSION_SECRET=generate-a-random-32-char-string
```

Generate a session secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Local Development
```bash
npm install
npm run dev
```
Open http://localhost:3000

### 4. Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

Add all environment variables in the Vercel dashboard under Project Settings > Environment Variables.

## Admin Access
- URL: `/admin`
- Default redirects to `/admin/login` if not authenticated
- Session lasts 7 days

## Pages
- `/` - Main page with today's prayers, lessons, zmanim
- `/weekly-prayers` - Full weekly prayer schedule
- `/weekly-lessons` - Full weekly lessons schedule
- `/shabbat-prayers` - Shabbat prayer times
- `/shabbat-lessons` - Shabbat lessons
- `/admin` - Admin dashboard
- `/admin/synagogues` - Manage synagogues
- `/admin/prayers` - Manage weekday prayers
- `/admin/lessons` - Manage weekday lessons
- `/admin/shabbat-prayers` - Manage Shabbat prayers
- `/admin/shabbat-lessons` - Manage Shabbat lessons

## PWA
The app supports PWA installation. The service worker caches public pages for offline use. Admin pages are not cached.
