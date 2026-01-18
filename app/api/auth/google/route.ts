import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient(request)
    const { redirectTo } = await request.json()

    // Use Vercel URL if available, otherwise use NEXT_PUBLIC_SITE_URL
    const siteUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_SITE_URL
    console.log('[Google Auth] Using site URL:', siteUrl)
    
    if (!siteUrl) {
      console.error('No site URL configured')
      return NextResponse.json(
        { error: 'Server configuration error: No site URL configured' },
        { status: 500 }
      )
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo || `${siteUrl}/auth/callback`,
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

    return NextResponse.json({ url: data.url })
  } catch (error) {
    console.error('Internal server error in Google auth:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
