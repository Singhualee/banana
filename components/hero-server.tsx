import { createClient } from '@/lib/supabase-server'
import { HeroClient } from './hero-client'

export async function Hero() {
  let user = null
  
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (error) {
    // If Supabase client creation fails (e.g., during build), continue without user
    console.warn('Failed to get user:', error)
  }

  return <HeroClient initialUser={user} />
}

export { HeroClient }
