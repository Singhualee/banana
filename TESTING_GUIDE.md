# 本地测试指南

## 当前状态

✅ 开发服务器已启动：http://localhost:3000

## 测试前准备

由于 Supabase 环境变量还是占位符，你需要先配置 Supabase 才能测试 Google 登录功能。

### 步骤 1: 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com/)
2. 点击 "Start your project"
3. 使用 GitHub 或 Google 账号登录
4. 创建新项目（选择免费计划）
5. 等待项目创建完成（通常需要 1-2 分钟）

### 步骤 2: 获取 Supabase 凭据

1. 进入你的 Supabase 项目 Dashboard
2. 点击左侧菜单的 **Settings** > **API**
3. 复制以下信息：
   - **Project URL** (例如：https://xxxxxxxx.supabase.co)
   - **anon public** key

### 步骤 3: 配置 Google OAuth

#### 3.1 在 Supabase 中启用 Google 提供商

1. 在 Supabase Dashboard 中，点击 **Authentication** > **Providers**
2. 找到 **Google** 并启用它
3. 点击 **Configure** 按钮

#### 3.2 在 Google Cloud Console 创建 OAuth 应用

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建一个新项目或选择现有项目
3. 启用 Google+ API（如果需要）
4. 导航到 **APIs & Services** > **Credentials**
5. 点击 **Create Credentials** > **OAuth client ID**
6. 选择 **Web application** 作为应用类型
7. 配置授权的重定向 URI：
   ```
   http://localhost:3000/auth/callback
   ```
8. 保存并记录下 **Client ID** 和 **Client Secret**

#### 3.3 在 Supabase 中配置 Google 凭据

1. 回到 Supabase Dashboard 的 Google 提供商配置页面
2. 填入从 Google Cloud Console 获取的：
   - **Client ID**
   - **Client Secret**
3. 点击 **Save** 保存配置

### 步骤 4: 更新环境变量

1. 打开项目根目录的 `.env.local` 文件
2. 替换以下占位符：

```env
# Supabase (用于 Google 登录)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

3. 保存文件

### 步骤 5: 重启开发服务器

由于环境变量已更改，需要重启服务器：

1. 在终端按 `Ctrl + C` 停止服务器
2. 重新运行：`pnpm dev`

## 测试功能

### 1. 测试主页

访问 http://localhost:3000，你应该看到：
- ✅ 导航栏显示 "Banana Editor" logo
- ✅ 右上角显示 "登录" 按钮和认证按钮
- ✅ 主页内容正常显示

### 2. 测试登录页面

1. 点击导航栏的 "登录" 按钮
2. 应该跳转到 `/login` 页面
3. 看到登录卡片和 "使用 Google 登录" 按钮

### 3. 测试 Google 登录

1. 在登录页面点击 "使用 Google 登录" 按钮
2. 应该重定向到 Google 授权页面
3. 选择你的 Google 账号并授权
4. 自动重定向回应用
5. 导航栏应该显示你的用户名和 "退出" 按钮

### 4. 测试登出

1. 点击导航栏的 "退出" 按钮
2. 应该登出并返回主页
3. 导航栏恢复显示 "登录" 按钮

### 5. 测试 API 路由

你可以使用浏览器或 Postman 测试以下 API：

#### 获取用户信息
```bash
GET http://localhost:3000/api/auth/user
```

响应示例（未登录）：
```json
{
  "user": null
}
```

响应示例（已登录）：
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "user_metadata": {
      "full_name": "John Doe",
      "avatar_url": "https://..."
    }
  }
}
```

#### 发起 Google 登录
```bash
POST http://localhost:3000/api/auth/google
Content-Type: application/json
```

响应示例：
```json
{
  "url": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

#### 退出登录
```bash
POST http://localhost:3000/api/auth/logout
```

响应示例：
```json
{
  "success": true
}
```

## 常见问题

### Q: 点击登录按钮没有反应

**A:** 检查以下几点：
1. 确认 Supabase 环境变量已正确配置
2. 检查浏览器控制台是否有错误
3. 确认 Supabase 项目中的 Google 提供商已启用
4. 检查 Google Cloud Console 中的 OAuth 应用配置

### Q: Google 授权页面显示错误

**A:** 可能的原因：
1. Google Cloud Console 中的重定向 URI 不正确
   - 应该是：`http://localhost:3000/auth/callback`
2. OAuth 应用类型选择错误
   - 应该选择 "Web application"
3. Client ID 或 Client Secret 配置错误

### Q: 登录后立即退出

**A:** 检查：
1. Supabase 项目的 Site URL 配置
   - 应该是：`http://localhost:3000`
2. 确认 `NEXT_PUBLIC_SITE_URL` 环境变量正确

### Q: API 返回 500 错误

**A:** 检查：
1. 确认所有 Supabase 环境变量都已配置
2. 检查服务器终端日志查看详细错误信息
3. 确认 Supabase 项目状态正常

## 调试技巧

### 查看浏览器控制台

1. 按 `F12` 打开开发者工具
2. 查看 Console 标签页的错误信息
3. 查看 Network 标签页的请求详情

### 查看服务器日志

在运行 `pnpm dev` 的终端中查看：
- 请求日志
- 错误信息
- 编译警告

### 检查 Supabase 日志

1. 进入 Supabase Dashboard
2. 点击左侧菜单的 **Logs**
3. 查看 Authentication 相关的日志

## 下一步

完成测试后，你可以：
1. 配置生产环境的 Supabase 项目
2. 在 Google Cloud Console 中添加生产环境的重定向 URI
3. 部署应用到 Vercel 或其他平台
4. 实现更多认证功能（如邮箱密码登录、GitHub 登录等）

## 参考文档

- [Supabase Auth - Social Login](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase Auth - Server-side](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Google Cloud Console](https://console.cloud.google.com/)
