# Supabase Keep-Alive Setup

This project includes an automated keep-alive mechanism to prevent your Supabase project from being auto-paused on the free tier.

## How It Works

1. **API Endpoint**: `/api/keepalive` - Makes a minimal database query to register activity
2. **GitHub Actions**: Automatically calls this endpoint every 6 days (before the 7-day inactivity threshold)

## Setup Instructions

### Step 1: Deploy Your Application

Make sure your application is deployed and accessible via a public URL (e.g., Vercel, Netlify, or your own server).

### Step 2: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add a secret named `DEPLOYMENT_URL` with your production URL:
   - Example: `https://your-app.vercel.app`
   - Or: `https://your-custom-domain.com`

### Step 3: Verify the Workflow

1. Go to **Actions** tab in your GitHub repository
2. You should see the "Supabase Keep-Alive" workflow
3. You can manually trigger it by clicking "Run workflow" to test
4. Check the logs to ensure it's working correctly

### Step 4: Test the Endpoint Locally (Optional)

You can test the keep-alive endpoint manually:

```bash
# If running locally
curl http://localhost:3000/api/keepalive

# Or for production
curl https://your-domain.com/api/keepalive
```

## How Often Does It Run?

- **Schedule**: Every 6 days at 12:00 UTC
- **Manual**: Can be triggered anytime via GitHub Actions UI
- **Why 6 days**: Supabase pauses projects after 7 days of inactivity, so running every 6 days ensures continuous activity

## Troubleshooting

### Workflow Not Running

1. Check that GitHub Actions is enabled for your repository
2. Verify the cron schedule is correct
3. Check the Actions tab for any error messages

### Endpoint Not Responding

1. Verify your application is deployed and accessible
2. Check that the `DEPLOYMENT_URL` secret is set correctly
3. Test the endpoint manually using curl or a browser

### Database Connection Issues

1. Verify your `DATABASE_URL` environment variable is set correctly
2. Check that your Supabase project is not paused (you may need to manually resume it once)
3. Ensure your database connection pool settings are correct

## Cost

- **GitHub Actions**: Free (2,000 minutes/month for private repos, unlimited for public repos)
- **API Calls**: Minimal - just one lightweight database query every 6 days
- **Supabase**: Stays on free tier - no upgrade needed

## Notes

- The keep-alive query is extremely lightweight (`SELECT 1`) and won't impact performance
- The workflow is designed to not fail even if there's a temporary issue
- You can manually trigger the workflow anytime from the GitHub Actions UI
- This solution requires no manual intervention once set up
