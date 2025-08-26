"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState } from "react"

interface Post {
  title: string
  pubDate: string
  content: string
}

interface FeedAccordionProps {
  posts: Post[]
  error?: string
}

export default function FeedAccordion({ posts, error }: FeedAccordionProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // Se há erro, mostra mensagem de erro com opção de debug
  if (error) {
    return (
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden p-6">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="text-lg font-semibold">Erro ao carregar o feed</h3>
            <p className="text-sm text-gray-600 mt-2">{error}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-blue-800 mb-2">Possíveis soluções:</h4>
            <ul className="text-sm text-blue-700 text-left space-y-1">
              <li>• Verifique sua conexão com a internet</li>
              <li>• O site fonte pode estar temporariamente indisponível</li>
              <li>• Tente recarregar a página em alguns minutos</li>
              <li>• Se o problema persistir, entre em contato conosco</li>
            </ul>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            🔄 Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  // Se não há posts, mostra mensagem
  if (!posts || posts.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden p-6">
        <div className="text-center text-gray-600">
          <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p>Nenhum post encontrado no momento.</p>
          <button onClick={() => window.location.reload()} className="mt-2 text-blue-600 hover:text-blue-800 underline">
            Tentar recarregar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* Contador de posts */}
      <div className="text-center text-sm text-gray-600 mb-4">
        Exibindo {posts.length} {posts.length === 1 ? "post" : "posts"}
      </div>

      <Accordion type="single" collapsible className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        {posts.map((post, index) => {
          const itemValue = `item-${index}`
          const isExpanded = expandedItems.includes(itemValue)

          return (
            <AccordionItem key={index} value={itemValue} className="border-b last:border-b-0 border-gray-200">
              <AccordionTrigger
                className="text-left py-4 px-6 hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center"
                onClick={() => {
                  if (isExpanded) {
                    setExpandedItems((prev) => prev.filter((item) => item !== itemValue))
                  } else {
                    setExpandedItems((prev) => [...prev, itemValue])
                  }
                }}
              >
                <div className="flex flex-col items-start flex-grow pr-4">
                  <h2 className="text-lg font-semibold text-gray-900 leading-tight">{post.title}</h2>
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(post.pubDate).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 bg-gray-50 text-gray-700 leading-relaxed">
                <div className="text-base" dangerouslySetInnerHTML={{ __html: post.content }} />

                {/* Debug info para cada post em desenvolvimento */}
                {process.env.NODE_ENV === "development" && (
                  <details className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                    <summary className="cursor-pointer font-semibold">Debug do Post</summary>
                    <div className="mt-2 space-y-1">
                      <div>
                        <strong>Título:</strong> {post.title}
                      </div>
                      <div>
                        <strong>Data:</strong> {post.pubDate}
                      </div>
                      <div>
                        <strong>Tamanho do conteúdo:</strong> {post.content.length} caracteres
                      </div>
                    </div>
                  </details>
                )}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
