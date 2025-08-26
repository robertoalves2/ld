import { Suspense } from "react"
import FeedAccordion from "@/components/feed-accordion"
import Footer from "@/components/footer"
import StructuredData from "@/components/structured-data"

// Define a interface para a estrutura de cada postagem
interface Post {
  title: string
  pubDate: string
  content: string
}

/**
 * Função para buscar e analisar os dados do feed RSS.
 * Esta função é executada no servidor (ou ambiente similar ao servidor no Next.js).
 * @returns Uma Promise que resolve para um array de objetos Post.
 */
async function getFeedData(): Promise<{ posts: Post[]; error?: string; debugInfo?: any }> {
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    feedUrl: "https://liturgiadashoras.online/feed/",
    steps: [],
  }

  try {
    debugInfo.steps.push("Iniciando fetch do RSS...")

    // Faz a requisição ao feed RSS.
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

    // Verificar se DOMParser está disponível
    if (typeof DOMParser === "undefined") {
      throw new Error("DOMParser não está disponível no ambiente atual")
    }

    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, "text/xml")

    // Verificar se houve erro no parsing
    const parserError = xmlDoc.querySelector("parsererror")
    if (parserError) {
      throw new Error(`Erro no parsing XML: ${parserError.textContent}`)
    }

    const items = xmlDoc.querySelectorAll("item")
    debugInfo.steps.push(`Encontrados ${items.length} items no feed`)

    let posts: Post[] = Array.from(items).map((item, index) => {
      const titleElement = item.querySelector("title")
      const pubDateElement = item.querySelector("pubDate")
      const contentEncodedElement = item.getElementsByTagNameNS(
        "http://purl.org/rss/1.0/modules/content/",
        "encoded",
      )[0]
      const descriptionElement = item.querySelector("description")

      const title = titleElement?.textContent || `Título Indisponível ${index + 1}`
      const pubDate = pubDateElement?.textContent || new Date().toISOString()
      const content = contentEncodedElement?.textContent || descriptionElement?.textContent || "Conteúdo Indisponível"

      return { title, pubDate, content }
    })

    debugInfo.steps.push(`Posts processados: ${posts.length}`)
    debugInfo.postTitles = posts.slice(0, 5).map((p) => p.title)

    // Ordena as postagens pela data de publicação, da mais recente para a mais antiga.
    posts.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
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
            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800">Ofício Divino</h1>
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

          {/* Status da conexão */}
          <div className="mb-4 text-center">
            {error ? (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                ❌ Erro ao carregar feed
              </div>
            ) : posts.length > 0 ? (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                ✅ Feed carregado com sucesso ({posts.length} posts)
              </div>
            ) : (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                ⏳ Carregando...
              </div>
            )}
          </div>

          <Suspense fallback={<div className="text-center text-gray-600 py-8">Carregando posts...</div>}>
            <FeedAccordion posts={posts} error={error} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
