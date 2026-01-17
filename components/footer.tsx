export function Footer() {
  return (
    <footer className="border-t bg-secondary/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2 text-2xl font-bold">
              <span className="text-3xl">🍌</span>
              Banana Editor
            </div>
            <p className="text-sm text-muted-foreground">
              Transform any image with simple text prompts. Advanced AI-powered image editing.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/#features" className="transition-colors hover:text-foreground">
                  Features
                </a>
              </li>
              <li>
                <a href="/pricing" className="transition-colors hover:text-foreground">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/#faq" className="transition-colors hover:text-foreground">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/#about" className="transition-colors hover:text-foreground">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="transition-colors hover:text-foreground">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/privacy-policy" className="transition-colors hover:text-foreground">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-of-service" className="transition-colors hover:text-foreground">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Banana Editor. All rights reserved. Made with 🍌</p>
        </div>
      </div>
    </footer>
  )
}
