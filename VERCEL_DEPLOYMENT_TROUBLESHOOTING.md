# Vercel 部署排故指南

## 常见问题和解决方案

### 问题 1: 预渲染错误 - 缺少 Supabase 环境变量

**错误信息：**
```
Error occurred prerendering page "/_not-found"
Error: @supabase/ssr: Your project's URL and API key are required to create a Supabase client!
Export encountered an error on /_not-found/page: /_not-found, exiting
```

**根本原因：**
- Vercel 通过预渲染页面来构建
- 在构建时，环境变量可能不可用
- 尝试在没有环境变量的情况下创建 Supabase 客户端的组件会失败

**解决方案：**
1. 在服务器组件中为 Supabase 客户端创建添加 try-catch 块
2. 即使环境变量缺失也允许构建继续
3. 只在开发模式下记录错误

**修复示例：**
```typescript
// components/hero-server.tsx
export async function Hero() {
  let user = null
  
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (error) {
    console.warn('Failed to get user:', error)
  }

  return <HeroClient initialUser={user} />
}
```

**修改的文件：**
- `lib/supabase-server.ts` - 添加了错误处理和仅开发模式的日志记录
- `components/hero-server.tsx` - 为用户认证添加了 try-catch

---

### 问题 2: Vercel.json Schema 验证错误

**错误信息：**
```
The `vercel.json` schema validation failed with following message: 
`env.NEXT_PUBLIC_SITE_URL` should be string
```

**根本原因：**
- 环境变量不能在 `vercel.json` 中定义
- `vercel.json` 中的 `env` 字段用于构建时环境变量，而不是运行时变量

**解决方案：**
从 `vercel.json` 中移除 `env` 配置，改为在 Vercel Dashboard 中配置环境变量。

**正确的 `vercel.json`：**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["hkg1"]
}
```

**修改的文件：**
- `vercel.json` - 移除了无效的 `env` 配置

---

### 问题 3: Google 登录功能一直没响应

**问题描述：**
点击 Google 登录按钮后，页面没有任何响应，没有跳转到 Google 授权页面。

**排查过程：**

**步骤 1: 检查浏览器控制台错误**
- 打开浏览器开发者工具（F12）
- 查看 Console 标签页
- 发现没有明显的 JavaScript 错误
- Network 标签页显示登录请求根本没有发出

**步骤 2: 检查登录按钮组件**
查看 `components/google-login-button.tsx`：
```typescript
const handleGoogleLogin = async () => {
  setLoading(true)
  try {
    const response = await fetch('/api/auth/google', {
      method: 'POST',
    })
    // ...
  }
}
```
- 按钮点击事件绑定正确
- fetch 请求配置看起来正常

**步骤 3: 检查 API 路由**
查看 `app/api/auth/google/route.ts`：
```typescript
export async function POST(request: NextRequest) {
  const supabase = await createClient(request)
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })
  // ...
}
```
- API 路由逻辑看起来正确
- 使用了 Supabase OAuth

**步骤 4: 检查 Supabase 配置**
- 确认 Supabase 项目中已启用 Google OAuth
- 确认回调 URL 配置正确
- 确认环境变量 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 已设置

**步骤 5: 检查中间件配置**
查看 `middleware.ts`：
```typescript
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicPath = pathname === '/login' || 
                       pathname === '/auth/callback' || 
                       pathname.startsWith('/api/auth') ||
                       pathname === '/'

  if (isPublicPath) {
    return NextResponse.next()
  }

  return NextResponse.next()
}
```
- 中间件配置看起来正常
- 允许 `/api/auth` 路径通过

**步骤 6: 深入调试 - 添加日志**
在 `google-login-button.tsx` 中添加详细日志：
```typescript
const handleGoogleLogin = async () => {
  console.log('[Google Login] Button clicked')
  setLoading(true)
  try {
    console.log('[Google Login] Sending request to /api/auth/google')
    const response = await fetch('/api/auth/google', {
      method: 'POST',
    })
    console.log('[Google Login] Response received:', response.status)
    // ...
  } catch (error) {
    console.error('[Google Login] Error:', error)
  }
}
```

**步骤 7: 发现问题**
- 日志显示按钮点击事件被触发
- 但 fetch 请求没有发出
- 检查发现 `setLoading(true)` 可能导致组件重新渲染
- 重新渲染时，事件处理器可能丢失

**步骤 8: 修复问题**
修改 `components/google-login-button.tsx`，使用 `useCallback` 稳定事件处理器：
```typescript
const handleGoogleLogin = useCallback(async () => {
  setLoading(true)
  try {
    const response = await fetch('/api/auth/google', {
      method: 'POST',
    })
    const data = await response.json()
    
    if (data.url) {
      window.location.href = data.url
    }
  } catch (error) {
    console.error('Error during Google login:', error)
    alert('登录失败，请稍后重试')
  } finally {
    setLoading(false)
  }
}, [])

return (
  <Button
    onClick={handleGoogleLogin}
    disabled={loading}
    className="w-full"
  >
    {loading ? '登录中...' : '使用 Google 登录'}
  </Button>
)
```

**步骤 9: 测试验证**
- 点击登录按钮
- 成功跳转到 Google 授权页面
- 授权后成功回调
- 登录功能正常工作

**根本原因：**
事件处理器在组件重新渲染时被重新创建，导致点击事件丢失或行为异常。使用 `useCallback` 稳定函数引用可以解决这个问题。

**修改的文件：**
- `components/google-login-button.tsx` - 使用 useCallback 稳定事件处理器
- `components/auth-button.tsx` - 同样的问题，也进行了修复

**经验教训：**
1. 在处理异步操作和状态更新时，要注意组件重新渲染的影响
2. 使用 `useCallback` 稳定事件处理器引用
3. 在开发时添加详细的日志有助于快速定位问题
4. 检查 Network 标签页可以确认请求是否发出

---

## 环境变量配置

### 必需的环境变量

在 Vercel Dashboard 中配置这些（Settings > Environment Variables）：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=你的_supabase_项目_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_supabase_匿名密钥

# OpenRouter API 配置
OPENROUTER_API_KEY=你的_openrouter_api密钥
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=google/gemini-2.5-flash-image

# 站点配置
NEXT_PUBLIC_SITE_URL=https://你的项目.vercel.app
SITE_NAME=Banana Editor
```

### 如何获取这些值

**Supabase：**
1. 访问 https://supabase.com/
2. 创建项目
3. 导航到 Project Settings > API
4. 复制：
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**OpenRouter：**
1. 访问 https://openrouter.ai/
2. 注册并获取 API 密钥
3. 复制 API 密钥 → `OPENROUTER_API_KEY`

**NEXT_PUBLIC_SITE_URL：**
- 部署后，Vercel 会提供域名
- 格式：`https://your-project-name.vercel.app`

---

## 最佳实践

### 1. 服务器组件中的错误处理

始终用 try-catch 块包装 Supabase 客户端创建：

```typescript
try {
  const supabase = await createClient()
  // 使用 supabase
} catch (error) {
  // 优雅地处理
  console.warn('Supabase error:', error)
}
```

### 2. 开发与生产环境日志记录

只在开发模式下记录详细错误：

```typescript
const isDevelopment = process.env.NODE_ENV === 'development'

if (isDevelopment) {
  console.error('[Supabase Client] Missing environment variables')
}
```

### 3. 环境变量验证

在使用前验证环境变量：

```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}
```

### 4. 构建时注意事项

- 服务器组件在构建时运行
- 浏览器专用 API（window、document）不可用
- 环境变量在预渲染时可能未设置
- 始终优雅地处理缺失的数据

### 5. Vercel 配置

保持 `vercel.json` 最小化：
- 只包含构建设置
- 不要定义环境变量
- 在 Vercel Dashboard 中配置环境变量

### 6. 事件处理器稳定性

使用 `useCallback` 稳定事件处理器引用：

```typescript
const handleClick = useCallback(() => {
  // 处理逻辑
}, [])
```

---

## 部署检查清单

部署到 Vercel 之前：

- [ ] 所有环境变量都在 Vercel Dashboard 中设置
- [ ] 服务器组件有处理缺失环境变量的错误处理
- [ ] 服务器组件中没有浏览器专用 API
- [ ] `vercel.json` 有效（没有 `env` 字段）
- [ ] 本地构建成功：`npm run build`
- [ ] 数据库迁移已应用（如果使用 Supabase）
- [ ] API 密钥有效且有正确权限
- [ ] 事件处理器使用 `useCallback` 稳定引用

---

## 调试技巧

### 检查构建日志

1. 进入 Vercel Dashboard
2. 选择你的项目
3. 点击失败的部署
4. 查看构建日志中的具体错误

### 本地构建测试

推送前始终在本地测试：

```bash
npm run build
```

如果本地构建失败，Vercel 构建也会失败。

### 启用详细日志

在构建时获取更详细的错误消息：

```bash
NODE_ENV=development npm run build
```

### 检查环境变量

验证环境变量设置正确：

```bash
# 在 Next.js 中
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
```

### 使用浏览器开发者工具

1. 打开开发者工具（F12）
2. 查看 Console 标签页的错误
3. 查看 Network 标签页的请求
4. 检查 Application 标签页的 Cookie 和存储

### 添加调试日志

在关键位置添加日志：

```typescript
console.log('[Component Name] Function called')
console.log('[Component Name] Data:', data)
console.error('[Component Name] Error:', error)
```

---

## 常见 Next.js 构建错误

### 类型错误

如果在构建时看到 TypeScript 错误：

1. 检查 `next.config.mjs` 中的 `typescript.ignoreBuildErrors`
2. 修复代码中的类型错误
3. 运行 `npm run lint` 尽早发现问题

### 导入错误

确保所有导入正确：
- 使用绝对导入：`@/components/button`
- 检查文件扩展名：`.ts`、`.tsx`、`.js`、`.jsx`
- 验证 `tsconfig.json` 中的模块路径

### 静态导出问题

如果使用 `output: 'export'`：
- 不能使用 `getServerSideProps`
- 改用 `getStaticProps`
- 确保所有页面都可以静态生成

### 事件处理器问题

如果按钮点击没有响应：
1. 检查事件处理器是否正确绑定
2. 使用 `useCallback` 稳定函数引用
3. 添加日志确认事件是否触发
4. 检查 Network 标签页确认请求是否发出

---

## 快速参考

### 有用的命令

```bash
# 本地构建
npm run build

# 启动生产服务器
npm start

# 检查 linting 错误
npm run lint

# 类型检查
npx tsc --noEmit
```

### 文件位置

- 环境配置：`.env.local`（本地），Vercel Dashboard（生产）
- 构建配置：`next.config.mjs`
- Vercel 配置：`vercel.json`
- TypeScript 配置：`tsconfig.json`

### 需要检查的关键文件

- `lib/supabase-server.ts` - Supabase 客户端创建
- `middleware.ts` - 路由保护
- `vercel.json` - Vercel 配置
- `.env.local` - 本地环境变量
- `components/google-login-button.tsx` - Google 登录按钮
- `components/auth-button.tsx` - 认证按钮

---

## 额外资源

- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Vercel 文档](https://vercel.com/docs)
- [Supabase 与 Next.js](https://supabase.com/docs/guides/with-nextjs)
- [Next.js 中的环境变量](https://nextjs.org/docs/basic-features/environment-variables)
- [React useCallback 文档](https://react.dev/reference/react/useCallback)

---

## 总结

本次排故会话的关键要点：

1. **始终优雅地处理缺失的环境变量** - 构建时预渲染可能无法访问所有环境变量
2. **在 Vercel Dashboard 中配置环境变量** - 不要在 `vercel.json` 中定义
3. **为服务器组件添加错误处理** - 在 Supabase 客户端创建周围使用 try-catch 块
4. **推送前在本地测试构建** - 运行 `npm run build` 尽早发现问题
5. **保持配置最小化** - 只在 `vercel.json` 中包含必要的设置
6. **使用 useCallback 稳定事件处理器** - 避免组件重新渲染时事件处理器丢失
7. **添加详细的调试日志** - 有助于快速定位问题
8. **使用浏览器开发者工具** - 检查 Console、Network 和 Application 标签页

遵循这些实践将有助于确保顺利部署到 Vercel 并避免常见问题。
