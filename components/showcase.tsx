import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const showcaseItems = [
  {
    title: "Ultra-Fast Mountain Generation",
    description: "Created in 0.8 seconds with optimized neural engine",
    image: "/mountain-landscape.png",
  },
  {
    title: "Instant Garden Creation",
    description: "Complex scene rendered in milliseconds using AI technology",
    image: "/beautiful-lush-garden-with-colorful-flowers.jpg",
  },
  {
    title: "Real-time Beach Synthesis",
    description: "Delivers photorealistic results at lightning speed",
    image: "/tropical-beach-with-turquoise-water-and-palm-trees.jpg",
  },
  {
    title: "Rapid Aurora Generation",
    description: "Advanced effects processed instantly with AI",
    image: "/northern-lights-aurora-borealis-over-snowy-landsca.jpg",
  },
]

export function Showcase() {
  return (
    <section id="showcase" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            Lightning-Fast AI Creations <span className="text-5xl">🍌</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            See what Banana Editor generates in milliseconds
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {showcaseItems.map((item, index) => (
            <Card key={index} className="group overflow-hidden transition-all hover:shadow-xl">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Badge className="absolute left-4 top-4 gap-1 bg-primary">
                  <span>🍌</span>
                  Banana Speed
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
