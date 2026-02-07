# Production Setup Guide

## Database Migration

The admin blog panel requires database tables to be created in your Supabase production database.

### Steps to Set Up Database:

1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Migration SQL**
   - Copy the entire contents of `drizzle/0000_flashy_tusk.sql`
   - Paste it into the SQL Editor
   - Click "Run" (or press Ctrl+Enter)

4. **Verify Tables Were Created**
   - Go to "Table Editor" in Supabase
   - You should see these tables:
     - `blog_posts`
     - `blog_tags`
     - `users`
     - `case_studies`
     - `testimonials`
     - `social_proof`

5. **Create Admin User** (if not already created)
   - The admin user should be created via the `npm run db:init` script locally
   - Or manually insert a user in the `users` table with a hashed password

### Environment Variables

Make sure these are set in your deployment platform (Vercel, etc.):

- `DATABASE_URL` - Your Supabase PostgreSQL connection string
- `AUTH_SECRET` - A random secret key (generate with: `openssl rand -base64 32`)

### After Migration

Once the tables are created, the admin panel at `/admin/blog` should work correctly. The pages now include error handling that will show a helpful message if the tables don't exist yet.
