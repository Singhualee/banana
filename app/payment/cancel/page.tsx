// app/payment/cancel/page.tsx

import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'
import Link from 'next/link'

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <XCircle className="h-24 w-24 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your payment was not completed. Please try again later.
        </p>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            If you encountered any issues, please contact our support team for assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/pricing">Back to Pricing</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/">Go to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
