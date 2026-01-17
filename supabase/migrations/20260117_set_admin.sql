-- Set user as admin
UPDATE auth.users 
SET role = 'admin' 
WHERE email = 'scaulsh@gmail.com';

-- Ensure the user has unlimited credits
UPDATE user_credits 
SET credits_remaining = -1 -- -1 indicates unlimited credits
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'scaulsh@gmail.com');

-- Grant admin privileges to bypass RLS (optional)
-- This allows admin users to access all data without RLS restrictions
CREATE POLICY "Admin can access all user credits" 
ON user_credits 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM auth.users 
  WHERE auth.users.id = user_credits.user_id 
  AND auth.users.role = 'admin'
));

CREATE POLICY "Admin can access all user images" 
ON user_images 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM auth.users 
  WHERE auth.users.id = user_images.user_id 
  AND auth.users.role = 'admin'
));
