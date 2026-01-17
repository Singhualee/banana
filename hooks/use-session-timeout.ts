'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'

const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds

export function useSessionTimeout() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const supabase = createClient()

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        await supabase.auth.signOut()
        toast.error('Session expired. Please log in again.')
        window.location.href = '/login'
      }
    }, SESSION_TIMEOUT)
  }

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']

    events.forEach(event => {
      window.addEventListener(event, resetTimeout)
    })

    resetTimeout()

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimeout)
      })
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return { resetTimeout }
}