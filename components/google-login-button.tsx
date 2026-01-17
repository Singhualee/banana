'use client'

import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { GoogleIcon } from '@/components/google-icon'

export function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = useMemo(() => createClient(), [])

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      // Use the API route for authentication instead of direct supabase call
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          redirectTo: `${window.location.origin}/auth/callback`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      if (data.url) {
        // Redirect to Google authentication page
        window.location.href = data.url
      } else {
        throw new Error('No authentication URL returned')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed, please try again later')
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleGoogleLogin}
      disabled={isLoading}
      variant="outline"
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        <>
          <GoogleIcon className="mr-2 h-4 w-4" />
          Sign in with Google
        </>
      )}
    </Button>
  )
}
