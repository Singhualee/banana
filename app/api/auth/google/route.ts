import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient(request)
    const { redirectTo } = await request.json()

    // Priority order: 1) Vercel URL, 2) NEXT_PUBLIC_SITE_URL (production), 3) Fallback to localhost for development
    let siteUrl: string
    
    if (process.env.VERCEL_URL) {
      // In Vercel production environment, use Vercel URL
      siteUrl = `https://${process.env.VERCEL_URL}`
    } else if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SITE_URL) {
      // In other production environments, use NEXT_PUBLIC_SITE_URL
      siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    } else {
      // For local development, use localhost
      siteUrl = 'http://localhost:3000'
    }
    
    console.log('[Google Auth] Request received:', { redirectTo, environment: { NODE_ENV: process.env.NODE_ENV, VERCEL_URL: process.env.VERCEL_URL } })
    
    // Always use the client-provided redirectTo if available, this ensures we use the correct domain
    // The client passes window.location.origin, which is the actual domain the user is visiting
    const finalRedirectTo = redirectTo || `${siteUrl}/auth/callback`
    console.log('[Google Auth] Final redirectTo:', finalRedirectTo)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: finalRedirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      console.error('Supabase OAuth error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('[Google Auth] Supabase returned OAuth URL:', data.url)
    return NextResponse.json({ url: data.url })
  } catch (error) {
    console.error('Internal server error in Google auth:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
