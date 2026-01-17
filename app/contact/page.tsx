import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Mail, MessageSquare } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">Get in Touch</h2>
              <p className="mb-4">We'd love to hear from you! Whether you have questions, feedback, or need support, our team is here to help.</p>
            </section>

            <section className="bg-secondary/20 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Support
              </h2>
              <p className="mb-2">For general inquiries, technical support, or partnership opportunities:</p>
              <a 
                href="mailto:zimu@nanobanana2026.online" 
                className="text-lg font-semibold text-primary hover:underline"
              >
                zimu@nanobanana2026.online
              </a>
              <p className="mt-3 text-sm">We typically respond within 24-48 hours on business days.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Common Topics
              </h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-semibold">•</span>
                  <span>Account and billing issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-semibold">•</span>
                  <span>Technical support and feature requests</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-semibold">•</span>
                  <span>Partnership and collaboration inquiries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-semibold">•</span>
                  <span>Privacy policy and terms of service questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-semibold">•</span>
                  <span>Report bugs or issues</span>
                </li>
              </ul>
            </section>

            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-3 text-foreground">Response Time</h2>
              <p>We strive to respond to all inquiries as quickly as possible:</p>
              <ul className="mt-2 space-y-1">
                <li>• General inquiries: 24-48 hours</li>
                <li>• Technical support: 24-72 hours</li>
                <li>• Billing issues: 24-48 hours</li>
              </ul>
            </section>

            <section className="bg-primary/10 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-3 text-foreground">Tips for Faster Response</h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-semibold">✓</span>
                  <span>Include your account email in all communications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-semibold">✓</span>
                  <span>Provide detailed description of your issue</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-semibold">✓</span>
                  <span>Include screenshots if reporting a bug</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-semibold">✓</span>
                  <span>Check our FAQ section before contacting</span>
                </li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}