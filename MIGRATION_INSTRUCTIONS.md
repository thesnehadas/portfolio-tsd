# Database Migration Instructions

Your Supabase project needs the database tables created. Here's how to do it:

## Option 1: Run SQL in Supabase Dashboard (Recommended)

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New query"
5. Copy and paste the entire contents of `drizzle/0000_flashy_tusk.sql`
6. Click "Run" (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

## Option 2: If Supabase Project is Paused

1. Go to https://supabase.com/dashboard
2. Select your project
3. If it shows "Paused", click "Resume" or "Restore"
4. Wait 2-3 minutes for it to become active
5. Then follow Option 1 above

## After Running Migrations

Once the tables are created, run:

```bash
npm run db:init
```

This will create the admin user with:
- Email: `snehadas.iitr@gmail.com`
- Password: `SnehaD@s9803`

## Verify Tables Were Created

After running the SQL, you can verify in Supabase:
1. Go to "Table Editor" in the left sidebar
2. You should see these tables:
   - users
   - blog_posts
   - blog_tags
   - case_studies
   - testimonials
   - social_proof

## Then Access Admin Panel

1. Go to `http://localhost:3000/admin/login`
2. Login with: `snehadas.iitr@gmail.com` / `SnehaD@s9803`
3. Navigate to "Blog Posts" in the sidebar to manage your blog!
