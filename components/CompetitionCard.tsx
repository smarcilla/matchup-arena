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
      className="flex items-center gap-4 p-4 md:p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
    >
      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl md:text-2xl font-bold">
        {name.charAt(0)}
      </div>
      <div>
        <h3 className="text-lg md:text-xl font-semibold text-gray-900">{name}</h3>
        <p className="text-gray-600 mt-1">Jornada {jornada}</p>
      </div>
    </Link>
  )
}
