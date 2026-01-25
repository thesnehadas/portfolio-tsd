# Admin Panel - Quick Start

## Setup (First Time)

1. **Initialize the database**:
   ```bash
   npm run db:init
   ```

2. **Start the dev server**:
   ```bash
   npm run dev
   ```

3. **Login to admin panel**:
   - Go to: http://localhost:3000/admin/login
   - Email: `admin@thesnehadas.com`
   - Password: `admin123`

## What's Included

✅ **Authentication System**
- Secure login with JWT tokens
- Protected admin routes
- Session management

✅ **Case Studies Management**
- Create, edit, delete case studies
- Add metrics and key features
- Full descriptions for detail modals

✅ **Testimonials Management**
- Create, edit, delete testimonials
- Manage author information

✅ **Dashboard**
- Overview of all content
- Quick stats

## Next Steps

1. **Change the default password** after first login
2. **Add your case studies** through the admin panel
3. **Add testimonials** from your clients
4. **Update frontend components** to fetch from database (optional - currently uses hardcoded data)

## Production

For production deployment:
1. Set `AUTH_SECRET` environment variable
2. Use a production database (Postgres recommended)
3. Update database connection in `src/lib/db/index.ts`

See `ADMIN_SETUP.md` for detailed setup instructions.
