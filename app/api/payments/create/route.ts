// app/api/payments/create/route.ts

import { NextResponse } from 'next/server'
import { creem } from '@/lib/creem'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, currency, description, plan } = body

    if (!amount || !currency || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 构建成功和取消回调URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const successUrl = `${siteUrl}/payment/success?plan=${plan}`
    const cancelUrl = `${siteUrl}/payment/cancel`

    // 创建支付链接
    const paymentLink = await creem.createPaymentLink({
      amount,
      currency,
      description,
      successUrl,
      cancelUrl,
      metadata: { plan }
    })

    return NextResponse.json(paymentLink, { status: 201 })
  } catch (error) {
    console.error('Error creating payment link:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to create payment link',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
