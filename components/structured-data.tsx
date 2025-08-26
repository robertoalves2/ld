export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://liturgiadiaria.top/oficio",
    name: "Ofício Divino - Liturgia das Horas Online",
    description:
      "Acompanhe o Ofício Divino e a Liturgia das Horas diariamente. Orações católicas, leituras espirituais e reflexões para fortalecer sua fé.",
    url: "https://liturgiadiaria.top/oficio",
    inLanguage: "pt-BR",
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://liturgiadiaria.top",
      name: "Liturgia Diária",
      url: "https://liturgiadiaria.top",
      description: "Portal católico com liturgia diária, evangelho do dia e recursos espirituais",
      publisher: {
        "@type": "Organization",
        name: "Liturgia Diária",
        url: "https://liturgiadiaria.top",
        logo: {
          "@type": "ImageObject",
          url: "https://liturgiadiaria.top/liturgia-icon.webp",
          width: 512,
          height: 512,
        },
      },
    },
    mainEntity: {
      "@type": "Article",
      headline: "Ofício Divino - Liturgia das Horas",
      description: "Orações diárias do Ofício Divino e da Liturgia das Horas da Igreja Católica",
      author: {
        "@type": "Organization",
        name: "Liturgia Diária",
      },
      publisher: {
        "@type": "Organization",
        name: "Liturgia Diária",
        logo: {
          "@type": "ImageObject",
          url: "https://liturgiadiaria.top/liturgia-icon.webp",
        },
      },
      dateModified: new Date().toISOString(),
      datePublished: "2025-01-01T00:00:00Z",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Início",
          item: "https://liturgiadiaria.top",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Ofício Divino",
          item: "https://liturgiadiaria.top/oficio",
        },
      ],
    },
    potentialAction: {
      "@type": "ReadAction",
      target: "https://liturgiadiaria.top/oficio",
    },
    about: [
      {
        "@type": "Thing",
        name: "Ofício Divino",
        description: "Oração oficial da Igreja Católica",
      },
      {
        "@type": "Thing",
        name: "Liturgia das Horas",
        description: "Ciclo diário de orações católicas",
      },
      {
        "@type": "Thing",
        name: "Breviário",
        description: "Livro de orações litúrgicas",
      },
    ],
    keywords:
      "ofício divino, liturgia das horas, orações católicas, breviário, laudes, vésperas, completas, igreja católica",
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}
