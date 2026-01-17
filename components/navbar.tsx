import Link from 'next/link'
import { AuthButton } from '@/components/auth-button'
import { GalleryHorizontalEnd } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🍌</span>
            <span className="font-bold text-xl">Banana Editor</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/gallery" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <GalleryHorizontalEnd className="h-4 w-4" />
            My Gallery
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Pricing
          </Link>
          <AuthButton />
        </div>
      </div>
    </nav>
  )
}
