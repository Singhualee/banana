'use client'

import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase'

interface User {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

const features = {
  free: [
    '5 image edits per day',
    'Basic image enhancement',
    'Standard resolution (1080p)',
    'No watermarks',
    'Email support'
  ],
  pro: [
    'Unlimited image edits',
    'Advanced image enhancement',
    'High resolution (4K)',
    'No watermarks',
    'Priority support',
    'Batch processing',
    'AI background removal',
    'Exclusive features'
  ],
  business: [
    'Everything in Pro',
    'Team collaboration',
    'API access',
    'Custom integrations',
    'Dedicated account manager',
    'SLA guarantee',
    'Custom pricing',
    'Enterprise support'
  ]
}

const plans = {
  free: { amount: 0, currency: 'USD', description: 'Free Plan' },
  pro: { amount: 999, currency: 'USD', description: 'Pro Plan - $9.99/month' },
  business: { amount: 2999, currency: 'USD', description: 'Business Plan - $29.99/month' }
}

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error checking user:', error)
        setUser(null)
      } finally {
        setCheckingAuth(false)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      setUser(session?.user ?? null)
      setCheckingAuth(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handlePayment = async (plan: keyof typeof plans) => {
    if (plan === 'free') {
      // 免费计划不需要支付，直接跳转到成功页面
      window.location.href = `/payment/success?plan=${plan}`
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/creem/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...plans[plan],
          plan
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment link')
      }

      window.location.href = data.url
    } catch (error) {
      console.error('Payment error:', error)
      alert('Failed to process payment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Select the plan that best fits your needs and start editing your images today.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <Card className="border-2 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Free</CardTitle>
              <CardDescription>Perfect for casual users</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {features.free.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handlePayment('free')}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Get Started'}
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-primary bg-primary/5 hover:shadow-xl transition-all duration-300 scale-105 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Pro</CardTitle>
              <CardDescription>Ideal for power users</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {features.pro.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-primary hover:bg-primary/90" 
                onClick={() => handlePayment('pro')}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Upgrade to Pro'}
              </Button>
            </CardFooter>
          </Card>

          {/* Business Plan */}
          <Card className="border-2 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Business</CardTitle>
              <CardDescription>For teams and enterprises</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$29.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {features.business.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handlePayment('business')}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Contact Sales'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* One-time Payment Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">一次性购买</CardTitle>
                  <CardDescription>购买 20 次免费生图权限</CardDescription>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">$9.99</span>
                  <span className="text-muted-foreground">/一次性</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>立即获得 20 次免费生图权限</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>无月费，一次性购买</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>权限永不过期</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>支持 PayPal 支付</span>
                </li>
              </ul>
              {user ? (
                <div className="mt-6">
                  <div style={{display:'inline-grid',justifyItems:'center',alignContent:'start',gap:'0.5rem'}}>
                    <Button 
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-md transition-all duration-300"
                      onClick={async () => {
                        setIsLoading(true)
                        try {
                          const response = await fetch('/api/paypal/payment-link', {
                            method: 'POST',
                            credentials: 'include',
                          })
                          
                          const data = await response.json()
                          
                          if (response.ok && data.url) {
                            window.location.href = data.url
                          } else {
                            throw new Error(data.error || 'Failed to create payment link')
                          }
                        } catch (error) {
                          console.error('Payment error:', error)
                          // Use toast notification instead of alert
                          toast.error('付款处理失败，请重试。', {
                            duration: 5000,
                            position: 'bottom-right'
                          })
                        } finally {
                          setIsLoading(false)
                        }
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? '处理中...' : '立即购买'}
                    </Button>
                    <img 
                      src="https://www.paypalobjects.com/images/Debit_Credit_APM.svg" 
                      alt="cards" 
                    />
                    <section style={{fontSize: '0.75rem'}}>
                      技术支持提供方：
                      <img 
                        src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg" 
                        alt="paypal" 
                        style={{height:'0.875rem',verticalAlign:'middle'}}
                      />
                    </section>
                  </div>
                </div>
              ) : (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-center text-muted-foreground">
                    请先登录后再购买
                  </p>
                  <Button 
                    className="w-full mt-2" 
                    onClick={() => window.location.href = '/login'}
                  >
                    前往登录
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I switch plans at any time?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes, you can upgrade, downgrade, or cancel your plan at any time. Your changes will take effect immediately.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Is there a free trial available?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes, we offer a 7-day free trial for Pro and Business plans. No credit card required.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How do I cancel my subscription?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You can cancel your subscription in your account settings. Your subscription will remain active until the end of your billing period.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We accept all major credit cards, PayPal, and Apple Pay.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
