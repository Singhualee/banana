export interface UserCredits {
  id: string
  user_id: string
  credits_remaining: number
  is_premium: boolean
  created_at: string
  updated_at: string
}

export interface UserCreditsResponse {
  credits_remaining: number
  is_premium: boolean
}

export interface PayPalWebhookEvent {
  id: string
  event_type: string
  resource_type: string
  resource: {
    id: string
    status: string
    amount: {
      total: string
      currency: string
    }
    purchase_units?: [{
      custom?: string
      amount: {
        currency_code: string
        value: string
        breakdown?: {
          item_total?: {
            currency_code: string
            value: string
          }
        }
      }
    }]
  }
  create_time: string
}

export interface CreditCheckResult {
  hasCredits: boolean
  creditsRemaining: number
  isPremium: boolean
  canGenerate: boolean
}

export interface CreditDeductResult {
  success: boolean
  creditsRemaining: number
  message?: string
}
