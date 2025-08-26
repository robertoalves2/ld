import { Suspense } from "react"
import FeedAccordion from "@/components/feed-accordion"
import Footer from "@/components/footer"
import StructuredData from "@/components/structured-data"
import type { Metadata } from "next"

// Metadados otimizados para SEO
export const metadata: Metadata = {
  title: "Ofício Divino - Liturgia das Horas Online | Liturgia Diária",
  description:
    "Acompanhe o Ofício Divino e a Liturgia das Horas diariamente. Orações católicas, leituras espirituais e reflexões para fortalecer sua fé. Acesso gratuito e atualizado diariamente.",
  keywords:
    "ofício divino, liturgia das horas, orações católicas, liturgia diária, breviário, laudes, vésperas, completas, terça, sexta, nona, leituras espirituais, oração católica, igreja católica, espiritualidade, vida religiosa",
  authors: [{ name: "Liturgia Diária", url: "https://liturgiadiaria.top" }],
  creator: "Liturgia Diária",
  publisher: "Liturgia Diária",
  robots: "index, follow",
  alternates: {
    canonical: "https://liturgiadiaria.top/oficio",
  },
  openGraph: {
    title: "Ofício Divino - Liturgia das Horas Online",
    description:
      "Acompanhe o Ofício Divino e a Liturgia das Horas diariamente. Orações católicas e leituras espirituais para fortalecer sua fé.",
    type: "website",
    locale: "pt_BR",
    url: "https://liturgiadiaria.top/oficio",
    siteName: "Liturgia Diária",
    images: [
      {
        url: "/liturgia-icon.webp",
        width: 1200,
        height: 630,
        alt: "Ofício Divino - Liturgia das Horas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ofício Divino - Liturgia das Horas Online",
    description:
      "Acompanhe o Ofício Divino e a Liturgia das Horas diariamente. Orações católicas e leituras espirituais.",
    images: ["/liturgia-icon.webp"],
    creator: "@liturgiadiaria",
  },
  verification: {
    google: "google-site-verification-code",
  },
}

// Define a interface para a estrutura de cada postagem
interface Post {
  title: string
  pubDate: string
  content: string
}

/**
 * Função para extrair texto entre tags XML
 */
function extractTextBetweenTags(xml: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i")
  const match = xml.match(regex)
  return match ? match[1].trim() : ""
}

/**
 * Função para extrair CDATA
 */
function extractCDATA(text: string): string {
  const cdataRegex = /<!\[CDATA\[([\s\S]*?)\]\]>/
  const match = text.match(cdataRegex)
  return match ? match[1] : text
}

/**
 * Função para decodificar entidades HTML
 */
function decodeHtmlEntities(text: string): string {
  const entities: { [key: string]: string } = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#039;": "'",
    "&apos;": "'",
    "&#8211;": "–",
    "&#8212;": "—",
    "&#8216;": "'",
    "&#8217;": "'",
    "&#8220;": '"',
    "&#8221;": '"',
    "&#8230;": "…",
  }

  return text.replace(/&[#\w]+;/g, (entity) => entities[entity] || entity)
}

/**
 * Função para buscar e analisar os dados do feed RSS usando parsing manual
 */
async function getFeedData(): Promise<{ posts: Post[]; error?: string; debugInfo?: any }> {
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    feedUrl: "https://liturgiadashoras.online/feed/",
    steps: [],
  }

  try {
    debugInfo.steps.push("Iniciando fetch do RSS...")

    const response = await fetch("https://liturgiadashoras.online/feed/", {
      next: { revalidate: 3600 },
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LiturgiaBot/1.0)",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
    })

    debugInfo.steps.push(`Response status: ${response.status} ${response.statusText}`)
    debugInfo.responseHeaders = Object.fromEntries(response.headers.entries())

    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status} - ${response.statusText}`)
    }

    const xmlText = await response.text()
    debugInfo.steps.push(`XML recebido, tamanho: ${xmlText.length} caracteres`)
    debugInfo.xmlPreview = xmlText.substring(0, 500) + "..."

    // Parsing manual do XML usando regex
    debugInfo.steps.push("Iniciando parsing manual do XML...")

    // Extrair todos os items do feed
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi
    const items = []
    let match

    while ((match = itemRegex.exec(xmlText)) !== null) {
      items.push(match[1])
    }

    debugInfo.steps.push(`Encontrados ${items.length} items no feed`)

    let posts: Post[] = items.map((itemXml, index) => {
      // Extrair título
      let title = extractTextBetweenTags(itemXml, "title")
      title = decodeHtmlEntities(title) || `Título Indisponível ${index + 1}`

      // Extrair data de publicação
      let pubDate = extractTextBetweenTags(itemXml, "pubDate")
      if (!pubDate) {
        pubDate = new Date().toISOString()
      }

      // Extrair conteúdo (priorizar content:encoded, depois description)
      let content = extractTextBetweenTags(itemXml, "content:encoded")
      if (!content) {
        content = extractTextBetweenTags(itemXml, "description")
      }

      // Limpar CDATA se presente
      content = extractCDATA(content)
      content = decodeHtmlEntities(content) || "Conteúdo Indisponível"

      return { title, pubDate, content }
    })

    debugInfo.steps.push(`Posts processados: ${posts.length}`)
    debugInfo.postTitles = posts.slice(0, 5).map((p) => p.title)

    // Ordena as postagens pela data de publicação, da mais recente para a mais antiga
    posts.sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime()
      const dateB = new Date(b.pubDate).getTime()
      return dateB - dateA
    })
    debugInfo.steps.push("Posts ordenados por data")

    // Nova lógica de filtragem
    const targetTitle = "Ofício das Leituras"
    let cutoffIndex = -1

    for (let i = 0; i < posts.length; i++) {
      if (posts[i].title.includes(targetTitle)) {
        cutoffIndex = i
        break
      }
    }

    debugInfo.steps.push(`Procurando por "${targetTitle}", encontrado no índice: ${cutoffIndex}`)

    if (cutoffIndex !== -1) {
      posts = posts.slice(0, cutoffIndex + 1)
      debugInfo.steps.push(`Posts filtrados: ${posts.length}`)
    }

    debugInfo.steps.push("Processamento concluído com sucesso")
    return { posts, debugInfo }
  } catch (error) {
    console.error("Falha ao buscar ou analisar o feed:", error)
    debugInfo.steps.push(`ERRO: ${error instanceof Error ? error.message : "Erro desconhecido"}`)
    debugInfo.error = error instanceof Error ? error.message : "Erro desconhecido"

    return {
      posts: [],
      error: error instanceof Error ? error.message : "Erro desconhecido",
      debugInfo,
    }
  }
}

/**
 * Componente principal da página.
 */
export default async function OficioPage() {
  const { posts, error, debugInfo } = await getFeedData()

  return (
    <>
      <StructuredData />
      <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12 bg-gray-50">
        <div className="w-full max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
              Ofício Divino - Liturgia das Horas
            </h1>
            <p className="text-lg text-center text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Acompanhe diariamente as orações do Ofício Divino - Liturgia das Horas. Fortaleça sua vida espiritual com
              as orações oficiais da Igreja Católica.
            </p>
          </header>

          {/* Debug Info - Visível apenas em desenvolvimento ou quando há erro */}
          {(error || process.env.NODE_ENV === "development") && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <details className="cursor-pointer">
                <summary className="font-semibold text-yellow-800 mb-2">
                  🔍 Informações de Debug {error && "(ERRO DETECTADO)"}
                </summary>
                <div className="text-sm space-y-2">
                  <div>
                    <strong>Timestamp:</strong> {debugInfo?.timestamp}
                  </div>
                  <div>
                    <strong>Feed URL:</strong> {debugInfo?.feedUrl}
                  </div>
                  <div>
                    <strong>Posts encontrados:</strong> {posts.length}
                  </div>

                  {error && (
                    <div className="p-2 bg-red-100 border border-red-300 rounded">
                      <strong className="text-red-800">Erro:</strong> {error}
                    </div>
                  )}

                  <div>
                    <strong>Passos do processamento:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1">
                      {debugInfo?.steps?.map((step: string, index: number) => (
                        <li key={index} className={step.includes("ERRO") ? "text-red-600" : ""}>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {debugInfo?.postTitles && (
                    <div>
                      <strong>Primeiros títulos encontrados:</strong>
                      <ul className="list-disc list-inside ml-4 mt-1">
                        {debugInfo.postTitles.map((title: string, index: number) => (
                          <li key={index}>{title}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {debugInfo?.responseHeaders && (
                    <div>
                      <strong>Headers da resposta:</strong>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                        {JSON.stringify(debugInfo.responseHeaders, null, 2)}
                      </pre>
                    </div>
                  )}

                  {debugInfo?.xmlPreview && (
                    <div>
                      <strong>Preview do XML:</strong>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">{debugInfo.xmlPreview}</pre>
                    </div>
                  )}
                </div>
              </details>
            </div>
          )}

          <Suspense fallback={<div className="text-center text-gray-600 py-8">Carregando orações...</div>}>
            <FeedAccordion posts={posts} error={error} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
