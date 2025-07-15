import { Suspense } from "react"
import { fetchLectioDivina } from "@/lib/lectio-parser"
import LectioDivinaClient from "./lectio-divina-client"

interface LectioPageProps {
  searchParams: {
    date?: string
  }
}

export const metadata = {
  title: "Lectio Divina - Liturgia Diária Católica",
  description: "Lectio Divina do Evangelho do Dia. Ideal para orações diárias e reflexão católica.",
  keywords:
    "liturgia diária, liturgia da diária, evangelho do dia, evangelho de hoje, liturgia de hoje, evangelho dia, evangelho, lectio divina, evangelho do dia de hoje, o evangelho de hoje, liturgia diaria hoje, liturgia diária hoje, liturgia diaria de hoje, divina lectio, divino lectio, evangelho de hoje do dia, evangelho dia de hoje, liturgia do dia de hoje, evangelho do dia comentado, liturgia diária comentada, o evangelho do dia, lectio divina de hoje, evangelho hoje, evangelho do lar",
  alternates: {
    canonical: "https://liturgiadiaria.top/lectio",
  },
  openGraph: {
    title: "Lectio Divina - Liturgia Diária Católica",
    description: "Lectio Divina do Evangelho do Dia. Ideal para orações diárias e reflexão católica.",
    url: "https://liturgiadiaria.top/lectio",
    images: [
      {
        url: "/liturgia-icon.webp",
        width: 1200,
        height: 630,
        alt: "Lectio Divina Liturgia Diária",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lectio Divina - Liturgia Diária Católica",
    description: "Lectio Divina do Evangelho do Dia. Ideal para orações diárias e reflexão católica.",
    images: ["/liturgia-icon.webp"],
  },
}

export default async function LectioPage({ searchParams }: LectioPageProps) {
  const dateParam = searchParams.date
  let selectedDate: Date

  if (dateParam) {
    try {
      selectedDate = new Date(dateParam)
      if (isNaN(selectedDate.getTime())) {
        selectedDate = new Date()
      }
    } catch (e) {
      selectedDate = new Date()
    }
  } else {
    selectedDate = new Date()
  }

  const initialData = await fetchLectioDivina(selectedDate)

  return (
    <Suspense fallback={<div>Carregando Lectio Divina...</div>}>
      <LectioDivinaClient initialData={initialData} initialDate={selectedDate.toISOString()} />
    </Suspense>
  )
}
