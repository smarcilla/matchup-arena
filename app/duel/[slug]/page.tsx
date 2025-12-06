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
    <main className="min-h-screen flex flex-col">
      {/* Mini header */}
      <header className="px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-[var(--text-muted)] hover:text-cyan-400 transition-colors text-sm flex items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Volver
        </Link>
        <div className="text-right">
          <h1 className="text-sm font-semibold text-white">{data.competition.name}</h1>
          <p className="text-xs text-[var(--text-muted)]">Jornada {data.matchday.number}</p>
        </div>
      </header>

      {/* Duel Arena */}
      <div className="flex-1">
        <DuelArena
          players={players}
          competitionName={data.competition.name}
          jornada={data.matchday.number}
        />
      </div>
    </main>
  )
}
