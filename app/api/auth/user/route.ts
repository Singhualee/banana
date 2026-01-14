import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient(request)
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      console.error('[Auth User] Supabase auth error:', error)
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('[Auth User] Internal server error:', error)
    return NextResponse.json({ user: null })
  }
}
