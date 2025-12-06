import CompetitionCard from '@/components/CompetitionCard'
import { getCompetitionsForHome } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const competitions = await getCompetitionsForHome()

  return (
    <main className="min-h-screen py-8 px-4 flex flex-col">
      {/* Header con efecto glow */}
      <header className="text-center mb-10 pt-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 animate-title-glow tracking-tight">
          MATCHUP
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
            ARENA
          </span>
        </h1>
        <p className="text-[var(--text-secondary)] text-sm md:text-base max-w-xs mx-auto">
          Decide quién fue el MVP de una competición en una jornada concreta
        </p>
      </header>

      {/* Competition Cards */}
      <section className="flex-1">
        <h2 className="text-lg font-semibold text-[var(--text-secondary)] mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-gradient-to-b from-cyan-400 to-fuchsia-500 rounded-full"></span>
          Competiciones disponibles
        </h2>

        {competitions.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center">
            <p className="text-[var(--text-muted)]">
              No hay competiciones con jornadas publicadas disponibles.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {competitions.map((competition, index) => (
              <div
                key={competition.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CompetitionCard
                  slug={competition.slug}
                  name={competition.name}
                  jornada={competition.latestMatchday?.number ?? 0}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer decorativo */}
      <footer className="mt-auto pt-8 pb-4 text-center">
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto opacity-50"></div>
      </footer>
    </main>
  )
}
