import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import type { CreditCheckResult, CreditDeductResult } from '@/types/credits'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action } = body

    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (action === 'check') {
      let { data, error } = await supabase
        .from('user_credits')
        .select('credits_remaining, is_premium')
        .eq('user_id', user.id)
        .single()

      if (error && (error.code === 'PGRST116' || error.message?.includes('0 rows'))) {
        const { data: newUserData, error: insertError } = await supabase
          .from('user_credits')
          .insert({
            user_id: user.id,
            credits_remaining: 2,
            is_premium: false
          })
          .select('credits_remaining, is_premium')
          .single()

        if (insertError) {
          console.error('Error creating user credits:', insertError)
          return NextResponse.json(
            { error: 'Failed to create user credits' },
            { status: 500 }
          )
        }

        data = newUserData
        error = null
      }

      if (error || !data) {
        console.error('Error checking credits:', error)
        return NextResponse.json(
          { error: 'Failed to check credits' },
          { status: 500 }
        )
      }

      const result: CreditCheckResult = {
        hasCredits: data.credits_remaining > 0,
        creditsRemaining: data.credits_remaining,
        isPremium: data.is_premium,
        canGenerate: data.credits_remaining > 0
      }

      return NextResponse.json(result)
    }

    if (action === 'deduct') {
      const { credits = 1 } = body

      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_remaining, is_premium')
        .eq('user_id', user.id)
        .single()

      if (error || !data) {
        console.error('Error fetching credits:', error)
        return NextResponse.json(
          { error: 'Failed to fetch credits' },
          { status: 500 }
        )
      }

      if (data.credits_remaining < credits) {
        const result: CreditDeductResult = {
          success: false,
          creditsRemaining: data.credits_remaining,
          message: 'Insufficient credits'
        }
        return NextResponse.json(result, { status: 400 })
      }

      const { error: updateError } = await supabase
        .from('user_credits')
        .update({
          credits_remaining: data.credits_remaining - credits,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (updateError) {
        console.error('Error deducting credits:', updateError)
        return NextResponse.json(
          { error: 'Failed to deduct credits' },
          { status: 500 }
        )
      }

      const result: CreditDeductResult = {
        success: true,
        creditsRemaining: data.credits_remaining - credits
      }

      return NextResponse.json(result)
    }

    if (action === 'add') {
      const { credits = 20, source } = body
      
      // Validate credits amount - only allow 20 credits at a time
      if (credits !== 20) {
        return NextResponse.json(
          { error: 'Invalid credits amount. Only 20 credits allowed at a time.' },
          { status: 400 }
        )
      }
      
      // For payment_success source, we can trust the payment was successful
      // and directly add credits without waiting for webhook
      if (source !== 'payment_success') {
        // Check if user has already been granted credits recently (prevents abuse)
        const { data: recentPayments, error: paymentsError } = await supabase
          .from('payments')
          .select('id')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .limit(1)
        
        if (paymentsError) {
          console.error('Error checking recent payments:', paymentsError)
          return NextResponse.json(
            { error: 'Failed to verify payment' },
            { status: 500 }
          )
        }
        
        // Only allow credits if there's a recent payment record
        if (!recentPayments || recentPayments.length === 0) {
          return NextResponse.json(
            { error: 'No recent payment found. Please complete a payment first.' },
            { status: 403 }
          )
        }
      }

      // First check if user has credits record
      const { data: existingCredits, error: fetchError } = await supabase
        .from('user_credits')
        .select('credits_remaining, is_premium')
        .eq('user_id', user.id)
        .single()

      if (fetchError && (fetchError.code === 'PGRST116' || fetchError.message?.includes('0 rows'))) {
        // Create new record if it doesn't exist
        const { data: newCredits, error: insertError } = await supabase
          .from('user_credits')
          .insert({
            user_id: user.id,
            credits_remaining: credits,
            is_premium: true
          })
          .select('credits_remaining, is_premium')
          .single()

        if (insertError) {
          console.error('Error creating user credits:', insertError)
          return NextResponse.json(
            { error: 'Failed to create user credits' },
            { status: 500 }
          )
        }

        const result: CreditDeductResult = {
          success: true,
          creditsRemaining: newCredits.credits_remaining
        }

        return NextResponse.json(result)
      } else if (fetchError) {
        console.error('Error fetching credits:', fetchError)
        return NextResponse.json(
          { error: 'Failed to fetch credits' },
          { status: 500 }
        )
      }

      // Update existing record
      const newCreditsRemaining = (existingCredits.credits_remaining || 0) + credits
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({
          credits_remaining: newCreditsRemaining,
          is_premium: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (updateError) {
        console.error('Error adding credits:', updateError)
        return NextResponse.json(
          { error: 'Failed to add credits' },
          { status: 500 }
        )
      }

      const result: CreditDeductResult = {
        success: true,
        creditsRemaining: newCreditsRemaining
      }

      return NextResponse.json(result)
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in credits management API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
