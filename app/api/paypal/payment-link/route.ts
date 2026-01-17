import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { paypalService } from '@/lib/paypal'

// PayPal Payment Link Creation API
export async function POST(request: NextRequest) {
  try {

    // Create Supabase client
    const supabase = await createClient(request)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Create PayPal order using the service layer
    const orderResponse = await paypalService.createOrder({
      amount: 9.99,
      currency: 'USD',
      returnUrl: `${request.nextUrl.origin}/payment/success?plan=one-time&user_id=${user.id}`,
      cancelUrl: `${request.nextUrl.origin}/payment/cancel?plan=one-time`,
      customData: {
        user_id: user.id,
        credits: 20
      }
    })

    // Log order creation
    console.log(`[PayPal Payment Link] Order created for user ${user.id}:`, orderResponse.id)
    
    // Get approval URL from response
    const approvalUrl = paypalService.getApprovalUrl(orderResponse)
    
    if (!approvalUrl) {
      console.error('[PayPal Payment Link] No approval link found in response:', orderResponse)
      return NextResponse.json(
        { error: 'No payment link found in PayPal response' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      order: orderResponse,
      url: approvalUrl
    })
  } catch (error) {
    console.error('[PayPal Payment Link] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}