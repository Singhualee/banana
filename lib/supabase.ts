import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (!client) {
    const isClient = typeof window !== 'undefined'
    
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      isClient ? {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: window.localStorage,
          storageKey: 'sb-gtechqrrfadonfxdcyxx-auth-token',
          flowType: 'pkce',
        }
      } : {}
    )
  }
  return client
}
