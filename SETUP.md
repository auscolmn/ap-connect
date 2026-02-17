# AP Connect - Setup Guide

## Prerequisites

- Node.js 20+
- A Supabase project (free tier works fine)
- Git

## Quick Start

### 1. Clone and Install

```bash
cd ap-connect/app
npm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (~2 minutes)

### 3. Apply Database Schema

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the sidebar
3. Click **New query**
4. Copy the contents of `supabase/migrations/001_initial_schema.sql`
5. Paste into the SQL editor and click **Run**

This will create all tables, views, functions, and RLS policies.

### 4. Configure Environment

Copy the example env file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Find these in your Supabase dashboard under **Settings > API**.

### 5. Run the Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Creating an Admin User

1. Sign up for an account at http://localhost:3000/signup
2. In Supabase SQL Editor, run:

```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

3. Log out and log back in to access the admin panel at /admin

## Architecture

### Database

- **PostgreSQL** via Supabase
- Row Level Security (RLS) enforces access control
- Auth handled by Supabase Auth

### Key Tables

- `users` - User accounts (extends Supabase auth.users)
- `practitioners` - Practitioner profiles
- `practitioner_locations` - Practice locations
- `training_records` - Training credentials

### Key Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/search` | Practitioner directory |
| `/practitioner/[slug]` | Public practitioner profile |
| `/login` | Sign in |
| `/signup` | Create account |
| `/dashboard` | Practitioner dashboard |
| `/dashboard/profile` | Edit profile |
| `/dashboard/locations` | Manage locations |
| `/dashboard/availability` | Update availability |
| `/dashboard/training` | Manage training records |
| `/admin` | Admin dashboard |
| `/admin/pending` | Review pending verifications |
| `/admin/practitioners` | All practitioners |
| `/admin/training` | Review training records |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://apconnect.com.au
```

## Email Configuration

Supabase handles auth emails automatically. To customize:

1. Go to **Authentication > Email Templates** in Supabase
2. Customize the confirmation and reset password emails
3. Update the redirect URLs to match your domain

## Adding PI Graduate Integration

The database includes an `add_pi_graduate` function for syncing PI training graduates:

```sql
SELECT add_pi_graduate(
    'graduate@email.com',     -- email
    'First',                  -- first_name
    'Last',                   -- last_name
    'MED0000000000',          -- ahpra_number
    'Psychiatrist Training',  -- program
    '2024-06-01',             -- completed_at
    'PI-2024-001'             -- student_id
);
```

This will:
1. Find or create the user by email
2. Create/update their practitioner profile
3. Add a verified training record

## Troubleshooting

### "User not found" when signing up
- Check Supabase Auth settings - email confirmation may be enabled
- Check your spam folder for the confirmation email

### RLS errors
- Make sure you applied the full migration including RLS policies
- Check you're passing the auth header correctly

### Session not persisting
- Ensure middleware.ts is at the root of the app directory
- Check cookies are being set correctly

## Development Notes

- Uses Next.js 16 App Router
- Server Components by default (add 'use client' for client components)
- Server Actions for form submissions
- Supabase SSR for auth in server components
