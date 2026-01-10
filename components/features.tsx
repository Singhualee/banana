import { Sparkles, Users, Mountain, Zap, Images, Wand2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Sparkles,
    title: "Natural Language Editing",
    description: "Edit images using simple text prompts. Our AI understands complex instructions like GPT for images.",
  },
  {
    icon: Users,
    title: "Character Consistency",
    description: "Maintain perfect character details across edits. Excels at preserving faces and identities.",
  },
  {
    icon: Mountain,
    title: "Scene Preservation",
    description: "Seamlessly blend edits with original backgrounds. Superior scene fusion and natural integration.",
  },
  {
    icon: Zap,
    title: "One-Shot Editing",
    description: "Perfect results in a single attempt. Solves one-shot image editing challenges effortlessly.",
  },
  {
    icon: Images,
    title: "Multi-Image Context",
    description: "Process multiple images simultaneously. Support for advanced multi-image editing workflows.",
  },
  {
    icon: Wand2,
    title: "AI UGC Creation",
    description: "Create consistent AI influencers and UGC content. Perfect for social media and marketing.",
  },
]

export function Features() {
  return (
    <section id="features" className="bg-secondary/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Core Features</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Why Choose Banana Editor? The most advanced AI image editor with natural language understanding
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="border-2 transition-all hover:border-primary hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/20">
                    <Icon className="size-6 text-primary-foreground" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
