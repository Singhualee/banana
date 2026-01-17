'use client'

import { useEffect } from 'react'
import { useSessionTimeout } from '@/hooks/use-session-timeout'

export function SessionTimeoutProvider({ children }: { children: React.ReactNode }) {
  useSessionTimeout()

  return <>{children}</>
}