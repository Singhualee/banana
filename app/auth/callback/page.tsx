'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = createClient()
        
        // Check if we have a session from the URL
        const { error } = await supabase.auth.getSession()
        
        if (error) {
          throw error
        }
        
        // Wait for a moment to ensure session is properly stored
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setStatus('success')
        
        // Redirect to home page after success
        setTimeout(() => {
          router.push('/')
        }, 1500)
      } catch (error) {
        console.error('Callback error:', error)
        setErrorMessage(error instanceof Error ? error.message : 'Authentication failed')
        setStatus('error')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="flex items-center justify-center mb-6">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Authenticating...</h1>
            <p className="text-muted-foreground">Please wait while we process your login</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex items-center justify-center mb-6">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Authentication Successful!</h1>
            <p className="text-muted-foreground mb-6">You are now logged in</p>
            <Button onClick={() => router.push('/')}>
              Go to Dashboard
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex items-center justify-center mb-6">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Authentication Failed</h1>
            <p className="text-muted-foreground mb-6">{errorMessage}</p>
            <Button onClick={() => router.push('/login')}>
              Try Again
            </Button>
          </>
        )}
      </div>
    </div>
  )
}