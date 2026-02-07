# Blog Admin Panel Setup

The blog management system has been added to your admin panel. Follow these steps to set it up:

## Database Migration

You need to run a database migration to create the new tables:

```bash
# Generate migration files
npm run db:generate

# Apply migrations
npm run db:migrate
```

Or if you're using Drizzle directly:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Features

### Blog Post Management

Access the blog admin at `/admin/blog`. You can:

- **View all blog posts** in a table format
- **Create new blog posts** with comprehensive fields
- **Edit existing blog posts**
- **Manage tags** (create new tags on the fly)

### Form Fields

The blog post form includes all requested fields:

#### Core Content
- Article Title (H1) - Required
- Slug / URL - Auto-generated from title, editable
- Excerpt - Brief summary

#### SEO Meta
- Meta Title - For SEO (defaults to article title if empty)
- Meta Description - For search engine snippets

#### Keywords
- Primary Keyword - Main SEO keyword
- Secondary Keywords - Comma-separated list
- Search Intent - e.g., informational, commercial, transactional

#### Content
- Main Content - Full Markdown editor (supports 100% Markdown)

#### Featured Image
- Image URL - Direct URL input
- File Upload - Upload image file (converted to data URL)
- Alt Text - For accessibility
- Caption - Optional image caption

#### Organization
- Category - Free text field
- Tags - Select from existing tags or create new ones on the fly

#### Publishing
- Status - Dropdown: Draft, Published, Archived
- Featured Toggle - Mark article as featured
- Publish Date - Date picker
- Schema Type - Dropdown with Schema.org types (Article, BlogPosting, NewsArticle, etc.)

## Usage

1. **Create a Blog Post:**
   - Go to `/admin/blog`
   - Click "New Blog Post"
   - Fill in all required fields (Title, Slug, Content)
   - Add tags by selecting existing ones or typing new tag names
   - Set publish date and status
   - Click "Create"

2. **Edit a Blog Post:**
   - Go to `/admin/blog`
   - Click "Edit" on any post
   - Make changes
   - Click "Update"

3. **Manage Tags:**
   - Tags are created automatically when you type a new tag name
   - Existing tags appear as clickable buttons
   - Click a tag to select/deselect it

## Next Steps

After setting up the database, you may want to:

1. Update the public blog pages (`/blog` and `/blog/[slug]`) to fetch from the database instead of hardcoded data
2. Add markdown rendering for the blog content
3. Add image optimization for uploaded images
4. Add preview functionality before publishing

## API Endpoints

- `GET /api/admin/blog` - List all blog posts
- `POST /api/admin/blog` - Create new blog post
- `GET /api/admin/blog/[id]` - Get single blog post
- `PUT /api/admin/blog/[id]` - Update blog post
- `DELETE /api/admin/blog/[id]` - Delete blog post
- `GET /api/admin/blog/tags` - List all tags
- `POST /api/admin/blog/tags` - Create new tag

All endpoints require authentication (admin login).
