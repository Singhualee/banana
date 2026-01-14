# Vercel Deployment Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: Prerender Error - Missing Supabase Environment Variables

**Error Message:**
```
Error occurred prerendering page "/_not-found"
Error: @supabase/ssr: Your project's URL and API key are required to create a Supabase client!
Export encountered an error on /_not-found/page: /_not-found, exiting
```

**Root Cause:**
- Vercel builds pages by prerendering them
- During build time, environment variables may not be available
- Components that try to create Supabase client without environment variables fail

**Solution:**
1. Add try-catch blocks around Supabase client creation in server components
2. Allow the build to continue even when environment variables are missing
3. Only log errors in development mode

**Example Fix:**
```typescript
// components/hero-server.tsx
export async function Hero() {
  let user = null
  
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (error) {
    console.warn('Failed to get user:', error)
  }

  return <HeroClient initialUser={user} />
}
```

**Files Modified:**
- `lib/supabase-server.ts` - Added error handling and dev-only logging
- `components/hero-server.tsx` - Added try-catch for user authentication

---

### Issue 2: Vercel.json Schema Validation Error

**Error Message:**
```
The `vercel.json` schema validation failed with following message: 
`env.NEXT_PUBLIC_SITE_URL` should be string
```

**Root Cause:**
- Environment variables cannot be defined in `vercel.json`
- The `env` field in `vercel.json` is for build-time environment variables, not runtime variables

**Solution:**
Remove `env` configuration from `vercel.json` and configure environment variables in Vercel Dashboard instead.

**Correct `vercel.json`:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["hkg1"]
}
```

**Files Modified:**
- `vercel.json` - Removed invalid `env` configuration

---

## Environment Variables Configuration

### Required Environment Variables

Configure these in Vercel Dashboard (Settings > Environment Variables):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenRouter API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=google/gemini-2.5-flash-image

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
SITE_NAME=Banana Editor
```

### How to Get These Values

**Supabase:**
1. Go to https://supabase.com/
2. Create a project
3. Navigate to Project Settings > API
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**OpenRouter:**
1. Go to https://openrouter.ai/
2. Sign up and get API key
3. Copy API key → `OPENROUTER_API_KEY`

**NEXT_PUBLIC_SITE_URL:**
- After deployment, Vercel provides the domain
- Format: `https://your-project-name.vercel.app`

---

## Best Practices

### 1. Error Handling in Server Components

Always wrap Supabase client creation in try-catch blocks:

```typescript
try {
  const supabase = await createClient()
  // Use supabase
} catch (error) {
  // Handle gracefully
  console.warn('Supabase error:', error)
}
```

### 2. Development vs Production Logging

Only log detailed errors in development:

```typescript
const isDevelopment = process.env.NODE_ENV === 'development'

if (isDevelopment) {
  console.error('[Supabase Client] Missing environment variables')
}
```

### 3. Environment Variable Validation

Validate environment variables before use:

```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}
```

### 4. Build-Time Considerations

- Server components run during build time
- Browser-only APIs (window, document) are not available
- Environment variables may not be set during prerendering
- Always handle missing data gracefully

### 5. Vercel Configuration

Keep `vercel.json` minimal:
- Only include build settings
- Do not define environment variables
- Configure environment variables in Vercel Dashboard

---

## Deployment Checklist

Before deploying to Vercel:

- [ ] All environment variables are set in Vercel Dashboard
- [ ] Server components have error handling for missing env vars
- [ ] No browser-only APIs in server components
- [ ] `vercel.json` is valid (no `env` field)
- [ ] Build succeeds locally: `npm run build`
- [ ] Database migrations are applied (if using Supabase)
- [ ] API keys are valid and have correct permissions

---

## Debugging Tips

### Check Build Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click on the failed deployment
4. Review the build logs for specific errors

### Local Build Testing

Always test locally before pushing:

```bash
npm run build
```

If local build fails, Vercel build will also fail.

### Enable Detailed Logging

For more detailed error messages during build:

```bash
NODE_ENV=development npm run build
```

### Check Environment Variables

Verify environment variables are set correctly:

```bash
# In Next.js
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
```

---

## Common Next.js Build Errors

### Type Errors

If you see TypeScript errors during build:

1. Check `next.config.mjs` for `typescript.ignoreBuildErrors`
2. Fix type errors in your code
3. Run `npm run lint` to catch issues early

### Import Errors

Ensure all imports are correct:
- Use absolute imports: `@/components/button`
- Check file extensions: `.ts`, `.tsx`, `.js`, `.jsx`
- Verify module paths in `tsconfig.json`

### Static Export Issues

If using `output: 'export'`:
- Cannot use `getServerSideProps`
- Use `getStaticProps` instead
- Ensure all pages can be statically generated

---

## Quick Reference

### Useful Commands

```bash
# Build locally
npm run build

# Start production server
npm start

# Check for linting errors
npm run lint

# Type check
npx tsc --noEmit
```

### File Locations

- Environment config: `.env.local` (local), Vercel Dashboard (production)
- Build config: `next.config.mjs`
- Vercel config: `vercel.json`
- TypeScript config: `tsconfig.json`

### Key Files to Check

- `lib/supabase-server.ts` - Supabase client creation
- `middleware.ts` - Route protection
- `vercel.json` - Vercel configuration
- `.env.local` - Local environment variables

---

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase with Next.js](https://supabase.com/docs/guides/with-nextjs)
- [Environment Variables in Next.js](https://nextjs.org/docs/basic-features/environment-variables)

---

## Summary

The key takeaways from this troubleshooting session:

1. **Always handle missing environment variables gracefully** - Build-time prerendering may not have access to all environment variables
2. **Configure environment variables in Vercel Dashboard** - Don't define them in `vercel.json`
3. **Add error handling to server components** - Use try-catch blocks around Supabase client creation
4. **Test builds locally** - Run `npm run build` before pushing to catch issues early
5. **Keep configuration minimal** - Only include necessary settings in `vercel.json`

Following these practices will help ensure smooth deployments to Vercel.
