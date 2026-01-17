// app/api/payments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get all payments for the user, ordered by created_at descending
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (paymentsError) {
      console.error('Error fetching payments:', paymentsError)
      return NextResponse.json(
        { error: 'Failed to fetch payments' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      payments,
      total: payments?.length || 0
    })
    
  } catch (error) {
    console.error('Error in payments API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
