"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Share2, Minus, Plus, Play, Pause, Check, Calendar, Volume2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { DayPicker } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Facebook, MessageSquare, Send, Instagram, Youtube } from "lucide-react"

interface LiturgiaData {
  data?: string
  liturgia?: string
  cor?: string
  dia?: string
  antifonas?: {
    entrada?: string
  }
  oracoes?: {
    coleta?: string
  }
  leituras?:
    | string
    | {
        primeiraLeitura?: any[]
        segundaLeitura?: any[]
        salmo?: any[]
        evangelho?: any[]
        aclamacao?: any[]
        extras?: any[]
      }
  [key: string]: any
}

export default function LiturgiaPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [liturgiaData, setLiturgiaData] = useState<LiturgiaData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fontSize, setFontSize] = useState(16)
  const [showCalendar, setShowCalendar] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copied, setCopied] = useState(false)

  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isReading, setIsReading] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)

  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null)

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

  // Verificar se há leitura em andamento ao carregar a página
  useEffect(() => {
    if (speechSynthesis.speaking) {
      setIsReading(true)
      setIsPaused(speechSynthesis.paused)
    }
  }, [])

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

  const fetchLiturgia = async (date: Date) => {
    setLoading(true)
    setError(null)

    const dateFormats = [
      format(date, "yyyy-MM-dd"),
      format(date, "dd-MM-yyyy"),
      format(date, "yyyy/MM/dd"),
      format(date, "dd/MM/yyyy"),
    ]

    const baseUrls = [
      "https://liturgia.up.railway.app/v2",
      "https://liturgia.up.railway.app/api/v2",
      "https://liturgia.up.railway.app",
    ]

    let lastError = ""

    for (const baseUrl of baseUrls) {
      for (const dateStr of dateFormats) {
        try {
          const testUrl = `${baseUrl}/${dateStr}`
          console.log(`Tentando URL: ${testUrl}`)

          const response = await fetch(testUrl)

          if (response.ok) {
            const data = await response.json()
            console.log("Sucesso com URL:", testUrl)
            console.log("Dados recebidos:", data)
            setLiturgiaData(data)
            setLoading(false)
            return
          } else {
            lastError = `HTTP ${response.status}: ${response.statusText}`
          }
        } catch (err) {
          lastError = err instanceof Error ? err.message : "Erro desconhecido"
        }
      }
    }

    for (const baseUrl of baseUrls) {
      try {
        const response = await fetch(baseUrl)
        if (response.ok) {
          const data = await response.json()
          setLiturgiaData(data)
          setLoading(false)
          return
        }
      } catch (err) {
        console.log(`Erro ${baseUrl}: ${err}`)
      }
    }

    setError(`Não foi possível conectar à API. Último erro: ${lastError}`)

    // Fallback para dados de exemplo se a API falhar
    const sampleData: LiturgiaData = {
      data: format(selectedDate, "yyyy-MM-dd"),
      liturgia: "Sábado da 10ª Semana do Tempo Comum",
      cor: "Verde",
      antifonas: {
        entrada:
          "O Senhor é minha luz e salvação, de quem eu terei medo? O Senhor é a proteção da minha vida; perante quem eu tremerei? São eles, inimigos e opressores, que tropeçam e sucumbem. (Cf. Sl 26, 1-2)",
      },
      oracoes: {
        coleta:
          "Ó Deus, fonte de todo o bem, atendei ao nosso apelo e fazei-nos, por vossa inspiração, pensar o que é certo e realizá-lo com vossa ajuda. Por Nosso Senhor Jesus Cristo, vosso Filho, que é Deus, e convosco vive e reina, na unidade do Espírito Santo, por todos os séculos dos séculos.",
      },
      leituras: {
        primeiraLeitura: [
          {
            referencia: "2 Cor 5,14-21",
            titulo: "Leitura da segunda carta de São Paulo aos Coríntios",
            texto:
              "Irmãos, 14o amor de Cristo nos pressiona, pois julgamos que um só morreu por todos e que, logo, todos morreram por ele. 15Cristo morreu por todos, para que os vivos não vivam mais para si mesmos, mas para aquele que por eles morreu e ressuscitou. 16Portanto, se alguém está em Cristo, é uma criatura nova. O mundo velho desapareceu. Tudo agora é novo. 17E tudo vem de Deus, que, por Cristo, nos reconciliou consigo e nos confiou o ministério da reconciliação. 18Com efeito, em Cristo, Deus reconciliou o mundo consigo, não imputando aos homens as suas faltas e colocando em nós a palavra da reconciliação. 19Somos, pois, embaixadores de Cristo, e é Deus mesmo que exorta através de nós. Em nome de Cristo, nós vos suplicamos: deixai-vos reconciliar com Deus. 20Aquele que não cometeu nenhum pecado, Deus o fez pecado por nós, para que nele nos tornemos justiça de Deus.",
          },
        ],
        salmo: [
          {
            referencia: "Sl 102(103)",
            refrao: "O Senhor é indulgente, é favorável.",
            texto:
              "— Bendize, ó minha alma, ao Senhor, e todo o meu ser, seu santo nome! Bendize, ó minha alma, ao Senhor, não te esqueças de nenhum de seus favores!\n— Pois ele perdoa toda culpa e cura toda a tua enfermidade; da sepultura ele salva a tua vida e te cerca de carinho e compaixão.\n— O Senhor é indulgente, é favorável, é paciente, é bondoso e compassivo. Não fica sempre repetindo as suas queixas nem guarda eternamente o seu rancor.\n— Quanto os céus por sobre a terra se elevam, tanto é grande o seu amor aos que o temem; quanto dista o nascente do poente, tanto afasta para longe nossos crimes.",
          },
        ],
        evangelho: [
          {
            referencia: "Mt 5,33-37",
            titulo: "Proclamação do Evangelho de Jesus Cristo segundo Mateus",
            texto:
              "Naquele tempo, disse Jesus aos seus discípulos: 33\"Vós ouvistes o que foi dito aos antigos: 'Não jurarás falso', mas 'cumprirás os teus juramentos feitos ao Senhor'. 34Eu, porém, vos digo: não jureis de modo algum: nem pelo céu, porque é o trono de Deus; 35nem pela terra, porque é o suporte onde apoia os seus pés; nem por Jerusalém, porque é a cidade do grande rei. 36Não jures tampouco pela tua cabeça, porque tu não podes tornar branco ou preto um só fio do cabelo. 37Seja o vosso 'sim' sim e o vosso 'não' não. Tudo o que for além disso vem do maligno.\"",
          },
        ],
      },
    }

    setLiturgiaData(sampleData)
    setLoading(false)
  }

  useEffect(() => {
    fetchLiturgia(selectedDate)
  }, [selectedDate])

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 24))
  }

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 12))
  }

  const formatVerses = (text: string | undefined) => {
    if (!text) return "Texto não disponível"

    const formattedText = text.replace(/(\d+)\s*/g, '<sup class="verse-number">$1</sup>').replace(/\n/g, "<br>")

    return (
      <div
        className="whitespace-pre-line leading-relaxed formatted-text"
        dangerouslySetInnerHTML={{ __html: formattedText }}
      />
    )
  }

  const formatDateTitle = (date: Date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

  const formatLiturgiaTitle = (title: string | undefined) => {
    if (!title) return ""

    return title
      .replace(/^2ª feira/, "Segunda-feira")
      .replace(/^3ª feira/, "Terça-feira")
      .replace(/^4ª feira/, "Quarta-feira")
      .replace(/^5ª feira/, "Quinta-feira")
      .replace(/^6ª feira/, "Sexta-feira")
  }

  const getCompleteContent = () => {
    const dateStr = formatDateTitle(selectedDate)

    // Código original para outras datas
    if (!liturgiaData) return ""

    const liturgiaStr = formatLiturgiaTitle(liturgiaData.liturgia || "")

    let content = `📖 LITURGIA DE ${dateStr.toUpperCase()}\n`
    content += `${liturgiaStr}\n\n`

    // Antífona de Entrada
    if (liturgiaData.antifonas?.entrada) {
      content += `🚪 ANTÍFONA DE ENTRADA\n`
      content += `${liturgiaData.antifonas.entrada}\n\n`
    }

    // Oração do Dia
    if (liturgiaData.oracoes?.coleta) {
      content += `🙏 ORAÇÃO DO DIA\n`
      content += `${liturgiaData.oracoes.coleta}\n\n`
    }

    const leituras = processLeituras()

    // Primeira Leitura
    if (leituras?.primeiraLeitura && leituras.primeiraLeitura.length > 0) {
      content += `📜 PRIMEIRA LEITURA (${leituras.primeiraLeitura[0].referencia})\n`
      if (leituras.primeiraLeitura[0].titulo) {
        content += `${leituras.primeiraLeitura[0].titulo}\n\n`
      }
      content += `${leituras.primeiraLeitura[0].texto}\n`
      content += `— Palavra do Senhor.\n— Graças a Deus.\n\n`
    }

    // Salmo Responsorial
    if (leituras?.salmo && leituras.salmo.length > 0) {
      content += `🎵 SALMO RESPONSORIAL (${leituras.salmo[0].referencia})\n`
      content += `R. ${leituras.salmo[0].refrao}\n\n`
      content += `${leituras.salmo[0].texto}\n\n`
    }

    // Segunda Leitura
    if (leituras?.segundaLeitura && leituras.segundaLeitura.length > 0) {
      content += `📜 SEGUNDA LEITURA (${leituras.segundaLeitura[0].referencia})\n`
      if (leituras.segundaLeitura[0].titulo) {
        content += `${leituras.segundaLeitura[0].titulo}\n\n`
      }
      content += `${leituras.segundaLeitura[0].texto}\n`
      content += `— Palavra do Senhor.\n— Graças a Deus.\n\n`
    }

    // Evangelho
    if (leituras?.evangelho && leituras.evangelho.length > 0) {
      content += `✝️ EVANGELHO (${leituras.evangelho[0].referencia})\n`
      if (leituras.evangelho[0].titulo) {
        content += `${leituras.evangelho[0].titulo}\n\n`
      }
      content += `${leituras.evangelho[0].texto}\n`
      content += `— Palavra da Salvação.\n— Glória a vós, Senhor.\n\n`
    }

    return content
  }

  // Função universal de compartilhamento
  const handleUniversalShare = async () => {
    const content = getCompleteContent()
    const finalContent = `${content}\n📱 Acesse meditações em:`

    // Verificar se o navegador suporta a Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Liturgia de ${formatDateTitle(selectedDate)}`,
          text: finalContent,
          url: "https://liturgiadiaria.top",
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

  const processLeituras = () => {
    let leituras
    if (!liturgiaData?.leituras) return null

    if (typeof liturgiaData.leituras === "string") {
      try {
        leituras = JSON.parse(liturgiaData.leituras)
      } catch {
        return null
      }
    } else {
      leituras = liturgiaData.leituras
    }

    return leituras
  }

  const leituras = processLeituras()

  // Função para processar o texto para leitura - MELHORADA
  const processTextForReading = (text: string): string => {
    return (
      text
        // Remove tudo que vem após um ponto final seguido de parênteses (para antífona)
        .replace(/\.\s*$$[^)]*$$/g, ".")
        // Remove qualquer conteúdo entre parênteses
        .replace(/$$[^)]*$$/g, "")
        // Remove números de versículos no início de frases (formato: 14palavra, 15palavra, etc.)
        .replace(/(\s|^)\d+([a-zA-ZÀ-ÿ])/g, "$1$2")
        // Remove números isolados no início de linhas
        .replace(/^\d+\s*/gm, "")
        // Remove números isolados entre espaços
        .replace(/\s\d+\s/g, " ")
        // Remove números seguidos de aspas (formato: 33"texto)
        .replace(/\d+"/g, '"')
        // Remove números no meio de frases (formato: palavra14palavra)
        .replace(/([a-zA-ZÀ-ÿ])\d+([a-zA-ZÀ-ÿ])/g, "$1$2")
        // Remove referências bíblicas (formato: 1,2 ou 23,4-5)
        .replace(/\d+,\d+(-\d+)?\s*/g, "")
        // Remove tags HTML
        .replace(/<[^>]*>/g, "")
        // Remove múltiplas quebras de linha
        .replace(/\n\s*\n/g, "\n")
        // Remove espaços extras
        .replace(/\s+/g, " ")
        // Remove pontos duplos
        .replace(/\.+/g, ".")
        .trim()
    )
  }

  // Função para obter o conteúdo completo para leitura
  const getReadingContent = (): string => {
    if (!liturgiaData) return ""

    let content = ""

    // Título da liturgia (com formatação dos dias da semana)
    if (liturgiaData.liturgia) {
      const formattedTitle = formatLiturgiaTitle(liturgiaData.liturgia)
      content += `${formattedTitle}. `
      // Pequena pausa após o título
      content += ". "
    }

    // Antífona de Entrada (sem ler o título "Antífona de Entrada")
    if (liturgiaData.antifonas?.entrada) {
      content += `${processTextForReading(liturgiaData.antifonas.entrada)} `
      // Pequena pausa após a antífona
      content += ". "
    }

    // Oração do Dia (sem "Amém")
    if (liturgiaData.oracoes?.coleta) {
      content += `Oremos. `
      // Pausa após "Oremos"
      content += ". "
      content += `${processTextForReading(liturgiaData.oracoes.coleta)} `
      // Pequena pausa após a oração (sem "Amém")
      content += ". "
    }

    // Primeira Leitura (sem ler o título da seção)
    if (leituras?.primeiraLeitura && leituras.primeiraLeitura.length > 0) {
      if (leituras.primeiraLeitura[0].titulo) {
        content += `${leituras.primeiraLeitura[0].titulo}. `
      }
      content += `${processTextForReading(leituras.primeiraLeitura[0].texto)} `
      content += `Palavra do Senhor. `
      // Pequena pausa após a primeira leitura
      content += ". "
    }

    // Salmo Responsorial (ir direto ao refrão)
    if (leituras?.salmo && leituras.salmo.length > 0) {
      content += `${leituras.salmo[0].refrao} `
      content += `${processTextForReading(leituras.salmo[0].texto)} `
      // Pequena pausa após o salmo
      content += ". "
    }

    // Segunda Leitura (sem ler o título da seção)
    if (leituras?.segundaLeitura && leituras.segundaLeitura.length > 0) {
      if (leituras.segundaLeitura[0].titulo) {
        content += `${leituras.segundaLeitura[0].titulo}. `
      }
      content += `${processTextForReading(leituras.segundaLeitura[0].texto)} `
      content += `Palavra do Senhor. `
      // Pequena pausa após a segunda leitura
      content += ". "
    }

    // Evangelho (começar direto com "Proclamação do evangelho...")
    if (leituras?.evangelho && leituras.evangelho.length > 0) {
      if (leituras.evangelho[0].titulo) {
        content += `${leituras.evangelho[0].titulo}. `
      }
      content += `${processTextForReading(leituras.evangelho[0].texto)} `
      content += `Palavra da Salvação. `
      // Pequena pausa após o evangelho
      content += ". "
    }

    return content
  }

  // Função para configurar e iniciar a leitura
  const startReading = () => {
    if ("speechSynthesis" in window) {
      const content = getReadingContent()

      if (content.trim()) {
        speechSynthesis.cancel() // Cancel any ongoing speech

        const utterance = new SpeechSynthesisUtterance(content)
        speechRef.current = utterance

        // Configurações da voz
        utterance.lang = "pt-BR"
        utterance.rate = 0.9 // Velocidade um pouco mais lenta para melhor compreensão
        utterance.pitch = 1
        utterance.volume = 1

        // Tentar encontrar uma voz em português
        const voices = speechSynthesis.getVoices()
        const portugueseVoice = voices.find((voice) => voice.lang.includes("pt") || voice.lang.includes("PT"))
        if (portugueseVoice) {
          utterance.voice = portugueseVoice
        }

        // Event listeners
        utterance.onstart = () => {
          setIsReading(true)
          setIsPaused(false)
        }

        utterance.onend = () => {
          setIsReading(false)
          setIsPaused(false)
          setReadingProgress(0)
        }

        utterance.onerror = () => {
          setIsReading(false)
          setIsPaused(false)
          setReadingProgress(0)
        }

        utterance.onboundary = (event) => {
          if (event.name === "word") {
            const progress = (event.charIndex / content.length) * 100
            setReadingProgress(progress)
          }
        }

        speechSynthesis.speak(utterance)
      }
    } else {
      alert("Seu navegador não suporta síntese de voz.")
    }
  }

  // Função para pausar/retomar a leitura
  const toggleReading = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause()
      setIsPaused(true)
    } else if (speechSynthesis.paused) {
      speechSynthesis.resume()
      setIsPaused(false)
    } else if (!isReading) {
      startReading()
    }
  }

  // Função para parar a leitura
  const stopReading = () => {
    speechSynthesis.cancel()
    setIsReading(false)
    setIsPaused(false)
    setReadingProgress(0)
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
        .formatted-text {
          line-height: 1.8;
        }
        @media print {
          .no-print {
            display: none !important;
          }
        }
        /* Calendar dark mode styles */
        .${isDarkMode ? "dark-calendar" : ""} .rdp {
          --rdp-cell-size: 40px;
          --rdp-accent-color: #ec0909;
          --rdp-background-color: ${isDarkMode ? "#1f2937" : "#ffffff"};
          --rdp-accent-color-dark: #dc2626;
          color: ${isDarkMode ? "#ffffff" : "#000000"};
        }

        .${isDarkMode ? "dark-calendar" : ""} .rdp-day {
          color: ${isDarkMode ? "#ffffff" : "#000000"};
        }

        .${isDarkMode ? "dark-calendar" : ""} .rdp-day:hover {
          background-color: ${isDarkMode ? "#374151" : "#f3f4f6"};
        }

        .${isDarkMode ? "dark-calendar" : ""} .rdp-day_selected {
          background-color: #ec0909 !important;
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
          background-color: ${isDarkMode ? "#ffffff" : "#ec0909"} !important;
          color: ${isDarkMode ? "#ec0909" : "#ffffff"} !important;
          font-weight: bold;
        }
      `}</style>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Botão Flutuante de Áudio */}
        <div className="fixed bottom-6 right-6 z-50 no-print">
          <div className="flex flex-col items-end gap-2">
            {/* Controles adicionais quando está lendo */}
            {isReading && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-600">
                <div className="flex flex-col items-center gap-2 min-w-[120px]">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    {isPaused ? "Pausado" : "Lendo..."}
                  </span>

                  {/* Barra de progresso */}
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${readingProgress}%`,
                        backgroundColor: "#DC2626",
                      }}
                    ></div>
                  </div>

                  {/* Botão de parar */}
                  <Button
                    onClick={stopReading}
                    size="sm"
                    variant="outline"
                    className="w-full text-xs bg-transparent"
                    style={{
                      backgroundColor: "transparent",
                      borderColor: "#DC2626",
                      color: "#DC2626",
                    }}
                  >
                    ⏹️ Parar
                  </Button>
                </div>
              </div>
            )}

            {/* Botão principal com melhor contraste */}
            <Button
              onClick={toggleReading}
              className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 border-2 ${
                isReading
                  ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                  : isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
                    : "bg-white hover:bg-gray-100 text-gray-800 border-gray-300 shadow-md"
              }`}
              title={isReading ? (isPaused ? "Continuar leitura" : "Pausar leitura") : "Ouvir liturgia"}
            >
              {isReading ? (
                isPaused ? (
                  <Play className="h-6 w-6" />
                ) : (
                  <Pause className="h-6 w-6" />
                )
              ) : (
                <Volume2 className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Header com Título e Controles */}
        <div className="mb-6">
          {/* Controles - Mobile: no topo, acima da data */}
          {!isReading && (
            <div className="flex flex-col items-center gap-3 md:absolute md:top-0 md:left-0 md:flex-row md:items-start no-print mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDarkMode(!isDarkMode)}
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
                    className={`w-8 h-8 p-0 ${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-white"}`}
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
              Liturgia Diária - {format(selectedDate, "dd 'de' MMMM yyyy", { locale: ptBR })}
            </h1>
            {liturgiaData?.liturgia && (
              <div className="mt-2">
                <h2 className={`text-lg ${isDarkMode ? "text-gray-200" : "text-muted-foreground"}`}>
                  {formatLiturgiaTitle(liturgiaData.liturgia)}
                </h2>
              </div>
            )}
          </div>

          {/* Calendário */}
          {showCalendar && !isReading && (
            <Card className={`mt-4 no-print ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`}>
              <CardContent className="p-4">
                <div className={`flex justify-center ${isDarkMode ? "dark-calendar" : ""}`}>
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date)
                        setShowCalendar(false)
                      }
                    }}
                    locale={ptBR}
                    className="rdp"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {loading ? (
          <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
            <CardContent className={isDarkMode ? "text-white" : "text-gray-900"}>
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className={isDarkMode ? "text-white" : "text-gray-900"}>Carregando liturgia...</p>
              </div>
            </CardContent>
          </Card>
        ) : liturgiaData ? (
          <div className="space-y-6" style={{ fontSize: `${fontSize}px` }}>
            {/* Antífona de Entrada */}
            {liturgiaData.antifonas?.entrada && (
              <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                <CardHeader>
                  <CardTitle style={{ color: "#ec0909" }} className="text-lg">
                    Antífona de Entrada
                  </CardTitle>
                </CardHeader>
                <CardContent className={isDarkMode ? "text-white" : "text-gray-900"}>
                  {formatVerses(liturgiaData.antifonas.entrada)}
                </CardContent>
              </Card>
            )}

            {/* Oração do Dia */}
            {liturgiaData.oracoes?.coleta && (
              <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                <CardHeader>
                  <CardTitle style={{ color: "#ec0909" }} className="text-lg">
                    Oração do Dia (Coleta)
                  </CardTitle>
                </CardHeader>
                <CardContent className={isDarkMode ? "text-white" : "text-gray-900"}>
                  {formatVerses(liturgiaData.oracoes.coleta)}
                </CardContent>
              </Card>
            )}

            {/* Primeira Leitura */}
            {leituras?.primeiraLeitura && leituras.primeiraLeitura.length > 0 && (
              <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                <CardHeader>
                  <CardTitle style={{ color: "#ec0909" }} className="text-lg">
                    Primeira Leitura ({leituras.primeiraLeitura[0].referencia})
                  </CardTitle>
                  <p className={`text-sm font-medium italic ${isDarkMode ? "text-gray-200" : "text-gray-600"}`}>
                    {leituras.primeiraLeitura[0].titulo}
                  </p>
                </CardHeader>
                <CardContent className={isDarkMode ? "text-white" : "text-gray-900"}>
                  {formatVerses(leituras.primeiraLeitura[0].texto)}
                  <p className={`mt-4 font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    — Palavra do Senhor.
                  </p>
                  <p className={`text-sm italic ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>— Graças a Deus.</p>
                </CardContent>
              </Card>
            )}

            {/* Salmo Responsorial */}
            {leituras?.salmo && leituras.salmo.length > 0 && (
              <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                <CardHeader>
                  <CardTitle style={{ color: "#ec0909" }} className="text-lg">
                    Salmo Responsorial ({leituras.salmo[0].referencia})
                  </CardTitle>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    R. {leituras.salmo[0].refrao}
                  </p>
                </CardHeader>
                <CardContent className={isDarkMode ? "text-white" : "text-gray-900"}>
                  {formatVerses(leituras.salmo[0].texto)}
                </CardContent>
              </Card>
            )}

            {/* Segunda Leitura */}
            {leituras?.segundaLeitura && leituras.segundaLeitura.length > 0 && (
              <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                <CardHeader>
                  <CardTitle style={{ color: "#ec0909" }} className="text-lg">
                    Segunda Leitura ({leituras.segundaLeitura[0].referencia})
                  </CardTitle>
                  <p className={`text-sm font-medium italic ${isDarkMode ? "text-gray-200" : "text-gray-600"}`}>
                    {leituras.segundaLeitura[0].titulo}
                  </p>
                </CardHeader>
                <CardContent className={isDarkMode ? "text-white" : "text-gray-900"}>
                  {formatVerses(leituras.segundaLeitura[0].texto)}
                  <p className={`mt-4 font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    — Palavra do Senhor.
                  </p>
                  <p className={`text-sm italic ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>— Graças a Deus.</p>
                </CardContent>
              </Card>
            )}

            {/* Evangelho */}
            {leituras?.evangelho && leituras.evangelho.length > 0 && (
              <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                <CardHeader>
                  <CardTitle style={{ color: "#ec0909" }} className="text-lg">
                    Evangelho do Dia ({leituras.evangelho[0].referencia})
                  </CardTitle>
                  <p className={`text-sm font-medium italic ${isDarkMode ? "text-gray-200" : "text-gray-600"}`}>
                    {leituras.evangelho[0].titulo}
                  </p>
                </CardHeader>
                <CardContent className={isDarkMode ? "text-white" : "text-gray-900"}>
                  {formatVerses(leituras.evangelho[0].texto)}
                  <p className={`mt-4 font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    — Palavra da Salvação.
                  </p>
                  <p className={`text-sm italic ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    — Glória a vós, Senhor.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Botões de Compartilhamento - Ocultos durante leitura */}
            {!isReading && (
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
            {!isReading && (
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
                      href="https://link.liturgiadiaria.top/facebook-liturgiadadiaria"
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
            {!isReading && (
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
                      href="https://link.liturgiadiaria.top/cuponsagora-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src="/banner-ofertas-exclusivas.webp"
                        alt="Cupons Agora - Clique aqui"
                        className="mx-auto max-w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        style={{ maxWidth: "728px", height: "auto" }}
                      />
                    </a>
                  </div>

                  {/* Espaços reservados para futuros banners de clientes */}
                  {/* 
                    Quando houver clientes interessados em anunciar, 
                    adicionar os banners 300x250 abaixo do banner atual:
                    
                    <div className="mt-4 mx-auto" style={{ width: "300px", height: "250px" }}>
                      <a href="URL_DO_CLIENTE" target="_blank" rel="noopener noreferrer">
                        <img 
                          src="/banner-cliente-1.webp" 
                          alt="Descrição do anúncio do cliente"
                          className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        />
                      </a>
                    </div>
                  */}
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
            <CardContent className={isDarkMode ? "text-white" : "text-gray-900"}>
              <div className="text-center">
                <p className={isDarkMode ? "text-white" : "text-gray-900"}>
                  Nenhuma liturgia encontrada para esta data.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rodapé com Créditos - Oculto durante leitura */}
        {!isReading && (
          <Card className={`mt-8 ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`}>
            <CardContent className={isDarkMode ? "text-white" : "text-gray-900"}>
              <div className="text-center text-sm text-gray-600">
                {error && (
                  <div className="mb-3 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                    <p className="font-medium">Aviso:</p>
                    <p>{error}</p>
                    <p className="text-xs mt-1">Exibindo dados de exemplo.</p>
                  </div>
                )}

                <div className={`mt-3 pt-3 border-t ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                  <p className="text-xs text-gray-400">© {new Date().getFullYear()} Liturgia Diária - Todos os direitos reservados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
