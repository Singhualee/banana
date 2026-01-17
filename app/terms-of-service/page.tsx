import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">1. Acceptance of Terms</h2>
              <p>By accessing or using Banana Editor, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">2. Description of Service</h2>
              <p className="mb-2">Banana Editor is an AI-powered image editing service that allows users to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Upload images for AI-powered editing</li>
                <li>Apply various image enhancements and transformations</li>
                <li>Access different subscription tiers with varying features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">3. User Accounts</h2>
              <p className="mb-2">To use certain features, you must create an account. You agree to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">4. Acceptable Use Policy</h2>
              <p className="mb-2">You agree NOT to use the service to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Upload illegal, harmful, or inappropriate content</li>
                <li>Infringe on intellectual property rights</li>
                <li>Generate deepfakes or misleading content</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Attempt to reverse engineer or hack the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">5. Subscription and Payment</h2>
              <p className="mb-2">Our subscription plans include:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Free Plan</strong> - Limited daily edits with basic features</li>
                <li><strong>Pro Plan</strong> - Unlimited edits with advanced features ($9.99/month)</li>
                <li><strong>Business Plan</strong> - Team features and API access ($29.99/month)</li>
              </ul>
              <p className="mt-2">Payments are processed through Creem. By subscribing, you agree to Creem's terms and conditions.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">6. Intellectual Property</h2>
              <p className="mb-2">You retain ownership of:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Images you upload to the service</li>
                <li>Edited images generated from your uploads</li>
              </ul>
              <p className="mt-2">However, you grant us a license to use, store, and process your images solely to provide the service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">7. Disclaimer of Warranties</h2>
              <p>The service is provided "as is" without warranties of any kind. We do not guarantee:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Uninterrupted or error-free operation</li>
                <li>That defects will be corrected</li>
                <li>The accuracy or reliability of AI-generated content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">8. Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">9. Termination</h2>
              <p className="mb-2">We reserve the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Suspend or terminate your account for violation of these terms</li>
                <li>Discontinue the service with or without notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">10. Changes to Terms</h2>
              <p>We may modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">11. Contact Information</h2>
              <p className="mb-2">For questions about these Terms of Service, please contact us at:</p>
              <p className="font-semibold text-foreground">zimu@nanobanana2026.online</p>
            </section>

            <section className="pt-4 border-t">
              <p className="text-sm">Last Updated: January 17, 2026</p>
            </section>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}