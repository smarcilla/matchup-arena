'use client'

import Link from 'next/link'

type CompetitionCardProps = {
  slug: string
  name: string
  jornada: number
}

export default function CompetitionCard({ slug, name, jornada }: CompetitionCardProps) {
  return (
    <Link
      href={`/duel/${slug}`}
      className="group glass glass-hover shine-effect flex items-center gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
    >
      {/* Icono/escudo con gradiente */}
      <div className="relative w-14 h-14 bg-gradient-to-br from-cyan-400 to-fuchsia-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow duration-300">
        {name.charAt(0)}
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300"></div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-white truncate group-hover:text-cyan-300 transition-colors duration-300">
          {name}
        </h3>
        <p className="text-[var(--text-muted)] text-sm flex items-center gap-2 mt-0.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
          Jornada {jornada}
        </p>
      </div>

      {/* Flecha indicadora */}
      <div className="text-[var(--text-muted)] group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </Link>
  )
}
