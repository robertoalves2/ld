export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ofício Divino - Liturgia das Horas",
    description:
      "Acompanhe diariamente o Ofício Divino e a Liturgia das Horas. Orações, leituras e reflexões para sua vida espiritual católica.",
    url: "https://liturgiadiaria.top/oficio",
    inLanguage: "pt-BR",
    publisher: {
      "@type": "Organization",
      name: "Liturgia Diária",
      url: "https://liturgiadiaria.top",
    },
    potentialAction: {
      "@type": "ReadAction",
      target: "https://liturgiadiaria.top/oficio",
    },
    mainEntity: {
      "@type": "WebPage",
      "@id": "https://liturgiadiaria.top/oficio",
      name: "Ofício Divino",
      description: "Liturgia das Horas diária com orações e leituras católicas",
      isPartOf: {
        "@type": "WebSite",
        name: "Liturgia Diária",
        url: "https://liturgiadiaria.top",
      },
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}
