import { GoogleLoginButton } from '@/components/google-login-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <img src="/icon.svg" alt="Banana Editor" className="w-16 h-16 mx-auto" />
          </div>
          <CardTitle className="text-2xl">欢迎来到 Banana Editor</CardTitle>
          <CardDescription>
            使用 Google 账号登录以开始编辑图像
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <GoogleLoginButton />
          <div className="text-center text-sm text-muted-foreground">
            <Link href="/" className="hover:underline">
              返回首页
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
