import { Hero } from "@/components/hero-server"
import { Features } from "@/components/features"
import { Showcase } from "@/components/showcase"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Showcase />
      <FAQ />
      <Footer />
    </main>
  )
}
