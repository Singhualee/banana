'use client'

import { useState, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase'
import { GoogleLoginButton } from '@/components/google-login-button'
import { Button } from '@/components/ui/button'
import { Loader2, LogOut, User, CreditCard } from 'lucide-react'
import { useUserCredits } from '@/hooks/use-user-credits'

interface User {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showCredits, setShowCredits] = useState(false)
  const supabase = useMemo(() => createClient(), [])
  const { creditsRemaining, isLoading: creditsLoading } = useUserCredits()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error checking user:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [supabase])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        toast.error('Logout failed, please try again later')
        return
      }
      
      setUser(null)
      toast.success('Successfully logged out')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed, please try again later')
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (isLoading) {
    return (
      <Button variant="outline" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    )
  }

  if (user) {
    return (
      <div className="relative flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">
            {user.user_metadata?.full_name || user.email}
          </span>
        </div>
        {creditsLoading ? (
          <Button variant="ghost" size="sm" disabled>
            <Loader2 className="h-4 w-4 animate-spin" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCredits(!showCredits)}
            className="gap-1"
          >
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">{creditsRemaining}</span>
          </Button>
        )}
        {showCredits && (
          <div className="absolute right-0 top-12 z-50 w-48 rounded-lg border bg-background p-3 shadow-lg">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Credits Remaining</p>
                <p className="text-lg font-bold">{creditsRemaining}</p>
              </div>
            </div>
            {creditsRemaining === 0 && (
              <Button
                className="mt-2 w-full"
                size="sm"
                onClick={() => window.location.href = '/pricing'}
              >
                Purchase Credits
              </Button>
            )}
          </div>
        )}
        <Button
          onClick={handleLogout}
          disabled={isLoggingOut}
          variant="outline"
          size="sm"
        >
          {isLoggingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </>
          )}
        </Button>
      </div>
    )
  }

  return <GoogleLoginButton />
}
