// app/api/creem/webhook/route.ts

import { NextResponse } from 'next/server'
import { creem } from '@/lib/creem'

export async function POST(request: Request) {
  try {
    // 获取请求体
    const payload = await request.text()
    
    // 获取签名头
    const signature = request.headers.get('x-creem-signature')
    
    // 获取环境变量中的密钥
    const webhookSecret = process.env.CREEM_WEBHOOK_SECRET
    
    if (!webhookSecret) {
      console.error('CREEM_WEBHOOK_SECRET not set')
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }
    
    // 验证签名
    const isValid = creem.verifyWebhookSignature(payload, signature)
    
    if (!isValid) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
    
    // 解析事件数据
    const event = JSON.parse(payload)
    
    // 根据事件类型处理不同的逻辑
    switch (event.type) {
      case 'payment.succeeded':
        // 处理支付成功事件
        console.log('Payment succeeded:', event.data)
        // 这里可以更新数据库中的订单状态、发送通知等
        break
        
      case 'payment.failed':
        // 处理支付失败事件
        console.log('Payment failed:', event.data)
        // 这里可以更新数据库中的订单状态、发送通知等
        break
        
      case 'subscription.created':
        // 处理订阅创建事件
        console.log('Subscription created:', event.data)
        break
        
      case 'subscription.canceled':
        // 处理订阅取消事件
        console.log('Subscription canceled:', event.data)
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
    
    // 返回成功响应
    return NextResponse.json({ received: true }, { status: 200 })
    
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 })
  }
}