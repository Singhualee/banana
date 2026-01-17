import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">1. Information We Collect</h2>
              <p className="mb-2">We collect information you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Email address and name (when you sign up with Google)</li>
                <li>Images you upload for editing</li>
                <li>Usage data and preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">2. How We Use Your Information</h2>
              <p className="mb-2">We use the collected information to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide and improve our AI image editing services</li>
                <li>Process your image editing requests</li>
                <li>Communicate with you about your account</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">3. Data Storage and Security</h2>
              <p className="mb-2">Your images and personal information are stored securely using industry-standard encryption and security measures. We retain your data only as long as necessary to provide our services and as required by law.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">4. Third-Party Services</h2>
              <p className="mb-2">We use the following third-party services:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Google OAuth</strong> - for user authentication</li>
                <li><strong>OpenRouter</strong> - for AI image processing</li>
                <li><strong>Supabase</strong> - for database and authentication</li>
              </ul>
              <p className="mt-2">These services have their own privacy policies, and we encourage you to review them.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">5. Your Rights</h2>
              <p className="mb-2">You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Access your personal information</li>
                <li>Request deletion of your data</li>
                <li>Opt out of marketing communications</li>
                <li>Export your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">6. Cookies</h2>
              <p>We use cookies and similar technologies to improve your experience, analyze usage, and assist in our marketing efforts. You can control cookie settings through your browser preferences.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">7. Changes to This Policy</h2>
              <p>We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">8. Contact Us</h2>
              <p>If you have questions about this privacy policy or our data practices, please contact us at:</p>
              <p className="mt-2 font-semibold text-foreground">zimu@nanobanana2026.online</p>
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