import { XMLParser } from "fast-xml-parser"
import * as cheerio from "cheerio"
import { format, subDays, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"

const FEED_URL = "https://aliturgia.com/feed/"
const PROXY_URL = "https://api.allorigins.win/get?url="

interface FeedItem {
  title: string
  link: string
}

interface LectioContent {
  evangelhoTitle: string
  evangelhoReference: string
  sections: {
    title: string
    content: string
  }[]
}

// Helper to format verses with superscript numbers
export function formatVersesInHtml(htmlContent: string): string {
  // Use cheerio to parse the HTML and manipulate it
  const $ = cheerio.load(htmlContent)

  // Find all <p> tags and process their text content
  $("p").each((i, el) => {
    let text = $(el).html() || ""
    // Replace numbers followed by a space or start of line with superscript
    // This regex is more robust to avoid replacing numbers within words or references
    text = text.replace(/(^|\s)(\d+)([^\d]|$)/g, (match, p1, p2, p3) => {
      return `${p1}<sup class="verse-number">${p2}</sup>${p3}`
    })
    $(el).html(text)
  })

  // Remove any empty <p> tags that might result from processing
  $("p:empty").remove()

  return $.html()
}

export async function fetchLectioDivina(date: Date): Promise<LectioContent | null> {
  const formattedDate = format(date, "yyyy-MM-dd")
  const proxiedFeedUrl = PROXY_URL + encodeURIComponent(FEED_URL)

  try {
    // Fetch and cache the RSS feed for 24 hours
    const feedResponse = await fetch(proxiedFeedUrl, { next: { revalidate: 86400 } })
    if (!feedResponse.ok) {
      throw new Error(`Failed to fetch feed: ${feedResponse.statusText}`)
    }
    const feedData = await feedResponse.json()
    const parser = new XMLParser()
    const xml = parser.parse(feedData.contents)

    const posts: FeedItem[] = xml.rss.channel.item.map((item: any) => ({
      title: item.title,
      link: item.link,
    }))

    // Find the post for the selected date
    const targetTitle = format(date, "dd 'de' MMMM", { locale: ptBR })
    const targetPost = posts.find(
      (post) => post.title.includes(targetTitle) || post.title.includes(format(date, "dd/MM", { locale: ptBR })),
    )

    if (!targetPost) {
      console.warn(`No Lectio Divina post found for ${formattedDate}.`)
      return null
    }

    // Fetch and cache the individual post content for 24 hours
    const proxiedPostUrl = PROXY_URL + encodeURIComponent(targetPost.link)
    const postResponse = await fetch(proxiedPostUrl, { next: { revalidate: 86400 } })
    if (!postResponse.ok) {
      throw new Error(`Failed to fetch post content: ${postResponse.statusText}`)
    }
    const postData = await postResponse.json()

    const $ = cheerio.load(postData.contents)
    const article = $("article")

    if (!article.length) {
      throw new Error("<article> tag not found in post content.")
    }

    let evangelhoTitle = ""
    let evangelhoReference = ""
    const sections: { title: string; content: string }[] = []
    let currentSectionTitle = ""
    let currentSectionContent: string[] = []

    // Iterate through direct children of the article
    article.children().each((i, el) => {
      const tagName = el.tagName.toLowerCase()
      const textContent = $(el).text().trim()
      const htmlContent = $(el).html() || ""

      if (tagName === "h2" || tagName === "h3") {
        if (currentSectionTitle && currentSectionContent.length > 0) {
          sections.push({
            title: currentSectionTitle,
            content: formatVersesInHtml(currentSectionContent.join("")),
          })
          currentSectionContent = []
        }
        currentSectionTitle = textContent
      } else if (tagName === "p" || tagName === "strong") {
        if (textContent.toLowerCase().includes("evangelho")) {
          evangelhoTitle = textContent
          const match = textContent.match(/$$([^)]+)$$/)
          if (match && match[1]) {
            evangelhoReference = match[1]
          }
        } else if (
          !textContent.toLowerCase().includes("share:") &&
          !textContent.toLowerCase().includes("partilhar:") &&
          !textContent.toLowerCase().includes("compreender a palavra") &&
          !textContent.toLowerCase().includes("meditar a palavra") &&
          !textContent.toLowerCase().includes("rezar a palavra") &&
          !textContent.toLowerCase().includes("compromisso") &&
          textContent !== ""
        ) {
          currentSectionContent.push($(el).prop("outerHTML") || "")
        }
      }
    })

    // Add the last section if any
    if (currentSectionTitle && currentSectionContent.length > 0) {
      sections.push({
        title: currentSectionTitle,
        content: formatVersesInHtml(currentSectionContent.join("")),
      })
    }

    // Filter out empty sections or sections with only titles
    const filteredSections = sections.filter((s) => s.content.trim() !== "")

    return {
      evangelhoTitle,
      evangelhoReference,
      sections: filteredSections,
    }
  } catch (error) {
    console.error("Error fetching or parsing Lectio Divina:", error)
    return null
  }
}

export function getPreviousDay(currentDate: Date): Date {
  return subDays(currentDate, 1)
}

export function getNextDay(currentDate: Date): Date {
  return addDays(currentDate, 1)
}
