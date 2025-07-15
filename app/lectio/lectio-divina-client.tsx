"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Share2, Minus, Plus, Play, Pause, Check, Calendar, ArrowLeft, ArrowRight } from "lucide-react"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css" // Import default styles for DayPicker
import { Button } from "@/components/ui/button"
import { Facebook, MessageSquare, Send, Instagram, Youtube } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { getPreviousDay, getNextDay } from "@/lib/lectio-parser"

interface LectioContent {
  evangelhoTitle: string
  evangelhoReference: string
  sections: {
    title: string
    content: string
  }[]
}

interface LectioDivinaClientProps {
  initialData: LectioContent | null
  initialDate: string
}

export default function LectioDivinaClient({ initialData, initialDate }: LectioDivinaClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedDate, setSelectedDate] = useState<Date>(parseISO(initialDate))
  const [lectioData, setLectioData] = useState<LectioContent | null>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fontSize, setFontSize] = useState(16)
  const [showCalendar, setShowCalendar] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copied, setCopied] = useState(false)

  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isAutoScroll, setIsAutoScroll] = useState(false)
  const [scrollSpeed, setScrollSpeed] = useState(1)

  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Sync selectedDate with URL param
  useEffect(() => {
    const dateParam = searchParams.get("date")
    if (dateParam) {
      try {
        const parsedDate = parseISO(dateParam)
        if (!isNaN(parsedDate.getTime())) {
          setSelectedDate(parsedDate)
        }
      } catch (e) {
        console.error("Invalid date parameter:", e)
      }
    }
  }, [searchParams])

  // Auto dark mode based on time
  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours()
      const isNight = hour >= 20 || hour < 6
      setIsDarkMode(isNight)
    }

    checkTime()
    const interval = setInterval(checkTime, 60000)

    return () => clearInterval(interval)
  }, [])

  // Auto scroll functionality
  useEffect(() => {
    if (isAutoScroll) {
      scrollIntervalRef.current = setInterval(() => {
        window.scrollBy(0, scrollSpeed)

        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" })
          }, 2000)
        }
      }, 50)
    } else {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
      }
    }

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
      }
    }
  }, [isAutoScroll, scrollSpeed])

  // Fullscreen functionality
  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      try {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
      } catch (err) {
        console.error("Error attempting to enable fullscreen:", err)
      }
    } else {
      try {
        await document.exitFullscreen()
        setIsFullscreen(false)
      } catch (err) {
        console.error("Error attempting to exit fullscreen:", err)
      }
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const toggleAutoScroll = () => {
    const newAutoScrollState = !isAutoScroll
    setIsAutoScroll(newAutoScrollState)

    if (newAutoScrollState && !isFullscreen) {
      toggleFullscreen()
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      setShowCalendar(false)
      router.push(`/lectio?date=${format(date, "yyyy-MM-dd")}`)
    }
  }

  const navigateDate = (delta: number) => {
    const newDate = delta === -1 ? getPreviousDay(selectedDate) : getNextDay(selectedDate)
    setSelectedDate(newDate)
    router.push(`/lectio?date=${format(newDate, "yyyy-MM-dd")}`)
  }

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 24))
  }

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 12))
  }

  const getCompleteContent = () => {
    if (!lectioData) return ""

    let content = `📖 LECTIO DIVINA - ${format(selectedDate, "dd 'de' MMMM yyyy", { locale: ptBR }).toUpperCase()}\n\n`
    content += `*${lectioData.evangelhoTitle}*\n\n`

    lectioData.sections.forEach((section) => {
      content += `*${section.title}*\n`
      // Remove HTML tags and replace <br> with newlines for plain text copy
      const plainTextContent = section.content
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/<br\s*\/?>/g, "\n")
        .trim()
      content += `${plainTextContent}\n\n`
    })

    return content
  }

  // Função universal de compartilhamento
  const handleUniversalShare = async () => {
    const content = getCompleteContent()
    const finalContent = `${content}\n🙏 Acesse: www.liturgiadiaria.top/lectio`

    // Verificar se o navegador suporta a Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lectio Divina de ${format(selectedDate, "dd 'de' MMMM yyyy", { locale: ptBR })}`,
          text: finalContent,
          url: "https://liturgiadiaria.top/lectio",
        })
      } catch (error) {
        console.log("Compartilhamento cancelado ou erro:", error)
        // Fallback para copiar para clipboard
        copyToClipboard(finalContent)
      }
    } else {
      // Fallback para copiar para clipboard se Web Share API não estiver disponível
      copyToClipboard(finalContent)
    }
  }

  // Função para copiar para clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Erro ao copiar:", error)
      // Fallback para navegadores mais antigos
      const textArea = document.createElement("textarea")
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <style jsx>{`
        .verse-number {
          font-size: 0.6em;
          color: ${isDarkMode ? "#ccc" : "#888"};
          font-weight: normal;
          margin: 0 2px;
        }
        .formatted-text :global(p) {
          margin-bottom: 1em;
        }
        .formatted-text :global(h3) {
          font-weight: bold;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          color: #6a1b9a; /* Purple color for section titles */
        }
        @media print {
          .no-print {
            display: none !important;
          }
        }
        /* Calendar dark mode styles */
        .${isDarkMode ? "dark-calendar" : ""} .rdp {
          --rdp-cell-size: 40px;
          --rdp-accent-color: #6a1b9a; /* Purple accent */
          --rdp-background-color: ${isDarkMode ? "#1f2937" : "#ffffff"};
          --rdp-accent-color-dark: #4a126b;
          color: ${isDarkMode ? "#ffffff" : "#000000"};
        }

        .${isDarkMode ? "dark-calendar" : ""} .rdp-day {
          color: ${isDarkMode ? "#ffffff" : "#000000"};
        }

        .${isDarkMode ? "dark-calendar" : ""} .rdp-day:hover {
          background-color: ${isDarkMode ? "#374151" : "#f3f4f6"};
        }

        .${isDarkMode ? "dark-calendar" : ""} .rdp-day_selected {
          background-color: #6a1b9a !important; /* Purple selected day */
          color: white !important;
        }

        .${isDarkMode ? "dark-calendar" : ""} .rdp-head_cell {
          color: ${isDarkMode ? "#d1d5db" : "#6b7280"};
        }

        .${isDarkMode ? "dark-calendar" : ""} .rdp-caption {
          color: ${isDarkMode ? "#ffffff" : "#000000"};
        }

        .${isDarkMode ? "dark-calendar" : ""} .rdp-nav_button {
          color: ${isDarkMode ? "#ffffff" : "#000000"};
        }

        .${isDarkMode ? "dark-calendar" : ""} .rdp-nav_button:hover {
          background-color: ${isDarkMode ? "#374151" : "#f3f4f6"};
        }

        .${isDarkMode ? "dark-calendar" : ""} .rdp-day_today {
          background-color: ${isDarkMode ? "#ffffff" : "#6a1b9a"} !important;
          color: ${isDarkMode ? "#6a1b9a" : "#ffffff"} !important;
          font-weight: bold;
        }
      `}</style>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Botão Flutuante de Auto-Scroll */}
        <div className="fixed bottom-6 right-6 z-50 no-print">
          <Button
            onClick={toggleAutoScroll}
            className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
              isAutoScroll
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
                  : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
            }`}
            title={isAutoScroll ? "Parar rolagem automática" : "Iniciar rolagem automática"}
          >
            {isAutoScroll ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>

          {/* Controle de Velocidade Flutuante */}
          {isAutoScroll && (
            <div className="absolute bottom-16 right-0 mb-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-600">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Velocidade</span>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.5"
                    value={scrollSpeed}
                    onChange={(e) => setScrollSpeed(Number(e.target.value))}
                    className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #6a1b9a 0%, #6a1b9a ${((scrollSpeed - 0.5) / 2.5) * 100}%, #d1d5db ${((scrollSpeed - 0.5) / 2.5) * 100}%, #d1d5db 100%)`,
                    }}
                  />
                  <span className="text-xs font-bold text-purple-600">{scrollSpeed}x</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Header com Título e Controles */}
        <div className="mb-6">
          {/* Controles - Mobile: no topo, acima da data */}
          {!isAutoScroll && (
            <div className="flex flex-col items-center gap-3 md:absolute md:top-0 md:left-0 md:flex-row md:items-start no-print mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleDarkMode}
                  className={`p-2 ${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                  title={isDarkMode ? "Modo claro" : "Modo escuro"}
                >
                  {isDarkMode ? "☀️" : "🌙"}
                </Button>

                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={decreaseFontSize}
                    className={`w-8 h-8 p-0 ${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                    title="Diminuir fonte"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className={`text-xs px-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{fontSize}px</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={increaseFontSize}
                    className={`w-8 h-8 p-0 ${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                    title="Aumentar fonte"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className={`p-2 ${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                  title="Selecionar data"
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Título Principal - Centralizado */}
          <div className="text-center">
            <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Lectio Divina - {format(selectedDate, "dd 'de' MMMM yyyy", { locale: ptBR })}
            </h1>
            {lectioData?.evangelhoTitle && (
              <div className="mt-2">
                <h2 className={`text-lg ${isDarkMode ? "text-gray-200" : "text-muted-foreground"}`}>
                  {lectioData.evangelhoTitle}
                </h2>
              </div>
            )}
          </div>

          {/* Calendário */}
          {showCalendar && !isAutoScroll && (
            <Card className={`mt-4 no-print ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`}>
              <CardContent className="p-4">
                <div className={`flex justify-center ${isDarkMode ? "dark-calendar" : ""}`}>
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    locale={ptBR}
                    className="rdp"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Navegação de Dias */}
        <div className="flex justify-between mb-6 no-print">
          <Button
            variant="outline"
            onClick={() => navigateDate(-1)}
            className={`flex items-center gap-2 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:text-white" : ""}`}
          >
            <ArrowLeft className="h-4 w-4" />
            Dia anterior
          </Button>
          <Button
            variant="outline"
            onClick={() => navigateDate(1)}
            className={`flex items-center gap-2 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:text-white" : ""}`}
          >
            Próximo dia
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
            <CardContent className={isDarkMode ? "text-white" : "text-gray-900"}>
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className={isDarkMode ? "text-white" : "text-gray-900"}>Carregando Lectio Divina...</p>
              </div>
            </CardContent>
          </Card>
        ) : lectioData ? (
          <div className="space-y-6" style={{ fontSize: `${fontSize}px` }}>
            {lectioData.sections.map((section, index) => (
              <Card key={index} className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                <CardHeader>
                  <CardTitle style={{ color: "#6a1b9a" }} className="text-lg">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className={`formatted-text ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  <div dangerouslySetInnerHTML={{ __html: section.content }} />
                </CardContent>
              </Card>
            ))}

            {/* Botões de Compartilhamento - Ocultos durante auto-scroll */}
            {!isAutoScroll && (
              <Card className={`no-print ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`}>
                <CardHeader>
                  <CardTitle className={`text-lg text-center ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Evangelize Compartilhando a Palavra de Deus!
                  </CardTitle>
                </CardHeader>
                <CardContent className={isDarkMode ? "text-white" : "text-gray-900"}>
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={handleUniversalShare}
                      className={`flex items-center gap-2 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:text-white" : ""}`}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                      {copied ? "Copiado!" : "Compartilhar"}
                    </Button>
                  </div>
                  {copied && (
                    <p className={`text-center text-sm mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      Conteúdo copiado! Cole onde desejar compartilhar.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Seção de Redes Sociais */}
            {!isAutoScroll && (
              <Card className={`no-print ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`}>
                <CardHeader>
                  <CardTitle className={`text-lg text-center ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Siga-nos nas Redes Sociais
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap justify-center gap-3 p-4">
                  <Button
                    variant="outline"
                    className={`flex items-center gap-2 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:text-white" : ""}`}
                    asChild
                  >
                    <a
                      href="https://link.liturgiadiaria.top/facebook-liturgiadiaria"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className={`flex items-center gap-2 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:text-white" : ""}`}
                    asChild
                  >
                    <a
                      href="https://link.liturgiadiaria.top/whatsapp-canal-liturgia"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageSquare className="h-4 w-4" />
                      WhatsApp
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className={`flex items-center gap-2 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:text-white" : ""}`}
                    asChild
                  >
                    <a
                      href="https://link.liturgiadiaria.top/telegram-liturgiadiariachatbot"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Send className="h-4 w-4" />
                      Telegram
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className={`flex items-center gap-2 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:text-white" : ""}`}
                    asChild
                  >
                    <a
                      href="https://link.liturgiadiaria.top/instagram-liturgiadadiaria"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className={`flex items-center gap-2 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:text-white" : ""}`}
                    asChild
                  >
                    <a
                      href="https://link.liturgiadiaria.top/youtube-liturgiadadiaria"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Youtube className="h-4 w-4" />
                      YouTube
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Seção de Publicidade */}
            {!isAutoScroll && (
              <Card className={`no-print ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`}>
                <CardHeader>
                  <CardTitle className={`text-lg text-center ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Publicidade
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  {/* Banner publicitário */}
                  <div className="mb-4">
                    <a
                      href="https://link.liturgiadiaria.top/ofertas-exclusivas-tecinova"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src="/banner-ofertas-exclusivas.webp"
                        alt="Ofertas Exclusivas TecInova - Clique aqui"
                        className="mx-auto max-w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        style={{ maxWidth: "728px", height: "auto" }}
                      />
                    </a>
                  </div>

                  {/* Espaço para banner adicional 300x250 */}
                  <div
                    className="mt-4 mx-auto"
                    style={{
                      width: "300px",
                      height: "250px",
                      border: "2px dashed #ccc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <a
                      href="mailto:contato@liturgiadiaria.top"
                      className={`text-sm font-bold text-center ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                      style={{ lineHeight: "1.5" }}
                    >
                      {"Anuncie aqui!\nSeu banner 300x250"}
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
            <CardContent className={isDarkMode ? "text-white" : "text-gray-900"}>
              <div className="text-center">
                <p className={isDarkMode ? "text-white" : "text-gray-900"}>
                  Nenhuma Lectio Divina encontrada para esta data.
                </p>
                {error && (
                  <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Erro: {error}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rodapé com Créditos - Oculto durante auto-scroll */}
        {!isAutoScroll && (
          <Card className={`mt-8 ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`}>
            <CardContent className={isDarkMode ? "text-white" : "text-gray-900"}>
              <div className="text-center text-sm text-gray-600">
                <div className={`mt-3 pt-3 border-t ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                  <p className="text-xs text-gray-400">Fonte: aliturgia.com</p>
                  <p className="text-xs text-gray-400">© 2025 Liturgia Diária - Todos os direitos reservados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* CSS personalizado para o slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #6a1b9a; /* Purple thumb */
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #6a1b9a; /* Purple thumb */
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}
