import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is Banana Editor?",
    answer:
      "It's a revolutionary AI image editing tool that transforms photos using natural language prompts. This is currently one of the most powerful image editing models available, with exceptional consistency and superior performance for character editing and scene preservation.",
  },
  {
    question: "How does it work?",
    answer:
      'Simply upload an image and describe your desired edits in natural language. The AI understands complex instructions like "place the subject in a snowy mountain" or "change the background to a beach". It processes your text prompt and generates perfectly edited images.',
  },
  {
    question: "What makes it different from other AI editors?",
    answer:
      "Our model excels in character consistency, scene blending, and one-shot editing. Users report it significantly outperforms other tools in preserving facial features and seamlessly integrating edits with backgrounds. It also supports multi-image context for consistent AI content creation.",
  },
  {
    question: "Can I use it for commercial projects?",
    answer:
      "Yes! It's perfect for creating AI UGC content, social media campaigns, and marketing materials. Many users leverage it for creating consistent AI influencers and product photography. The high-quality outputs are suitable for professional use.",
  },
  {
    question: "What types of edits can it handle?",
    answer:
      "The editor handles complex edits including face completion, background changes, object placement, style transfers, and character modifications. It excels at understanding contextual instructions while maintaining photorealistic quality.",
  },
  {
    question: "How fast is the processing?",
    answer:
      "Our optimized neural engine delivers results in milliseconds to seconds. Most edits complete in under 2 seconds, making it one of the fastest AI image editors available while maintaining exceptional quality.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Frequently Asked Questions</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Everything you need to know about Banana Editor
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-semibold">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
