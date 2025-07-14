"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Share2, Minus, Plus, Play, Pause, Check, Calendar } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { DayPicker } from "react-day-picker"
import { Button } from "@/components/ui/button" // Ensure Button is imported
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
  const [isAutoScroll, setIsAutoScroll] = useState(false)
  const [scrollSpeed, setScrollSpeed] = useState(1)

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

  const getCompleteContent = () => {
    const dateStr = formatDateTitle(selectedDate)

    // Verificar se é 15 de junho de 2025 (hoje) de forma mais segura
    const isToday =
      selectedDate.getFullYear() === 2025 && selectedDate.getMonth() === 5 && selectedDate.getDate() === 15

    if (isToday) {
      return `15 de junho de 2025
Santíssima Trindade, Solenidade

🚪 ANTÍFONA DE ENTRADA
Bendito seja Deus Pai e seu Filho unigênito, com o Espírito Santo, porque nos mostrou a sua misericórdia.

🙏 ORAÇÃO DO DIA
Deus, nosso Pai, enviando ao mundo a Palavra da verdade e o Espírito santificador, revelastes o vosso admirável mistério. Concedei-nos, na profissão da verdadeira fé, reconhecer a glória da Trindade e adorar a Unidade na sua onipotência. Por nosso Senhor Jesus Cristo, vosso Filho, que é Deus, e convosco vive e reina, na unidade do Espírito Santo, por todos os séculos dos séculos.

📜 PRIMEIRA LEITURA (Pr 8,22-31)
Leitura do livro dos Provérbios

Assim fala a sabedoria de Deus: 22"O Senhor me possuiu como primícias de seus caminhos, antes de suas obras mais antigas; 23desde a eternidade fui constituída, desde o princípio, antes das origens da terra. 24Fui gerada quando não existiam os abismos, quando não havia os mananciais das águas, 25antes que fossem estabelecidas as montanhas, antes das colinas fui gerada. 26Ele ainda não havia feito as terras e os campos nem os primeiros vestígios de terra do mundo. 27Quando preparava os céus, ali estava eu; quando traçava a abóbada sobre o abismo, 28quando firmava as nuvens lá no alto e reprimia as fontes do abismo, 29quando fixava ao mar os seus limites – de modo que as águas não ultrapassassem suas bordas – e lançava os fundamentos da terra, 30eu estava ao seu lado como mestre de obras; eu era seu encanto, dia após dia, brincando, todo o tempo, em sua presença, 31brincando na superfície da terra e alegrando-me em estar com os filhos dos homens".
— Palavra do Senhor.
— Graças a Deus.

🎵 SALMO RESPONSORIAL (Sl 8)
R. Ó Senhor, nosso Deus, como é grande vosso nome por todo o universo!

— Contemplando estes céus que plasmastes e formastes com dedos de artista; vendo a lua e estrelas brilhantes, perguntamos: "Senhor, que é o homem, para dele assim vos lembrardes e o tratardes com tanto carinho?"
— Pouco abaixo de Deus o fizestes, coroando-o de glória e esplendor; vós lhe destes poder sobre tudo, vossas obras aos pés lhe pusestes.
— As ovelhas, os bois, os rebanhos, todo o gado e as feras da mata; passarinhos e peixes dos mares, todo ser que se move nas águas.

📜 SEGUNDA LEITURA (Rm 5,1-5)
Leitura da carta de São Paulo aos Romanos

Irmãos, 1justificados pela fé, estamos em paz com Deus pela mediação do Senhor nosso, Jesus Cristo. 2Por ele tivemos acesso, pela fé, a esta graça, na qual estamos firmes e nos gloriamos, na esperança da glória de Deus. 3E não só isso, pois nos gloriamos também de nossas tribulações, sabendo que a tribulação gera a constância, 4a constância leva a uma virtude provada, a virtude provada desabrocha em esperança; 5e a esperança não decepciona, porque o amor de Deus foi derramado em nossos corações pelo Espírito Santo que nos foi dado.
— Palavra do Senhor.
— Graças a Deus.

✝️ EVANGELHO (Jo 16,12-15)
Proclamação do Evangelho de Jesus Cristo segundo João

Naquele tempo, disse Jesus a seus discípulos: 12"Tenho ainda muitas coisas a dizer-vos, mas não sois capazes de as compreender agora. 13Quando, porém, vier o Espírito da verdade, ele vos conduzirá à plena verdade. Pois ele não falará por si mesmo, mas dirá tudo o que tiver ouvido; e até as coisas futuras vos anunciará. 14Ele me glorificará, porque receberá do que é meu e vo-lo anunciará. 15Tudo o que o Pai possui é meu. Por isso disse que o que ele receberá e vos anunciará é meu".
— Palavra da Salvação.
— Glória a vós, Senhor.`
    }

    // Código original para outras datas
    if (!liturgiaData) return ""

    const liturgiaStr = liturgiaData.liturgia || ""

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
    const finalContent = `${content}\n📱 Acesse: www.liturgiadiaria.top`

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
        {/* Botão Flutuante de Auto-Scroll */}
        <div className="fixed bottom-6 right-6 z-50 no-print">
          <Button
            onClick={toggleAutoScroll}
            className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
              isAutoScroll
                ? "bg-red-600 hover:bg-red-700 text-white"
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
                      background: `linear-gradient(to right, #ec0909 0%, #ec0909 ${((scrollSpeed - 0.5) / 2.5) * 100}%, #d1d5db ${((scrollSpeed - 0.5) / 2.5) * 100}%, #d1d5db 100%)`,
                    }}
                  />
                  <span className="text-xs font-bold text-red-600">{scrollSpeed}x</span>
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
              Liturgia Diária - {format(selectedDate, "dd 'de' MMMM yyyy", { locale: ptBR })}
            </h1>
            {liturgiaData?.liturgia && (
              <div className="mt-2">
                <h2 className={`text-lg ${isDarkMode ? "text-gray-200" : "text-muted-foreground"}`}>
                  {liturgiaData.liturgia}
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

                  {/* Texto para anunciantes */}

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
                  Nenhuma liturgia encontrada para esta data.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rodapé com Créditos - Oculto durante auto-scroll */}
        {!isAutoScroll && (
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
          background: #ec0909;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #ec0909;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}
