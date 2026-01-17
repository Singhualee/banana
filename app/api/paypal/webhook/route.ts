import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { paypalService } from '@/lib/paypal'
import type { PayPalWebhookEvent } from '@/types/credits'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID

async function verifyPayPalSignature(
  headers: Headers,
  body: string
): Promise<boolean> {
  try {
    return await paypalService.verifyWebhookSignature({ headers, body })
  } catch (error) {
    console.error('PayPal signature verification failed:', error)
    return false
  }
}

async function handlePaymentCompleted(event: PayPalWebhookEvent) {
  let userId: string | null = null
  let creditsToAdd = 20

  // Extract custom data using the PayPal service layer
  const customData = paypalService.extractCustomData(event)
  
  if (customData) {
    userId = customData.user_id
    creditsToAdd = customData.credits || 20
  } else {
    console.error('No custom data found in payment event')
  }

  if (!userId) {
    console.error('No user_id found in payment event')
    return false
  }

  try {
    // Extract payment details using the PayPal service layer
    const paymentDetails = paypalService.extractPaymentDetails(event)
    
    if (!paymentDetails) {
      console.error('No payment details found in event')
      return false
    }
    
    // Verify payment amount using the PayPal service layer
    if (!paypalService.validatePaymentAmount(paymentDetails.amount, paymentDetails.currency)) {
      console.error('Invalid payment amount:', paymentDetails.amount, paymentDetails.currency, 'Expected: 9.99 USD')
      return false
    }
    
    const { amount: paymentAmount, currency: paymentCurrency } = paymentDetails
    
    // Add credits to user account
    const { data: creditsData, error: creditsError } = await supabase.rpc('add_credits', {
      p_user_id: userId,
      p_credits_to_add: creditsToAdd
    })

    if (creditsError) {
      console.error('Failed to add credits:', creditsError)
      return false
    }

    // Record payment in payments table
    
    const { data: paymentData, error: paymentError } = await supabase.rpc('add_payment_record', {
      p_user_id: userId,
      p_payment_id: event.resource.id,
      p_amount: paymentAmount,
      p_currency: paymentCurrency,
      p_status: event.resource.status,
      p_credits: creditsToAdd,
      p_type: 'one-time',
      p_paypal_data: event as any
    })

    if (paymentError) {
      console.error('Failed to record payment:', paymentError)
      return false
    }

    console.log(`Successfully added ${creditsToAdd} credits to user ${userId} for payment ${event.resource.id}`)
    return true
  } catch (error) {
    console.error('Error processing payment:', error)
    return false
  }
}

async function handlePaymentRefunded(event: PayPalWebhookEvent) {
  const paymentId = event.resource.id

  try {
    // Find the payment record
    const { data: payment, error: findPaymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('payment_id', paymentId)
      .single()

    if (findPaymentError || !payment) {
      console.error('Failed to find payment record:', findPaymentError)
      return false
    }

    // Refund the credits (remove them from user account)
    const { data: refundData, error: refundError } = await supabase.rpc('add_credits', {
      p_user_id: payment.user_id,
      p_credits_to_add: -payment.credits
    })

    if (refundError) {
      console.error('Failed to refund credits:', refundError)
      return false
    }

    // Update the payment status to refunded
    const { error: updateError } = await supabase
      .from('payments')
      .update({ status: 'refunded' })
      .eq('payment_id', paymentId)

    if (updateError) {
      console.error('Failed to update payment status:', updateError)
      return false
    }

    console.log(`Successfully refunded ${payment.credits} credits to user ${payment.user_id} for payment ${paymentId}`)
    return true
  } catch (error) {
    console.error('Error processing refund:', error)
    return false
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const headers = request.headers

    if (!PAYPAL_WEBHOOK_ID) {
      console.error('PAYPAL_WEBHOOK_ID not configured')
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      )
    }

    const isValid = await verifyPayPalSignature(headers, body)

    if (!isValid) {
      console.error('Invalid PayPal webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const event: PayPalWebhookEvent = JSON.parse(body)

    console.log('PayPal webhook received:', {
      event_type: event.event_type,
      resource_type: event.resource_type,
      payment_id: event.resource.id,
      status: event.resource.status
    })

    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
      case 'PAYMENT.SALE.COMPLETED':
        const success = await handlePaymentCompleted(event)
        if (success) {
          return NextResponse.json({ received: true, credits_added: 20 })
        } else {
          return NextResponse.json(
            { error: 'Failed to process payment' },
            { status: 500 }
          )
        }

      case 'PAYMENT.CAPTURE.REFUNDED':
      case 'PAYMENT.SALE.REFUNDED':
        const refundSuccess = await handlePaymentRefunded(event)
        if (refundSuccess) {
          return NextResponse.json({ received: true, credits_refunded: true })
        } else {
          return NextResponse.json(
            { error: 'Failed to process refund' },
            { status: 500 }
          )
        }

      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.SALE.DENIED':
        console.log('Payment denied:', event.resource.id)
        return NextResponse.json({ received: true })

      default:
        console.log(`Unhandled event type: ${event.event_type}`)
        return NextResponse.json({ received: true })
    }
  } catch (error) {
    console.error('Error processing PayPal webhook:', error)
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'PayPal webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
}
