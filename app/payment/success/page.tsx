// app/payment/success/page.tsx
'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { toast } from 'sonner'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')
  const userId = searchParams.get('user_id')
  const [isAddingCredits, setIsAddingCredits] = useState(true)
  const [creditsAdded, setCreditsAdded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const addCredits = async () => {
      if (!userId) {
        setError('No user ID found')
        setIsAddingCredits(false)
        return
      }

      try {
        // Call API to add credits as backup in case webhook failed
        const response = await fetch('/api/credits/manage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'add',
            credits: 20,
            source: 'payment_success'
          })
        })

        if (response.ok) {
          const data = await response.json()
          setCreditsAdded(true)
          toast.success('Successfully added 20 free credits to your account!')
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Failed to add credits')
        }
      } catch (err) {
        setError('An error occurred while adding credits')
        console.error('Error adding credits:', err)
      } finally {
        setIsAddingCredits(false)
      }
    }

    addCredits()
  }, [userId])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Thank you for subscribing to {plan || 'our service'} plan.
        </p>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your payment has been processed successfully. You can now enjoy all the features of your plan.
          </p>
          
          {isAddingCredits ? (
            <div className="flex items-center justify-center gap-2 text-sm text-primary">
              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              Adding 20 free credits to your account...
            </div>
          ) : creditsAdded ? (
            <div className="flex items-center justify-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              20 free credits have been added to your account!
            </div>
          ) : error ? (
            <div className="text-sm text-amber-600">
              We're processing your credits. They will be added shortly. If you don't see them within a few minutes, please contact support.
            </div>
          ) : null}
          
          <Button asChild>
            <Link href="/">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-2">Processing...</h1>
      </div>
    </div>}>
      <PaymentSuccessContent />
    </Suspense>
  )
}
