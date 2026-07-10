import { MessageCircle } from "lucide-react"

const WHATSAPP_URL = "https://wa.me/557398074737"

export function WhatsappFloatButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco no WhatsApp"
      title="Fale conosco no WhatsApp"
      className="bg-success text-success-foreground fixed right-5 bottom-5 z-40 flex size-14 items-center justify-center rounded-full border border-success-foreground/15 shadow-lg shadow-success/25 transition hover:scale-105 hover:bg-success/90 hover:shadow-xl hover:shadow-success/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none sm:right-6 sm:bottom-6"
    >
      <MessageCircle className="size-7" strokeWidth={1.75} />
    </a>
  )
}
