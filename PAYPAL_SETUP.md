# PayPal Payment Integration / PayPal 支付集成

## 概述

本应用集成了 PayPal 一次性支付功能，允许用户购买 20 次免费生图权限。

## 功能特性

- ✅ 一次性购买 20 次免费生图权限
- ✅ 未登录用户自动引导至登录页面
- ✅ 支付成功后自动增加用户积分
- ✅ 实时显示剩余积分
- ✅ 积分不足时提示购买

## 配置步骤

### 1. 获取 PayPal 凭证

1. 登录 [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. 创建应用或选择现有应用
3. 获取以下凭证：
   - Client ID
   - Client Secret
4. 在应用设置中配置 Webhook：
   - Webhook URL: `https://your-domain.com/api/paypal/webhook`
   - 选择事件类型：
     - `PAYMENT.CAPTURE.COMPLETED`
     - `PAYMENT.SALE.COMPLETED`
     - `PAYMENT.CAPTURE.DENIED`
     - `PAYMENT.SALE.DENIED`
     - `PAYMENT.CAPTURE.REFUNDED`
5. 记录 Webhook ID

### 2. 配置环境变量

在 `.env.local` 文件中添加以下配置：

```env
# PayPal Payment API Keys
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id_here
```

### 3. 配置 Supabase Service Role Key

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 进入项目设置 → API
3. 复制 `service_role` 密钥
4. 添加到 `.env.local`：

```env
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

⚠️ **重要**: Service Role Key 具有完全访问权限，请妥善保管，不要提交到版本控制系统。

### 4. 运行数据库迁移

在 Supabase SQL Editor 中执行以下迁移脚本：

```sql
-- 文件位置: supabase/migrations/20240117_create_user_credits_table.sql
```

或使用 Supabase CLI：

```bash
supabase db push
```

## API 端点

### PayPal Webhook
- **端点**: `POST /api/paypal/webhook`
- **功能**: 接收 PayPal 支付成功通知，自动增加用户积分
- **验证**: 使用 PayPal 签名验证确保请求合法性

### 用户积分管理
- **端点**: `GET /api/credits`
- **功能**: 获取当前用户积分信息

- **端点**: `POST /api/credits/manage`
- **功能**: 检查或扣减用户积分
- **参数**:
  ```json
  {
    "action": "check" | "deduct",
    "credits": 1  // 仅在 deduct 时需要
  }
  ```

## 使用流程

### 1. 用户购买积分

1. 用户访问 `/pricing` 页面
2. 点击"一次性购买"卡片中的"立即购买"按钮
3. 跳转至 PayPal 支付页面
4. 完成支付
5. PayPal 发送 webhook 通知到服务器
6. 服务器验证签名并增加 20 积分到用户账户

### 2. 使用积分生图

1. 用户上传图片并输入提示词
2. 系统检查用户积分
3. 如果积分充足，生成图片并扣减 1 积分
4. 如果积分不足，显示错误并引导至购买页面

### 3. 查看剩余积分

- 在导航栏点击积分图标查看详情
- 在图片上传器中显示剩余积分
- 积分为 0 时显示购买按钮

## 测试

### 测试模式

PayPal 提供测试环境，使用以下凭证进行测试：

- **测试环境 URL**: `https://api-m.sandbox.paypal.com`
- **测试买家账号**: 在 PayPal Developer Dashboard 创建

### 测试流程

1. 使用测试凭证配置环境变量
2. 访问 `/pricing` 页面
3. 点击购买按钮
4. 使用测试账号完成支付
5. 验证积分是否正确增加
6. 测试生图功能是否正常扣减积分

## 故障排除

### Webhook 验证失败

**问题**: PayPal webhook 返回 401 错误

**解决方案**:
1. 检查 `PAYPAL_WEBHOOK_ID` 是否正确
2. 确认 Webhook URL 在 PayPal 中正确配置
3. 验证 `PAYPAL_CLIENT_ID` 和 `PAYPAL_CLIENT_SECRET` 是否匹配

### 积分未增加

**问题**: 支付成功但积分未增加

**解决方案**:
1. 检查服务器日志查看 webhook 接收情况
2. 验证 Supabase Service Role Key 是否正确
3. 确认数据库迁移已成功执行
4. 检查 `custom` 字段中的 `user_id` 是否正确传递

### 积分检查失败

**问题**: 无法获取用户积分

**解决方案**:
1. 确认用户已登录
2. 检查 `user_credits` 表中是否存在该用户记录
3. 验证 RLS 策略是否正确配置

## 安全注意事项

- ⚠️ 永远不要将 `PAYPAL_CLIENT_SECRET` 或 `SUPABASE_SERVICE_ROLE_KEY` 提交到版本控制系统
- ⚠️ 在生产环境中使用 HTTPS
- ⚠️ 定期轮换 API 密钥
- ⚠️ 监控 webhook 日志以检测异常活动
- ⚠️ 实施速率限制以防止滥用

## 相关文件

- [app/api/paypal/webhook/route.ts](app/api/paypal/webhook/route.ts) - PayPal webhook 处理
- [app/api/credits/route.ts](app/api/credits/route.ts) - 获取用户积分
- [app/api/credits/manage/route.ts](app/api/credits/manage/route.ts) - 积分管理
- [hooks/use-user-credits.ts](hooks/use-user-credits.ts) - 积分管理 Hook
- [app/pricing/page.tsx](app/pricing/page.tsx) - 定价页面
- [components/image-uploader.tsx](components/image-uploader.tsx) - 图片上传器（集成积分检查）
- [components/auth-button.tsx](components/auth-button.tsx) - 认证按钮（显示积分）
- [supabase/migrations/20240117_create_user_credits_table.sql](supabase/migrations/20240117_create_user_credits_table.sql) - 数据库迁移

## 支持

如有问题，请查看：
- [PayPal API 文档](https://developer.paypal.com/docs/api/)
- [Supabase 文档](https://supabase.com/docs)
- 项目 GitHub Issues
