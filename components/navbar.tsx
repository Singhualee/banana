import Link from 'next/link'
import { AuthButton } from '@/components/auth-button'
import { Button } from '@/components/ui/button'
import { Image as ImageIcon } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <ImageIcon className="h-6 w-6" />
            <span className="font-bold text-xl">Banana Editor</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              登录
            </Button>
          </Link>
          <AuthButton />
        </div>
      </div>
    </nav>
  )
}
