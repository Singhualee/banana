// app/api/creem/checkout/route.ts

import { NextResponse } from 'next/server'

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

    // 检查必要的环境变量
    const apiKey = process.env.CREEM_API_KEY
    const baseUrl = process.env.CREEM_BASE_URL

    if (!apiKey) {
      return NextResponse.json(
        { error: 'CREEM_API_KEY is not configured' },
        { status: 500 }
      )
    }

    if (!baseUrl) {
      return NextResponse.json(
        { error: 'CREEM_BASE_URL is not configured' },
        { status: 500 }
      )
    }

    // 构建成功和取消回调URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const successUrl = `${siteUrl}/payment/success?plan=${plan}`
    const cancelUrl = `${siteUrl}/payment/cancel`

    // 使用正式模式 product ID 创建支付链接
    const productId = 'prod_6YWMBFCKnhrFRL8EBTt7ES'
    const paymentUrl = `https://www.creem.io/payment/${productId}?success_url=${encodeURIComponent(successUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}`

    return NextResponse.json({ url: paymentUrl }, { status: 200 })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}