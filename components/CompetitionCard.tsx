'use client'

import Image from 'next/image'
import Link from 'next/link'

type CompetitionCardProps = {
  id: number
  name: string
  icon: string
  jornada: number
}

export default function CompetitionCard({ id, name, icon, jornada }: CompetitionCardProps) {
  return (
    <Link
      href={`/duel/${id}`}
      className="flex items-center gap-4 p-4 md:p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
    >
      <Image
        src={icon}
        alt={`${name} icon`}
        width={64}
        height={64}
        className="w-12 h-12 md:w-16 md:h-16 object-contain"
      />
      <div>
        <h3 className="text-lg md:text-xl font-semibold text-gray-900">{name}</h3>
        <p className="text-gray-600 mt-1">Jornada {jornada}</p>
      </div>
    </Link>
  )
}
