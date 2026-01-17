'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type { CreditCheckResult, CreditDeductResult } from '@/types/credits'

export function useUserCredits() {
  const [credits, setCredits] = useState<CreditCheckResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const fetchCredits = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/credits')
      
      if (!response.ok) {
        if (response.status === 401) {
          setCredits({
            hasCredits: false,
            creditsRemaining: 0,
            isPremium: false,
            canGenerate: false
          })
          return
        }
        throw new Error('Failed to fetch credits')
      }

      const data = await response.json()
      setCredits({
        hasCredits: data.credits_remaining > 0,
        creditsRemaining: data.credits_remaining,
        isPremium: data.is_premium,
        canGenerate: data.credits_remaining > 0
      })
    } catch (error) {
      console.error('Error fetching credits:', error)
      setCredits({
        hasCredits: false,
        creditsRemaining: 0,
        isPremium: false,
        canGenerate: false
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const checkCredits = useCallback(async (): Promise<CreditCheckResult> => {
    try {
      const response = await fetch('/api/credits/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'check' })
      })

      if (!response.ok) {
        if (response.status === 401) {
          const errorResult: CreditCheckResult = {
            hasCredits: false,
            creditsRemaining: 0,
            isPremium: false,
            canGenerate: false
          }
          setCredits(errorResult)
          return errorResult
        }
        throw new Error('Failed to check credits')
      }

      const result = await response.json()
      setCredits(result)
      return result
    } catch (error) {
      console.error('Error checking credits:', error)
      const errorResult: CreditCheckResult = {
        hasCredits: false,
        creditsRemaining: 0,
        isPremium: false,
        canGenerate: false
      }
      setCredits(errorResult)
      return errorResult
    }
  }, [])

  const deductCredits = useCallback(async (amount: number = 1): Promise<CreditDeductResult> => {
    try {
      const response = await fetch('/api/credits/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'deduct',
          credits: amount
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          creditsRemaining: credits?.creditsRemaining || 0,
          message: errorData.error || 'Failed to deduct credits'
        }
      }

      const result: CreditDeductResult = await response.json()
      
      if (result.success) {
        setCredits({
          hasCredits: result.creditsRemaining > 0,
          creditsRemaining: result.creditsRemaining,
          isPremium: credits?.isPremium || false,
          canGenerate: result.creditsRemaining > 0
        })
      }

      return result
    } catch (error) {
      console.error('Error deducting credits:', error)
      return {
        success: false,
        creditsRemaining: credits?.creditsRemaining || 0,
        message: 'Failed to deduct credits'
      }
    }
  }, [credits])

  useEffect(() => {
    fetchCredits()
  }, [fetchCredits])

  return {
    credits,
    isLoading,
    fetchCredits,
    checkCredits,
    deductCredits,
    canGenerate: credits?.canGenerate || false,
    creditsRemaining: credits?.creditsRemaining || 0,
    isPremium: credits?.isPremium || false
  }
}
