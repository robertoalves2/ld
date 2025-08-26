"use client" // Este é um Client Component

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Define a interface para a estrutura de cada postagem
interface Post {
  title: string
  pubDate: string
  content: string
}

// Define as props para o componente FeedAccordion
interface FeedAccordionProps {
  posts: Post[]
}

/**
 * Componente FeedAccordion que exibe as postagens do feed em um formato de lista suspensa.
 * @param {FeedAccordionProps} { posts } - Um array de objetos Post.
 */
export default function FeedAccordion({ posts }: FeedAccordionProps) {
  // Exibe uma mensagem se não houver postagens ou se ocorrer um erro ao carregar
  if (!posts || posts.length === 0) {
    return <div className="text-center text-gray-600 py-8">Nenhum post encontrado ou erro ao carregar o feed.</div>
  }

  return (
    <Accordion type="single" collapsible className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      {posts.map((post, index) => (
        <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-b-0 border-gray-200">
          <AccordionTrigger className="text-left py-4 px-6 hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center">
            <div className="flex flex-col items-start flex-grow pr-4">
              <h2 className="text-lg font-semibold text-gray-900 leading-tight">{post.title}</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-6 bg-gray-50 text-gray-700 leading-relaxed">
            {/* Usa dangerouslySetInnerHTML para renderizar o conteúdo HTML do feed.
                Isso é necessário porque o conteúdo do feed é uma string HTML.
                Tenha cuidado ao usar esta prop, pois ela pode introduzir vulnerabilidades XSS
                se o conteúdo não for confiável. Neste caso, o feed é de uma fonte conhecida. */}
            <div className="text-base" dangerouslySetInnerHTML={{ __html: post.content }} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
