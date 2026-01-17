-- Create payments table to store payment history and status
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_id VARCHAR(255) UNIQUE NOT NULL, -- PayPal payment ID
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, completed, cancelled, refunded
  credits INTEGER NOT NULL DEFAULT 20, -- Number of credits gained from this payment
  type VARCHAR(50) NOT NULL DEFAULT 'one-time', -- one-time, subscription
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paypal_data JSONB -- Store complete PayPal payment data
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_id ON public.payments(payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at);

-- Enable Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own payments
CREATE POLICY "Users can read own payments" 
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow service role to manage payments (for webhooks)
CREATE POLICY "Service role can manage payments" 
  ON public.payments FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_payments_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp on payments table
DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_payments_updated_at_column();

-- Insert function to add payment record
CREATE OR REPLACE FUNCTION public.add_payment_record(
  p_user_id UUID,
  p_payment_id VARCHAR(255),
  p_amount DECIMAL(10, 2),
  p_currency VARCHAR(3),
  p_status VARCHAR(50),
  p_credits INTEGER,
  p_type VARCHAR(50),
  p_paypal_data JSONB
)
RETURNS UUID AS $$
DECLARE
  new_payment_id UUID;
BEGIN
  INSERT INTO public.payments (
    user_id,
    payment_id,
    amount,
    currency,
    status,
    credits,
    type,
    paypal_data
  ) VALUES (
    p_user_id,
    p_payment_id,
    p_amount,
    p_currency,
    p_status,
    p_credits,
    p_type,
    p_paypal_data
  ) RETURNING id INTO new_payment_id;
  
  RETURN new_payment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update function to update payment status
CREATE OR REPLACE FUNCTION public.update_payment_status(
  p_payment_id VARCHAR(255),
  p_new_status VARCHAR(50),
  p_paypal_data JSONB
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.payments
  SET 
    status = p_new_status,
    paypal_data = p_paypal_data
  WHERE payment_id = p_payment_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;