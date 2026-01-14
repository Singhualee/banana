# 数据库设置说明

## 步骤 1：在 Supabase 中创建表

1. 登录到您的 Supabase 项目
2. 进入 SQL Editor
3. 执行以下 SQL 脚本：

```sql
-- 创建用户图片表
CREATE TABLE IF NOT EXISTS user_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_image TEXT NOT NULL,
  generated_image TEXT NOT NULL,
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
```

## 步骤 2：验证表创建

执行以下 SQL 查询来验证表是否创建成功：

```sql
SELECT * FROM user_images;
```

## 功能说明

### 1. 自动保存图片
- 当用户使用 AI 图像编辑功能生成图片后，系统会自动将原始图片、生成图片和提示词保存到数据库
- 图片与用户账号关联，只有登录用户才能查看自己的图片

### 2. 图片管理
- 访问 `/gallery` 页面查看所有历史图片
- 每张图片显示：
  - 生成后的图片（大图）
  - 原始图片和生成图片的缩略图
  - 提示词文本
  - 创建时间
  - 下载按钮
  - 删除按钮

### 3. 数据安全
- 使用行级安全策略 (RLS) 确保用户只能访问自己的图片
- 用户删除账号时，相关图片会自动删除（级联删除）
- 所有操作都需要用户认证

## API 端点

- `GET /api/images` - 获取当前用户的所有图片
- `DELETE /api/images/[id]` - 删除指定 ID 的图片
- `POST /api/edit-image` - 生成图片并自动保存到数据库

## 注意事项

1. 图片数据以 Base64 格式存储在数据库中，对于大量图片可能会占用较多存储空间
2. 如果需要存储大量图片，建议使用 Supabase Storage 服务
3. 删除图片操作不可撤销，请谨慎操作
