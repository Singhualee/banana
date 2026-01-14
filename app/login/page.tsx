import { GoogleLoginButton } from '@/components/google-login-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <span className="text-6xl">🍌</span>
          </div>
          <CardTitle className="text-2xl">Welcome to Banana Editor</CardTitle>
          <CardDescription>
            Sign in with your Google account to start editing images
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <GoogleLoginButton />
        </CardContent>
      </Card>
    </div>
  )
}
