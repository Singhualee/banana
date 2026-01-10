import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Digital Creator",
    content:
      "This editor completely changed my workflow. The character consistency is incredible - miles ahead of other tools!",
    avatar: "/professional-woman-headshot.png",
  },
  {
    name: "Marcus Johnson",
    role: "UGC Specialist",
    content:
      "Creating consistent AI influencers has never been easier. It maintains perfect face details across edits!",
    avatar: "/professional-man-headshot.png",
  },
  {
    name: "Emily Rodriguez",
    role: "Professional Editor",
    content: "One-shot editing is basically solved with this tool. The scene blending is so natural and realistic!",
    avatar: "/professional-woman-photographer.png",
  },
]

export function Testimonials() {
  return (
    <section className="bg-secondary/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">User Reviews</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">What creators are saying</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2 transition-all hover:border-primary hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-6 leading-relaxed text-muted-foreground">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="size-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
