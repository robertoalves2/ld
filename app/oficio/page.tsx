"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, Share2, Calendar, BookOpen, Moon, Sunrise, Sunset } from "lucide-react"
import FeedAccordion from "@/components/feed-accordion"
import Footer from "@/components/footer"
import { Suspense } from "react"

interface OficioData {
  data: string
  tempo_liturgico: string
  cor_liturgica: string
  laudes: {
    antifona_inicial: string
    hino: string
    salmodia: Array<{
      salmo: string
      antifona: string
      texto: string
    }>
    cantico: {
      titulo: string
      antifona: string
      texto: string
    }
    leitura_breve: string
    responsorio: string
    cantico_zacarias: {
      antifona: string
      texto: string
    }
    oracao: string
  }
  vesperas: {
    antifona_inicial: string
    hino: string
    salmodia: Array<{
      salmo: string
      antifona: string
      texto: string
    }>
    cantico: {
      titulo: string
      antifona: string
      texto: string
    }
    leitura_breve: string
    responsorio: string
    cantico_maria: {
      antifona: string
      texto: string
    }
    oracao: string
  }
  completas: {
    antifona_inicial: string
    hino: string
    salmo: {
      numero: string
      antifona: string
      texto: string
    }
    leitura_breve: string
    responsorio: string
    cantico_simeao: {
      antifona: string
      texto: string
    }
    oracao: string
  }
}

// Define a interface para a estrutura de cada postagem
interface Post {
  title: string
  pubDate: string
  content: string
}

/**
 * Função para buscar e analisar os dados do feed RSS.
 * Esta função é executada no servidor.
 */
async function getFeedData(): Promise<Post[]> {
  try {
    // Usa a URL completa para produção
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://liturgiadiaria.top"
    const response = await fetch(`${baseUrl}/api/oficio-feed`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`)
    }

    const posts = await response.json()
    return posts
  } catch (error) {
    console.error("Falha ao buscar o feed:", error)
    return []
  }
}

/**
 * Componente principal da página.
 * Ele busca os dados do feed e os passa para o componente FeedAccordion.
 */
export default async function OficioPage() {
  const [oficioData, setOficioData] = useState<OficioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedHour, setSelectedHour] = useState<"laudes" | "vesperas" | "completas">("laudes")
  const [currentDate, setCurrentDate] = useState("")
  const posts = await getFeedData()

  useEffect(() => {
    const today = new Date()
    const formattedDate = today.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    setCurrentDate(formattedDate)

    const mockData: OficioData = {
      data: formattedDate,
      tempo_liturgico: "Tempo Comum",
      cor_liturgica: "Verde",
      laudes: {
        antifona_inicial: "Vinde, adoremos o Senhor, o grande Rei sobre todos os deuses.",
        hino: "Ó esplendor da glória eterna,\nÓ luz da luz e fonte do dia,\nÓ sol que iluminas o dia,\nVem iluminar os corações.",
        salmodia: [
          {
            salmo: "Salmo 62 (63), 2-9",
            antifona: "Minha alma tem sede de vós, ó Deus.",
            texto:
              "Ó Deus, vós sois o meu Deus, eu vos procuro,\nminha alma tem sede de vós;\nminha carne vos deseja ardentemente,\ncomo terra árida, sedenta, sem água.\n\nAssim eu vos contemplo no santuário,\npara ver vossa força e vossa glória.\nSim, vosso amor vale mais que a vida,\ne meus lábios haverão de vos louvar.",
          },
        ],
        cantico: {
          titulo: "Cântico de Daniel 3, 52-57",
          antifona: "Louvai e exaltai o Senhor pelos séculos.",
          texto:
            "Bendito sois, Senhor, Deus de Israel,\nlouvado e exaltado pelos séculos!\nBendito o vosso nome santo e glorioso,\nlouvado e exaltado pelos séculos!",
        },
        leitura_breve: "Despertai, vós que dormis, levantai-vos dentre os mortos, e Cristo vos iluminará. (Ef 5, 14)",
        responsorio:
          "℣. Cristo, Filho do Deus vivo, tende piedade de nós.\n℟. Cristo, Filho do Deus vivo, tende piedade de nós.",
        cantico_zacarias: {
          antifona: "O Oriente do alto nos visitou para iluminar os que jazem nas trevas.",
          texto:
            "Bendito seja o Senhor, Deus de Israel,\nque visitou e redimiu o seu povo,\ne nos suscitou uma força de salvação\nna casa de Davi, seu servo.",
        },
        oracao:
          "Ó Deus, que fizestes brilhar sobre nós a luz do novo dia, concedei-nos que, durante este dia, não caiamos em pecado algum, mas que nossas palavras, pensamentos e ações estejam sempre dirigidos para o cumprimento da vossa vontade. Por Cristo, nosso Senhor.",
      },
      vesperas: {
        antifona_inicial: "Vinde, adoremos o Senhor, porque ele é o nosso Deus.",
        hino: "Ó luz radiosa da luz eterna,\nJesus Cristo, nosso Salvador,\nao declinar do sol no horizonte,\ncantamos hinos ao Pai, ao Filho e ao Espírito Santo.",
        salmodia: [
          {
            salmo: "Salmo 140 (141), 1-9",
            antifona: "Suba minha oração como incenso à vossa presença.",
            texto:
              "Senhor, eu vos invoco, vinde depressa!\nEscutai minha voz quando vos chamo!\nSuba minha oração como incenso à vossa presença,\ne minhas mãos erguidas, como oferenda da tarde.",
          },
        ],
        cantico: {
          titulo: "Cântico do Apocalipse 19, 1-7",
          antifona: "Aleluia! Salvação, glória e poder ao nosso Deus!",
          texto:
            "Aleluia!\nSalvação, glória e poder ao nosso Deus,\nporque verdadeiros e justos são os seus juízos!\nAleluia!\nLouvai o nosso Deus, vós todos os seus servos!",
        },
        leitura_breve:
          "Sede sóbrios e vigiai. Vosso adversário, o demônio, anda ao redor como leão que ruge, procurando a quem devorar. (1Pd 5, 8)",
        responsorio: "℣. As minhas palavras, Senhor, escutai com bondade.\n℟. Atendei ao grito do meu apelo.",
        cantico_maria: {
          antifona: "O Senhor fez em mim maravilhas, santo é o seu nome.",
          texto:
            "Minha alma engrandece ao Senhor,\ne meu espírito exulta em Deus, meu Salvador,\nporque olhou para a humildade de sua serva.\nDoravante todas as gerações me chamarão bem-aventurada.",
        },
        oracao:
          "Ó Deus, que no fim deste dia nos concedeis o descanso reparador, fazei que o repouso do corpo seja também refrigério da alma, para que sempre sejamos fortalecidos pela vossa proteção. Por Cristo, nosso Senhor.",
      },
      completas: {
        antifona_inicial: "O nosso auxílio está no nome do Senhor, que fez o céu e a terra.",
        hino: "Antes que a luz se desvaneça,\nte pedimos, ó Criador,\nque sejas nosso protetor\ne nosso guarda por clemência.",
        salmo: {
          numero: "Salmo 90 (91)",
          antifona: "Aquele que habita sob a proteção do Altíssimo descansa à sombra do Onipotente.",
          texto:
            "Aquele que habita sob a proteção do Altíssimo\ndescansa à sombra do Onipotente.\nEu digo ao Senhor: 'Vós sois meu refúgio,\nminha fortaleza, meu Deus, em quem confio!'",
        },
        leitura_breve: "Vós, Senhor, nos guardareis e nos preservareis desta geração para sempre. (Sl 11, 8)",
        responsorio:
          "℣. Em vossas mãos, Senhor, entrego meu espírito.\n℟. Em vossas mãos, Senhor, entrego meu espírito.",
        cantico_simeao: {
          antifona: "Salvai-nos, Senhor, enquanto velamos; guardai-nos enquanto dormimos.",
          texto:
            "Agora, Senhor, deixai vosso servo partir em paz,\nsegundo a vossa palavra,\nporque meus olhos viram a vossa salvação,\nque preparastes diante de todos os povos.",
        },
        oracao:
          "Visitai, Senhor, esta habitação e afastai dela todas as ciladas do inimigo; que vossos santos anjos nela habitem para nos guardar em paz, e que a vossa bênção permaneça sempre conosco. Por Cristo, nosso Senhor.",
      },
    }

    setTimeout(() => {
      setOficioData(mockData)
      setLoading(false)
    }, 1000)
  }, [])

  const compartilhar = () => {
    if (!oficioData) return

    const currentHourData = oficioData[selectedHour]
    let hourName = ""
    let hourIcon = ""

    switch (selectedHour) {
      case "laudes":
        hourName = "Laudes"
        hourIcon = "🌅"
        break
      case "vesperas":
        hourName = "Vésperas"
        hourIcon = "🌆"
        break
      case "completas":
        hourName = "Completas"
        hourIcon = "🌙"
        break
    }

    const texto = `${hourIcon} *${hourName}* - ${oficioData.data}

*Antífona Inicial:*
${currentHourData.antifona_inicial}

*Hino:*
${currentHourData.hino}

*Oração:*
${currentHourData.oracao}

---
🙏 Liturgia das Horas - liturgiadiaria.top/oficio`

    if (navigator.share) {
      navigator.share({
        title: `${hourName} - ${oficioData.data}`,
        text: texto,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(texto)
      alert("Conteúdo copiado para a área de transferência!")
    }
  }

  const getHourIcon = (hour: string) => {
    switch (hour) {
      case "laudes":
        return <Sunrise className="w-5 h-5" />
      case "vesperas":
        return <Sunset className="w-5 h-5" />
      case "completas":
        return <Moon className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const getHourName = (hour: string) => {
    switch (hour) {
      case "laudes":
        return "Laudes"
      case "vesperas":
        return "Vésperas"
      case "completas":
        return "Completas"
      default:
        return hour
    }
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12 bg-gray-50">
        <div className="w-full max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800">Ofício Divino</h1>
          </header>

          {loading ? (
            <div className="text-center text-gray-600 py-8">Carregando Ofício Divino...</div>
          ) : (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50">
              <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <BookOpen className="w-8 h-8 text-purple-600" />
                    <h1 className="text-4xl font-bold text-gray-800">Ofício Divino</h1>
                  </div>
                  <p className="text-lg text-gray-600 mb-2">Liturgia das Horas</p>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{currentDate}</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Tempo Comum
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Cor: Verde
                    </Badge>
                  </div>
                </div>

                {/* Hour Selection */}
                <div className="flex justify-center mb-8">
                  <div className="flex bg-white rounded-lg shadow-md p-1">
                    {(["laudes", "vesperas", "completas"] as const).map((hour) => (
                      <Button
                        key={hour}
                        variant={selectedHour === hour ? "default" : "ghost"}
                        onClick={() => setSelectedHour(hour)}
                        className={`flex items-center gap-2 px-6 py-2 ${
                          selectedHour === hour ? "bg-purple-600 text-white" : "text-gray-600 hover:text-purple-600"
                        }`}
                      >
                        {getHourIcon(hour)}
                        {getHourName(hour)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Share Button */}
                <div className="flex justify-center mb-8">
                  <Button
                    onClick={compartilhar}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Compartilhar {getHourName(selectedHour)}
                  </Button>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Antífona Inicial */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-purple-700">Antífona Inicial</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed italic">
                        {oficioData[selectedHour].antifona_inicial}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Hino */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-purple-700">Hino</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                        {oficioData[selectedHour].hino}
                      </pre>
                    </CardContent>
                  </Card>

                  {/* Salmodia */}
                  {selectedHour !== "completas" && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-purple-700">Salmodia</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {oficioData[selectedHour].salmodia.map((salmo, index) => (
                          <div key={index}>
                            <h4 className="font-semibold text-gray-800 mb-2">{salmo.salmo}</h4>
                            <p className="text-sm text-purple-600 italic mb-2">Ant.: {salmo.antifona}</p>
                            <pre className="text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                              {salmo.texto}
                            </pre>
                            {index < oficioData[selectedHour].salmodia.length - 1 && <Separator className="mt-4" />}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Salmo (para Completas) */}
                  {selectedHour === "completas" && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-purple-700">{oficioData[selectedHour].salmo.numero}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-purple-600 italic mb-4">
                          Ant.: {oficioData[selectedHour].salmo.antifona}
                        </p>
                        <pre className="text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                          {oficioData[selectedHour].salmo.texto}
                        </pre>
                      </CardContent>
                    </Card>
                  )}

                  {/* Cântico */}
                  {selectedHour !== "completas" && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-purple-700">{oficioData[selectedHour].cantico.titulo}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-purple-600 italic mb-4">
                          Ant.: {oficioData[selectedHour].cantico.antifona}
                        </p>
                        <pre className="text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                          {oficioData[selectedHour].cantico.texto}
                        </pre>
                      </CardContent>
                    </Card>
                  )}

                  {/* Leitura Breve */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-purple-700">Leitura Breve</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{oficioData[selectedHour].leitura_breve}</p>
                    </CardContent>
                  </Card>

                  {/* Responsório */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-purple-700">Responsório</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                        {oficioData[selectedHour].responsorio}
                      </pre>
                    </CardContent>
                  </Card>

                  {/* Cântico Evangélico */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-purple-700">
                        {selectedHour === "laudes" && "Cântico de Zacarias"}
                        {selectedHour === "vesperas" && "Cântico de Maria"}
                        {selectedHour === "completas" && "Cântico de Simeão"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-purple-600 italic mb-4">
                        Ant.:{" "}
                        {selectedHour === "laudes"
                          ? oficioData[selectedHour].cantico_zacarias.antifona
                          : selectedHour === "vesperas"
                            ? oficioData[selectedHour].cantico_maria.antifona
                            : oficioData[selectedHour].cantico_simeao.antifona}
                      </p>
                      <pre className="text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                        {selectedHour === "laudes"
                          ? oficioData[selectedHour].cantico_zacarias.texto
                          : selectedHour === "vesperas"
                            ? oficioData[selectedHour].cantico_maria.texto
                            : oficioData[selectedHour].cantico_simeao.texto}
                      </pre>
                    </CardContent>
                  </Card>

                  {/* Oração */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-purple-700">Oração</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{oficioData[selectedHour].oracao}</p>
                      <p className="text-gray-600 mt-4 text-sm">℟. Amém.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

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
