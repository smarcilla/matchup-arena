import { notFound } from 'next/navigation'
import Link from 'next/link'
import matchesData from '@/context/data/matches_db.json'

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
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
          ← Volver a competiciones
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">{competition.name}</h1>
        <p className="text-gray-600 mb-8">Jornada {competition.jornada}</p>

        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Próximamente: Sistema de duelos para elegir el MVP</p>
          <p className="text-sm text-gray-400 mt-2">
            {competition.players.length} jugadores participantes
          </p>
        </div>
      </div>
    </main>
  )
}
