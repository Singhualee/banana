-- 创建用户图片表
CREATE TABLE IF NOT EXISTS user_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_image TEXT NOT NULL,
  generated_image TEXT NOT NULL,
  original_image_path TEXT,
  generated_image_path TEXT,
  prompt TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_user_images_user_id ON user_images(user_id);
CREATE INDEX IF NOT EXISTS idx_user_images_created_at ON user_images(created_at DESC);

-- 启用行级安全策略 (RLS)
ALTER TABLE user_images ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能查看自己的图片
CREATE POLICY "Users can view their own images"
ON user_images
FOR SELECT
USING (auth.uid() = user_id);

-- 创建策略：用户只能插入自己的图片
CREATE POLICY "Users can insert their own images"
ON user_images
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 创建策略：用户只能删除自己的图片
CREATE POLICY "Users can delete their own images"
ON user_images
FOR DELETE
USING (auth.uid() = user_id);

-- 创建更新时间戳的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
CREATE TRIGGER update_user_images_updated_at
BEFORE UPDATE ON user_images
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
