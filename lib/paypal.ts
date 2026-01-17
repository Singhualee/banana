// lib/paypal.ts
// PayPal Service Layer - centralizing all PayPal-related functionality

interface PayPalConfig {
  mode: 'sandbox' | 'live'
  apiUrl: string
  clientId: string
  clientSecret: string
}

interface PayPalCreateOrderParams {
  amount: number
  currency: string
  returnUrl: string
  cancelUrl: string
  customData?: { [key: string]: any }
}

interface PayPalOrderResponse {
  id: string
  status: string
  links: Array<{ href: string; rel: string; method: string }>
}

interface PayPalWebhookVerificationParams {
  headers: Headers
  body: string
}

export class PayPalService {
  private config: PayPalConfig

  constructor() {
    // Initialize PayPal configuration from environment variables
    const mode = (process.env.NEXT_PUBLIC_PAYPAL_MODE || 'sandbox') as 'sandbox' | 'live'
    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      throw new Error('PayPal client ID and secret are required')
    }

    this.config = {
      mode,
      apiUrl: mode === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com',
      clientId,
      clientSecret
    }
  }

  /**
   * Create PayPal authentication header
   */
  private getAuthHeader(): string {
    const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')
    return `Basic ${auth}`
  }

  /**
   * Create PayPal payment order
   */
  async createOrder(params: PayPalCreateOrderParams): Promise<PayPalOrderResponse> {
    const { amount, currency, returnUrl, cancelUrl, customData } = params

    const response = await fetch(
      `${this.config.apiUrl}/v2/checkout/orders`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthHeader()
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: currency,
                value: amount.toFixed(2)
              },
              custom: customData ? JSON.stringify(customData) : undefined
            }
          ],
          application_context: {
            brand_name: 'Banana Editor',
            locale: 'zh-CN',
            landing_page: 'BILLING',
            user_action: 'PAY_NOW',
            return_url: returnUrl,
            cancel_url: cancelUrl,
            shipping_preference: 'NO_SHIPPING'
          }
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Failed to create PayPal order: ${errorData.message || response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get approval URL from PayPal order response
   */
  getApprovalUrl(orderResponse: PayPalOrderResponse): string | null {
    const approvalLink = orderResponse.links.find(link => link.rel === 'approve')
    return approvalLink ? approvalLink.href : null
  }

  /**
   * Verify PayPal webhook signature
   */
  async verifyWebhookSignature(params: PayPalWebhookVerificationParams): Promise<boolean> {
    const { headers, body } = params

    const webhookId = process.env.PAYPAL_WEBHOOK_ID
    const webhookSecret = process.env.PAYPAL_WEBHOOK_SECRET

    if (!webhookId || !webhookSecret) {
      console.error('PayPal webhook ID and secret are required')
      return false
    }

    // Get headers needed for signature verification
    const transmissionId = headers.get('paypal-transmission-id')
    const transmissionTime = headers.get('paypal-transmission-time')
    const certUrl = headers.get('paypal-cert-url')
    const authAlgo = headers.get('paypal-auth-algo')
    const signature = headers.get('paypal-transmission-sig')

    if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !signature) {
      console.error('Missing PayPal webhook signature headers')
      return false
    }

    // For PayPal v2 webhook verification, we need to use the PayPal API
    const verifyResponse = await fetch(
      `${this.config.apiUrl}/v1/notifications/verify-webhook-signature`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthHeader()
        },
        body: JSON.stringify({
          auth_algo: authAlgo,
          cert_url: certUrl,
          transmission_id: transmissionId,
          transmission_sig: signature,
          transmission_time: transmissionTime,
          webhook_id: webhookId,
          webhook_event: JSON.parse(body)
        })
      }
    )

    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json().catch(() => ({}))
      console.error('PayPal webhook verification failed:', errorData)
      return false
    }

    const verifyResult = await verifyResponse.json()
    return verifyResult.verification_status === 'SUCCESS'
  }

  /**
   * Validate payment amount
   */
  validatePaymentAmount(amount: number, currency: string): boolean {
    // Only allow $9.99 USD payments
    return amount === 9.99 && currency === 'USD'
  }

  /**
   * Extract custom data from PayPal event
   */
  extractCustomData(event: any): { [key: string]: any } | null {
    // Try to get custom data from purchase_units (PayPal v2 API)
    if (event.resource?.purchase_units && event.resource.purchase_units.length > 0) {
      const customField = event.resource.purchase_units[0].custom
      if (customField) {
        try {
          return JSON.parse(customField)
        } catch (error) {
          console.error('Failed to parse custom data:', error)
        }
      }
    }
    return null
  }

  /**
   * Extract payment amount and currency from PayPal event
   */
  extractPaymentDetails(event: any): { amount: number; currency: string } | null {
    // Try to get amount from purchase_units (PayPal v2 API)
    if (event.resource?.purchase_units && event.resource.purchase_units.length > 0) {
      const amountInfo = event.resource.purchase_units[0].amount
      if (amountInfo) {
        return {
          amount: parseFloat(amountInfo.value),
          currency: amountInfo.currency_code
        }
      }
    }
    
    // Fallback to old location (PayPal v1 API)
    if (event.resource?.amount) {
      return {
        amount: parseFloat(event.resource.amount.total),
        currency: event.resource.amount.currency
      }
    }
    
    return null
  }
}

// Create a singleton instance for easy use
export const paypalService = new PayPalService()
