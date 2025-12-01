import { notFound } from 'next/navigation'
import Link from 'next/link'
import matchesData from '@/context/data/matches_db.json'
import DuelArena from '@/components/DuelArena'

type DuelPageProps = {
  params: Promise<{ id: string }>
}

export default async function DuelPage({ params }: DuelPageProps) {
  const { id } = await params
  const competitionIndex = parseInt(id, 10)
  const competition = matchesData.competitions[competitionIndex]

  if (!competition) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
          ← Volver a competiciones
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{competition.name}</h1>
          <p className="text-gray-600">Jornada {competition.jornada} - Elige tu MVP</p>
        </div>

        <DuelArena
          players={competition.players}
          competitionName={competition.name}
          jornada={competition.jornada}
        />
      </div>
    </main>
  )
}
