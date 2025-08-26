export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ofício Divino",
    description:
      "Acompanhe diariamente o Ofício Divino e a Liturgia das Horas. Orações, leituras e reflexões para sua vida espiritual.",
    url: "/",
    inLanguage: "pt-BR",
    publisher: {
      "@type": "Organization",
      name: "Liturgia Diária",
    },
    potentialAction: {
      "@type": "ReadAction",
      target: "/",
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}
