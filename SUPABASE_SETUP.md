# Supabase Google 登录配置指南

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com/) 并创建一个新项目
2. 记录下项目的 URL 和 anon key

## 2. 配置 Google OAuth

### 2.1 在 Supabase 中启用 Google 提供商

1. 进入 Supabase Dashboard
2. 导航到 **Authentication** > **Providers**
3. 找到 **Google** 提供商并启用它
4. 点击 **Configure** 按钮

### 2.2 在 Google Cloud Console 创建 OAuth 应用

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建一个新项目或选择现有项目
3. 导航到 **APIs & Services** > **Credentials**
4. 点击 **Create Credentials** > **OAuth client ID**
5. 选择 **Web application** 作为应用类型
6. 配置授权的重定向 URI：
   - `http://localhost:3000/auth/callback` (开发环境)
   - `https://your-domain.com/auth/callback` (生产环境)
7. 记录下 **Client ID** 和 **Client Secret**

### 2.3 在 Supabase 中配置 Google 凭据

1. 回到 Supabase Dashboard 的 Google 提供商配置页面
2. 填入从 Google Cloud Console 获取的：
   - **Client ID**
   - **Client Secret**
3. 保存配置

## 3. 环境变量配置

在项目根目录创建 `.env.local` 文件，添加以下环境变量：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 站点配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# OpenRouter API (用于图像编辑)
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=google/gemini-2.5-flash-image
```

### 环境变量说明

- `NEXT_PUBLIC_SUPABASE_URL`: 你的 Supabase 项目 URL（从 Supabase Dashboard 获取）
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: 你的 Supabase 匿名密钥（从 Supabase Dashboard 获取）
- `NEXT_PUBLIC_SITE_URL`: 你的应用 URL（用于 OAuth 回调）

## 4. 功能特性

### 已实现的功能

- ✅ Google OAuth 登录
- ✅ 服务器端认证（使用 Supabase SSR）
- ✅ 自动会话管理
- ✅ 登录/登出功能
- ✅ 用户状态显示
- ✅ 响应式导航栏

### API 路由

- `POST /api/auth/google` - 发起 Google 登录
- `GET /api/auth/user` - 获取当前用户信息
- `POST /api/auth/logout` - 退出登录
- `GET /auth/callback` - OAuth 回调处理

### 组件

- `GoogleLoginButton` - Google 登录按钮组件
- `AuthButton` - 认证状态按钮组件（自动显示登录/登出）
- `Navbar` - 导航栏组件（包含认证按钮）

## 5. 使用方法

### 登录

1. 点击导航栏的 "登录" 按钮
2. 选择 "使用 Google 登录"
3. 在 Google 授权页面确认授权
4. 自动重定向回应用

### 登出

1. 点击导航栏右上角的用户信息
2. 点击 "退出" 按钮

## 6. 安全注意事项

- ⚠️ 永远不要将 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 提交到版本控制系统
- ⚠️ 在生产环境中使用 HTTPS
- ⚠️ 确保在 Google Cloud Console 中正确配置授权的重定向 URI
- ⚠️ 在 Supabase Dashboard 中配置适当的 RLS (Row Level Security) 策略

## 7. 故障排除

### 登录失败

1. 检查环境变量是否正确配置
2. 确认 Google OAuth 应用的重定向 URI 是否正确
3. 检查 Supabase Dashboard 中的 Google 提供商是否已启用
4. 查看浏览器控制台和服务器日志

### 会话问题

1. 清除浏览器 cookies
2. 检查 `NEXT_PUBLIC_SITE_URL` 是否正确
3. 确认 Supabase 项目设置中的 Site URL 配置

## 8. 参考文档

- [Supabase Auth - Social Login](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase Auth - Server-side](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Google Cloud Console](https://console.cloud.google.com/)
