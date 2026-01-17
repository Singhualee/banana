import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const isDevelopment = false // Disable excessive logging to improve performance

export async function createClient(request?: NextRequest) {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    if (isDevelopment) {
      console.error('[Supabase Client] Missing environment variables:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey,
      })
    }
    // Return a minimal client that won't cause fetch errors
    return createServerClient(
      'https://placeholder.supabase.co',
      'placeholder-key',
      {
        cookies: {
          get(name: string) {
            if (request) {
              const cookie = request.cookies.get(name)
              if (isDevelopment) {
                console.log('[Supabase Client] GET cookie from request:', name, !!cookie)
              }
              return cookie?.value
            }
            const cookie = cookieStore.get(name)
            if (isDevelopment) {
              console.log('[Supabase Client] GET cookie from store:', name, !!cookie)
            }
            return cookie?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              if (isDevelopment) {
                console.log('[Supabase Client] SET cookie:', name, 'value length:', value.length)
              }
              cookieStore.set({
                name,
                value,
                ...options,
              })
              if (isDevelopment) {
                console.log('[Supabase Client] Cookie set successfully')
              }
            } catch (error) {
              console.error('[Supabase Client] Error setting cookie:', error)
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              if (isDevelopment) {
                console.log('[Supabase Client] REMOVE cookie:', name)
              }
              cookieStore.set({
                name,
                value: '',
                ...options,
                maxAge: 0,
              })
            } catch (error) {
              console.error('[Supabase Client] Error removing cookie:', error)
            }
          },
        },
      }
    )
  }

  if (isDevelopment) {
    console.log('[Supabase Client] Creating client')
  }

  try {
    return createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            if (request) {
              const cookie = request.cookies.get(name)
              if (isDevelopment) {
                console.log('[Supabase Client] GET cookie from request:', name, !!cookie)
              }
              return cookie?.value
            }
            const cookie = cookieStore.get(name)
            if (isDevelopment) {
              console.log('[Supabase Client] GET cookie from store:', name, !!cookie)
            }
            return cookie?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              if (isDevelopment) {
                console.log('[Supabase Client] SET cookie:', name, 'value length:', value.length)
              }
              cookieStore.set({
                name,
                value,
                ...options,
              })
              if (isDevelopment) {
                console.log('[Supabase Client] Cookie set successfully')
              }
            } catch (error) {
              console.error('[Supabase Client] Error setting cookie:', error)
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              if (isDevelopment) {
                console.log('[Supabase Client] REMOVE cookie:', name)
              }
              cookieStore.set({
                name,
                value: '',
                ...options,
                maxAge: 0,
              })
            } catch (error) {
              console.error('[Supabase Client] Error removing cookie:', error)
            }
          },
        },
      }
    )
  } catch (error) {
    console.error('[Supabase Client] Error creating client:', error)
    // Return a minimal client instead of throwing to prevent app crash
    return createServerClient(
      'https://placeholder.supabase.co',
      'placeholder-key',
      {
        cookies: {
          get(name: string) {
            if (request) {
              const cookie = request.cookies.get(name)
              if (isDevelopment) {
                console.log('[Supabase Client] GET cookie from request:', name, !!cookie)
              }
              return cookie?.value
            }
            const cookie = cookieStore.get(name)
            if (isDevelopment) {
              console.log('[Supabase Client] GET cookie from store:', name, !!cookie)
            }
            return cookie?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              if (isDevelopment) {
                console.log('[Supabase Client] SET cookie:', name, 'value length:', value.length)
              }
              cookieStore.set({
                name,
                value,
                ...options,
              })
              if (isDevelopment) {
                console.log('[Supabase Client] Cookie set successfully')
              }
            } catch (error) {
              console.error('[Supabase Client] Error setting cookie:', error)
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              if (isDevelopment) {
                console.log('[Supabase Client] REMOVE cookie:', name)
              }
              cookieStore.set({
                name,
                value: '',
                ...options,
                maxAge: 0,
              })
            } catch (error) {
              console.error('[Supabase Client] Error removing cookie:', error)
            }
          },
        },
      }
    )
  }
}
