-- Create user_credits table to store user free image generation credits
CREATE TABLE IF NOT EXISTS public.user_credits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_remaining INTEGER NOT NULL DEFAULT 2,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON public.user_credits(user_id);

-- Enable Row Level Security
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own credits
CREATE POLICY "Users can read own credits"
  ON public.user_credits FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to update their own credits
CREATE POLICY "Users can update own credits"
  ON public.user_credits FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy to allow service role to insert/update credits (for webhooks)
CREATE POLICY "Service role can manage credits"
  ON public.user_credits FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Function to automatically create user_credits entry when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, credits_remaining, is_premium)
  VALUES (NEW.id, 2, false);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_user_credits_updated_at
  BEFORE UPDATE ON public.user_credits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to add credits to a user
CREATE OR REPLACE FUNCTION public.add_credits(
  p_user_id UUID,
  p_credits_to_add INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.user_credits
  SET
    credits_remaining = credits_remaining + p_credits_to_add,
    is_premium = true,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to deduct credits from a user
CREATE OR REPLACE FUNCTION public.deduct_credits(
  p_user_id UUID,
  p_credits_to_deduct INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  SELECT credits_remaining INTO current_credits
  FROM public.user_credits
  WHERE user_id = p_user_id;
  
  IF current_credits >= p_credits_to_deduct THEN
    UPDATE public.user_credits
    SET
      credits_remaining = credits_remaining - p_credits_to_deduct,
      updated_at = NOW()
    WHERE user_id = p_user_id;
    
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user credits
CREATE OR REPLACE FUNCTION public.get_user_credits(p_user_id UUID)
RETURNS TABLE(
  credits_remaining INTEGER,
  is_premium BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT uc.credits_remaining, uc.is_premium
  FROM public.user_credits uc
  WHERE uc.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
