import { createClient } from '@/lib/supabase-server'
import { HeroClient } from './hero-client'

export async function Hero() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <HeroClient initialUser={user} />
}

export { HeroClient }
