import { ArrowLeft, Book, Volume2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LeiturasPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:text-blue-200">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Leituras do Dia</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Primeira Leitura */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Book className="h-5 w-5 text-blue-600" />
                  <span>Primeira Leitura</span>
                </span>
                <Button variant="outline" size="sm">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Ouvir
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Apocalipse 4,1-11</p>
              <div className="prose max-w-none">
                <p className="mb-4">
                  Eu, João, tive uma visão: Vi uma porta aberta no céu, e a voz que eu tinha ouvido, como som de
                  trombeta, falando comigo, disse: "Sobe aqui, e eu te mostrarei o que deve acontecer depois destas
                  coisas."
                </p>
                <p className="mb-4">
                  Imediatamente fui arrebatado em espírito. Vi um trono colocado no céu, e alguém sentado no trono.
                  Aquele que estava sentado era semelhante, no aspecto, à pedra de jaspe e de sardônica...
                </p>
                <p className="text-sm italic text-gray-600 mt-4">Palavra do Senhor. — Graças a Deus.</p>
              </div>
            </CardContent>
          </Card>

          {/* Salmo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Book className="h-5 w-5 text-green-600" />
                  <span>Salmo Responsorial</span>
                </span>
                <Button variant="outline" size="sm">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Ouvir
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Salmo 150</p>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <p className="font-semibold text-green-800 text-center">
                  Santo, Santo, Santo é o Senhor Deus do universo!
                </p>
              </div>
              <div className="prose max-w-none">
                <p className="mb-2">Louvai o Senhor no seu templo santo,</p>
                <p className="mb-2">louvai-o no firmamento do seu poder!</p>
                <p className="mb-4">Louvai-o pelos seus feitos portentosos,</p>
                <p className="text-center font-semibold text-green-700 mb-4">
                  Santo, Santo, Santo é o Senhor Deus do universo!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Evangelho */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Book className="h-5 w-5 text-red-600" />
                  <span>Evangelho</span>
                </span>
                <Button variant="outline" size="sm">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Ouvir
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Lucas 19,11-28</p>
              <div className="prose max-w-none">
                <p className="mb-4">
                  Naquele tempo, Jesus contou uma parábola, porque estava perto de Jerusalém e eles pensavam que o Reino
                  de Deus ia aparecer imediatamente.
                </p>
                <p className="mb-4">
                  Disse então: "Um homem nobre partiu para uma região distante, a fim de tomar posse de um reino e
                  depois voltar. Chamou dez dos seus servos, deu a cada um uma moeda de ouro, e disse: 'Fazei-a render
                  até que eu volte.'"
                </p>
                <p className="text-sm italic text-gray-600 mt-4">Palavra da Salvação. — Glória a vós, Senhor.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
