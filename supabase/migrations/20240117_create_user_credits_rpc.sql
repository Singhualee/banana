-- Create RPC function to handle new user credits creation
CREATE OR REPLACE FUNCTION public.handle_new_user_credits(p_user_id UUID)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  credits_remaining INTEGER,
  is_premium BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, credits_remaining, is_premium)
  VALUES (p_user_id, 2, false)
  ON CONFLICT (user_id) DO NOTHING
  RETURNING *;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.handle_new_user_credits(UUID) TO authenticated;
