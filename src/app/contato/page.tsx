import type { Metadata } from "next"
import ContactHero from "@/components/ContactHero"
import ContactForm from "@/components/ContactForm"

export const metadata: Metadata = {
  title: "Contato | VivAir Travel Design",
  description:
    "Conte-nos seu porquê. Criamos Whycations sob medida para transformar sonhos em memórias eternas.",
  openGraph: {
    title: "Contato | VivAir Travel Design",
    description: "Conte-nos seu porquê. Criamos Whycations sob medida.",
    url: "https://vivairtravel.com.br/contato",
    siteName: "VivAir Travel Design",
    type: "website",
  },
}

export default function ContatoPage() {
  return (
    <main>
      <ContactHero />
      <ContactForm />
    </main>
  )
}
