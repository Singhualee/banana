# Supabase Storage 图片存储测试指南

## 📋 前置条件

在测试之前，您需要在 Supabase 中执行以下 SQL 迁移脚本。

## 🗄️ 步骤 1：执行数据库迁移

### 1.1 创建 Storage Bucket

在 Supabase Dashboard 中：
1. 进入 **SQL Editor**
2. 创建新查询
3. 粘贴并执行以下 SQL：

```sql
-- Create Storage Bucket for user images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-images',
  'user-images',
  true,
  52428800,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated uploads to user-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to view user-images" ON storage.objects;

-- Create policy to allow authenticated users to upload to user-images bucket
CREATE POLICY "Allow authenticated uploads to user-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-images'
);

-- Create policy to allow authenticated users to view their own files in user-images bucket
CREATE POLICY "Allow authenticated to view user-images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow authenticated users to update their own files
CREATE POLICY "Allow authenticated to update user-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'user-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow authenticated users to delete their own files
CREATE POLICY "Allow authenticated to delete user-images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Grant usage on user-images bucket to authenticated users
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT ALL ON SCHEMA storage TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA storage TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA storage TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA storage TO authenticated;
```

### 1.2 修改 user_images 表结构

继续在 SQL Editor 中执行：

```sql
-- Add columns to store file paths instead of base64 data
ALTER TABLE user_images ADD COLUMN IF NOT EXISTS original_image_path TEXT;
ALTER TABLE user_images ADD COLUMN IF NOT EXISTS generated_image_path TEXT;

-- Create index on file paths for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_images_original_path ON user_images(original_image_path);
CREATE INDEX IF NOT EXISTS idx_user_images_generated_path ON user_images(generated_image_path);
```

## ✅ 验证配置

### 验证 Storage Bucket

1. 在 Supabase Dashboard 中进入 **Storage**
2. 确认看到 `user-images` bucket
3. 点击 bucket，确认 **Public** 状态已启用

### 验证数据库表

1. 在 Supabase Dashboard 中进入 **Table Editor**
2. 查看 `user_images` 表
3. 确认有以下列：
   - `id`
   - `user_id`
   - `original_image` (存储公共 URL)
   - `generated_image` (存储公共 URL)
   - `original_image_path` (存储文件路径)
   - `generated_image_path` (存储文件路径)
   - `prompt`
   - `created_at`
   - `updated_at`

## 🧪 测试流程

### 测试 1：图片上传

1. 启动开发服务器（如果尚未启动）：
   ```bash
   pnpm dev
   ```

2. 访问 http://localhost:3000

3. 使用 Google 账号登录

4. 上传一张图片并输入提示词

5. 点击生成按钮

6. **预期结果**：
   - ✅ 图片生成成功
   - ✅ 图片显示在页面上
   - ✅ 在 Supabase Storage 中可以看到上传的文件
   - ✅ 在 `user_images` 表中可以看到新记录
   - ✅ `original_image` 和 `generated_image` 字段包含公共 URL
   - ✅ `original_image_path` 和 `generated_image_path` 字段包含文件路径

### 测试 2：图片显示

1. 访问 http://localhost:3000/gallery

2. **预期结果**：
   - ✅ 显示所有生成的图片
   - ✅ 图片可以正常加载（使用公共 URL）
   - ✅ 可以切换查看原图和生成图

### 测试 3：图片下载

1. 在图片库中点击 "Download" 按钮

2. **预期结果**：
   - ✅ 图片成功下载
   - ✅ 文件名为 `ai-edit-{image-id}.png`

### 测试 4：图片删除

1. 在图片库中点击 "Delete" 按钮

2. 确认删除

3. **预期结果**：
   - ✅ 图片从数据库中删除
   - ✅ 图片文件从 Storage 中删除
   - ✅ 图片从页面中移除

## 🔍 调试技巧

### 查看上传的文件

1. 在 Supabase Dashboard 中进入 **Storage** → **user-images**
2. 可以看到按用户 ID 分组的文件
3. 文件命名格式：`{user-id}/{timestamp}_original.png` 或 `{user-id}/{timestamp}_generated.png`

### 查看数据库记录

1. 在 Supabase Dashboard 中进入 **Table Editor** → **user_images**
2. 查看记录的详细信息
3. 检查 `original_image` 和 `generated_image` 是否包含公共 URL

### 查看控制台日志

1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签页
3. 查看是否有错误信息

### 查看网络请求

1. 打开浏览器开发者工具（F12）
2. 查看 Network 标签页
3. 查看图片加载请求
4. 确认 URL 格式为：
   ```
   https://your-project.supabase.co/storage/v1/object/public/user-images/{user-id}/{filename}
   ```

## ⚠️ 常见问题

### 问题 1：图片无法加载

**可能原因**：
- Storage Bucket 未设置为 Public
- RLS 策略配置错误
- 文件路径不正确

**解决方案**：
1. 检查 Storage Bucket 是否为 Public
2. 检查 RLS 策略是否正确配置
3. 查看浏览器控制台错误信息

### 问题 2：上传失败

**可能原因**：
- Storage Bucket 不存在
- 用户权限不足
- 文件大小超过限制

**解决方案**：
1. 确认 Storage Bucket 已创建
2. 检查 RLS 策略是否允许上传
3. 检查文件大小限制（当前设置为 50MB，Supabase Free Plan 限制）

### 问题 3：删除失败

**可能原因**：
- 文件路径不正确
- 用户权限不足

**解决方案**：
1. 检查 `original_image_path` 和 `generated_image_path` 是否正确
2. 检查 RLS 策略是否允许删除

## 📊 性能对比

### Base64 方案（旧方案）
- ❌ 数据库存储压力大
- ❌ 查询性能差
- ❌ 传输慢
- ❌ 不适合大量图片

### Supabase Storage 方案（新方案）
- ✅ 数据库存储压力小
- ✅ 查询性能好
- ✅ 传输快（利用 CDN）
- ✅ 支持大量图片
- ✅ 支持图片压缩和优化

## 🎯 下一步

完成测试后，您可以：

1. **优化图片压缩**：在上传前压缩图片以减少存储空间
2. **添加图片预览**：生成缩略图以提高加载速度
3. **实现图片编辑**：添加更多图片编辑功能
4. **添加图片分享**：实现图片分享功能

## 📝 注意事项

- ✅ 所有图片都存储在 Supabase Storage 中
- ✅ 数据库只存储文件路径和公共 URL
- ✅ 公共 URL 可以直接在 `<img>` 标签中使用
- ✅ 删除图片时会同时删除数据库记录和 Storage 文件
- ✅ 用户只能访问自己的图片（通过 RLS 策略控制）
