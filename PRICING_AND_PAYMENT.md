# Pricing Page & Creem Payment Integration

## Overview

This document describes the implementation of the Pricing page and integration with Creem payment gateway in the Banana Editor application.

## Pricing Page

### Features

- Three pricing plans: Free, Pro, and Business
- Responsive design with cards layout
- Feature comparison between plans
- FAQ section for common questions

### Plan Details

#### Free Plan
- 5 image edits per day
- Basic image enhancement
- Standard resolution (1080p)
- No watermarks
- Email support

#### Pro Plan
- Unlimited image edits
- Advanced image enhancement
- High resolution (4K)
- No watermarks
- Priority support
- Batch processing
- AI background removal
- Exclusive features

#### Business Plan
- Everything in Pro
- Team collaboration
- API access
- Custom integrations
- Dedicated account manager
- SLA guarantee
- Custom pricing
- Enterprise support

## Creem Payment Integration

### Setup

1. **Install Dependencies**: No additional dependencies required, uses native fetch API.

2. **Configuration**: 
   - Add Creem API keys to `.env.local`:
     ```env
     CREEM_API_KEY=your_creem_api_key
     CREEM_BASE_URL=https://api.creem.io
     ```

3. **Components**: 
   - `lib/creem.ts`: Creem API client
   - `app/api/payments/create/route.ts`: API route for creating payment links
   - `app/payment/success/page.tsx`: Payment success page
   - `app/payment/cancel/page.tsx`: Payment cancel page

### Usage

1. **Creating Payment Links**: 
   - Call the `/api/payments/create` endpoint with payment details
   - Example request:
     ```json
     {
       "amount": 999,
       "currency": "USD",
       "description": "Pro Plan - $9.99/month",
       "plan": "pro"
     }
     ```

2. **Processing Payments**: 
   - Users click "Get Started" or "Upgrade" buttons on the Pricing page
   - The application creates a payment link via the API
   - Users are redirected to Creem's payment page
   - After payment, users are redirected back to the application

3. **Handling Payment Results**: 
   - Success: Users are redirected to `/payment/success` with plan details
   - Cancel: Users are redirected to `/payment/cancel`

## API Endpoints

### POST /api/payments/create

Creates a new payment link.

**Request Body**: 
```json
{
  "amount": number,           // Amount in cents
  "currency": string,         // ISO currency code (e.g., USD)
  "description": string,      // Payment description
  "plan": string              // Plan identifier (free, pro, business)
}
```

**Response**: 
```json
{
  "id": string,               // Payment link ID
  "url": string,              // Payment page URL
  "status": string,           // Payment status
  "amount": number,           // Amount in cents
  "currency": string,         // ISO currency code
  "createdAt": string         // Creation timestamp
}
```

## Testing

1. **Development**: Use test API keys provided by Creem
2. **Production**: Use live API keys and ensure HTTPS is enabled

## Troubleshooting

- **Payment Link Creation Fails**: Check API key validity and network connectivity
- **Redirect Issues**: Ensure `NEXT_PUBLIC_SITE_URL` is correctly configured
- **Environment Variables**: Verify Creem API keys are properly set in `.env.local`

## Future Enhancements

- Add subscription management
- Implement webhook handlers for payment events
- Add invoice generation
- Support multiple payment methods
- Add discount code functionality
