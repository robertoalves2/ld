import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://liturgiadashoras.online/feed/", {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`)
    }

    const xmlText = await response.text()

    // Parse XML no servidor
    const { DOMParser } = await import("@xmldom/xmldom")
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, "text/xml")

    const items = xmlDoc.getElementsByTagName("item")
    let posts = Array.from(items).map((item) => {
      const titleElement = item.getElementsByTagName("title")[0]
      const pubDateElement = item.getElementsByTagName("pubDate")[0]
      const contentEncodedElement = item.getElementsByTagNameNS(
        "http://purl.org/rss/1.0/modules/content/",
        "encoded",
      )[0]
      const descriptionElement = item.getElementsByTagName("description")[0]

      const title = titleElement?.textContent || "Título Indisponível"
      const pubDate = pubDateElement?.textContent || new Date().toISOString()
      const content = contentEncodedElement?.textContent || descriptionElement?.textContent || "Conteúdo Indisponível"

      return { title, pubDate, content }
    })

    // Ordena as postagens pela data de publicação
    posts.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

    // Filtra até "Ofício das Leituras"
    const targetTitle = "Ofício das Leituras"
    let cutoffIndex = -1

    for (let i = 0; i < posts.length; i++) {
      if (posts[i].title.includes(targetTitle)) {
        cutoffIndex = i
        break
      }
    }

    if (cutoffIndex !== -1) {
      posts = posts.slice(0, cutoffIndex + 1)
    }

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Falha ao buscar ou analisar o feed:", error)
    return NextResponse.json([], { status: 500 })
  }
}
