# Admin Panel Setup Guide

## Initial Setup

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Generate database migrations**:
   ```bash
   npm run db:generate
   ```

3. **Initialize database and create admin user**:
   ```bash
   npm run db:init
   ```
   
   This will create:
   - SQLite database (`sqlite.db`)
   - Admin user with default credentials:
     - Email: `admin@thesnehadas.com`
     - Password: `admin123`
   
   **⚠️ IMPORTANT:** Change the password after first login!

4. **Set environment variable** (optional, for production):
   Create a `.env.local` file:
   ```
   AUTH_SECRET=your-random-secret-key-here
   ADMIN_EMAIL=your-email@example.com
   ADMIN_PASSWORD=your-secure-password
   ```

## Accessing the Admin Panel

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/admin/login`

3. Login with the default credentials (or your custom ones if you set environment variables)

## Admin Panel Features

### Dashboard
- Overview of all content (case studies, testimonials, social proof counts)

### Case Studies Management
- Create, edit, and delete case studies
- Add metrics and key features
- Full description for detail modal

### Testimonials Management
- Create, edit, and delete testimonials
- Manage author information and quotes

### Social Proof Management
- Manage company logos (coming soon)

## Database

The admin panel uses SQLite for local development. For production, you can:

1. **Use Vercel Postgres** (recommended for Vercel deployments):
   - Add Vercel Postgres to your project
   - Update `drizzle.config.ts` to use Postgres
   - Update `src/lib/db/index.ts` to use Postgres adapter

2. **Use other databases**:
   - Update Drizzle config for your preferred database
   - Modify `src/lib/db/index.ts` accordingly

## Production Deployment

1. **Set environment variables in Vercel**:
   - `AUTH_SECRET`: A random secret key (generate with `openssl rand -base64 32`)
   - `ADMIN_EMAIL`: Your admin email
   - `ADMIN_PASSWORD`: Your secure password

2. **Database**: Use Vercel Postgres or another cloud database service

3. **Run migrations** on first deploy (or use Vercel's build command)

## Security Notes

- Always change the default admin password
- Use a strong `AUTH_SECRET` in production
- Keep your database credentials secure
- The admin panel is protected by authentication middleware
