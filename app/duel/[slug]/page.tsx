import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDuelPageData } from '@/lib/queries'
import DuelArena from '@/components/DuelArena'

type DuelPageProps = {
  params: Promise<{ slug: string }>
}

export default async function DuelPage({ params }: DuelPageProps) {
  const { slug } = await params
  const data = await getDuelPageData(slug)

  if (!data || data.players.length === 0) {
    notFound()
  }

  // Transformar los jugadores al formato esperado por DuelArena
  const players = data.players.map((player) => ({
    name: player.name,
    image: player.image,
    ranking: player.ranking,
  }))

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
          ← Volver a competiciones
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.competition.name}</h1>
          <p className="text-gray-600">Jornada {data.matchday.number} - Elige tu MVP</p>
        </div>

        <DuelArena
          players={players}
          competitionName={data.competition.name}
          jornada={data.matchday.number}
        />
      </div>
    </main>
  )
}
