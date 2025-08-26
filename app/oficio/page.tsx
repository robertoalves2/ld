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
async function getFeedData(): Promise<Post[]> {
  try {
    // Faz a requisição ao feed RSS.
    // A opção `next: { revalidate: 3600 }` instrui o Next.js a revalidar os dados a cada hora,
    // garantindo que o conteúdo esteja sempre atualizado sem precisar de um redeploy.
    const response = await fetch("https://liturgiadashoras.online/feed/", {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`)
    }

    const xmlText = await response.text()

    // DOMParser é uma API de navegador. No ambiente Next.js, que roda inteiramente no navegador,
    // ela está disponível mesmo em Server Components.
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, "text/xml")

    const items = xmlDoc.querySelectorAll("item")
    let posts: Post[] = Array.from(items).map((item) => {
      const titleElement = item.querySelector("title")
      const pubDateElement = item.querySelector("pubDate")
      // Para elementos com namespace como 'content:encoded', usamos getElementsByTagNameNS.
      // O primeiro argumento é o URI do namespace e o segundo é o nome local do elemento.
      const contentEncodedElement = item.getElementsByTagNameNS(
        "http://purl.org/rss/1.0/modules/content/",
        "encoded",
      )[0]
      const descriptionElement = item.querySelector("description") // Fallback para 'description' se 'content:encoded' não estiver presente

      const title = titleElement?.textContent || "Título Indisponível"
      const pubDate = pubDateElement?.textContent || new Date().toISOString()
      const content = contentEncodedElement?.textContent || descriptionElement?.textContent || "Conteúdo Indisponível"

      return { title, pubDate, content }
    })

    // Ordena as postagens pela data de publicação, da mais recente para a mais antiga.
    posts.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

    // --- Nova lógica de filtragem ---
    const targetTitle = "Ofício das Leituras"
    let cutoffIndex = -1

    for (let i = 0; i < posts.length; i++) {
      if (posts[i].title.includes(targetTitle)) {
        cutoffIndex = i
        break
      }
    }

    if (cutoffIndex !== -1) {
      // Inclui todas as postagens até e incluindo a postagem alvo.
      posts = posts.slice(0, cutoffIndex + 1)
    }
    // Se cutoffIndex permanecer -1, significa que "Ofício das Leituras" não foi encontrado,
    // então o array 'posts' original (já ordenado) será retornado, mostrando todas as postagens.
    // --- Fim da nova lógica de filtragem ---

    return posts
  } catch (error) {
    console.error("Falha ao buscar ou analisar o feed:", error)
    return [] // Retorna um array vazio em caso de erro
  }
}

/**
 * Componente principal da página.
 * Ele busca os dados do feed e os passa para o componente FeedAccordion.
 */
export default async function OficioPage() {
  const posts = await getFeedData()

  return (
    <>
      <StructuredData />
      <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12 bg-gray-50">
        <div className="w-full max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800">Ofício Divino</h1>
          </header>

          {/* Suspense é usado para exibir um fallback enquanto o componente cliente é hidratado. */}
          <Suspense fallback={<div className="text-center text-gray-600 py-8">Carregando posts...</div>}>
            <FeedAccordion posts={posts} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
