// lib/creem.ts

interface CreemConfig {
  apiKey: string
  baseUrl?: string
}

export interface PaymentLinkOptions {
  amount: number
  currency: string
  description: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, any>
}

export interface PaymentLink {
  id: string
  url: string
  status: string
  amount: number
  currency: string
  createdAt: string
}

export class Creem {
  private apiKey: string
  private baseUrl: string
  private webhookSecret?: string

  constructor(config: CreemConfig & { webhookSecret?: string }) {
    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl || 'https://api.creem.io/v1'
    this.webhookSecret = config.webhookSecret
  }

  private async request<T>(
    endpoint: string,
    method: string = 'GET',
    body?: Record<string, any>
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json'
    }

    const options: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    }

    const response = await fetch(url, options)

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `Creem API request failed with status ${response.status}`)
    }

    return response.json()
  }

  async createPaymentLink(options: PaymentLinkOptions): Promise<PaymentLink> {
    return this.request<PaymentLink>('/checkout', 'POST', options)
  }

  /**
   * 验证Creem webhook签名
   * @param payload webhook请求体
   * @param signature 签名头
   * @returns 是否有效
   */
  verifyWebhookSignature(payload: string, signature: string | null): boolean {
    if (!this.webhookSecret || !signature) {
      return false
    }

    // 注意：这里使用的是简化的验证逻辑
    // 实际项目中应该使用Creem文档中指定的哈希算法进行验证
    // 例如：使用HMAC SHA256算法，将payload和secret组合后生成哈希值
    // 然后与signature进行比较
    
    // 这里只是一个示例实现，需要根据Creem的实际文档进行调整
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(payload)
      .digest('hex')

    return expectedSignature === signature
  }
}

// Create a singleton instance
export const creem = new Creem({
  apiKey: process.env.CREEM_API_KEY || '',
  baseUrl: process.env.CREEM_BASE_URL,
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET
})
