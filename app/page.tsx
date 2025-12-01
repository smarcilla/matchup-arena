import CompetitionCard from '@/components/CompetitionCard'
import matchesData from '@/context/data/matches_db.json'

export default function Home() {
  const { competitions } = matchesData

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">Matchup Arena</h1>
        <p className="text-center text-gray-600 mb-10">
          Decide quién fue el MVP de una competición en una jornada concreta
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Competiciones disponibles</h2>
        <div className="flex flex-col gap-4">
          {competitions.map((competition, index) => (
            <CompetitionCard
              key={index}
              id={index}
              name={competition.name}
              icon={competition.icon}
              jornada={competition.jornada}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
