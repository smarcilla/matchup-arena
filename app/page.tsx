import CompetitionCard from '@/components/CompetitionCard'
import { getCompetitionsForHome } from '@/lib/queries'

export default async function Home() {
  const competitions = await getCompetitionsForHome()

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">Matchup Arena</h1>
        <p className="text-center text-gray-600 mb-10">
          Decide quién fue el MVP de una competición en una jornada concreta
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Competiciones disponibles</h2>
        {competitions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No hay competiciones con jornadas publicadas disponibles.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {competitions.map((competition) => (
              <CompetitionCard
                key={competition.id}
                slug={competition.slug}
                name={competition.name}
                jornada={competition.latestMatchday?.number ?? 0}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
