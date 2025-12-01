'use client'

import Image from 'next/image'
import type { Player } from '@/store/gameStore'

type PlayerCardProps = {
  player: Player
  onSelect: (player: Player) => void
  disabled?: boolean
  status?: 'idle' | 'winner' | 'loser'
}

export default function PlayerCard({
  player,
  onSelect,
  disabled = false,
  status = 'idle',
}: PlayerCardProps) {
  const statusClasses = {
    idle: 'hover:scale-105 hover:shadow-2xl hover:border-blue-400',
    winner: 'animate-winner scale-105 border-green-500 shadow-green-200',
    loser: 'animate-loser scale-95 border-red-500 shadow-red-200',
  }

  const imageClasses = {
    idle: '',
    winner: 'brightness-110 contrast-105',
    loser: 'grayscale brightness-75',
  }

  return (
    <button
      onClick={() => onSelect(player)}
      disabled={disabled}
      className={`
        relative flex flex-col items-center p-6 bg-white rounded-2xl 
        border-4 shadow-xl transition-all duration-300 ease-out
        w-full max-w-xs mx-auto cursor-pointer
        ${statusClasses[status]}
        ${disabled && status === 'idle' ? 'cursor-not-allowed opacity-70' : ''}
      `}
    >
      {/* Player Image */}
      <div className="relative w-48 h-48 md:w-56 md:h-56 mb-4 rounded-xl overflow-hidden bg-gray-100">
        <Image
          src={player.image}
          alt={player.name}
          fill
          sizes="(max-width: 768px) 192px, 224px"
          className={`object-cover object-top transition-all duration-500 ${imageClasses[status]}`}
          priority
        />
      </div>

      {/* Player Name */}
      <h3
        className={`text-xl md:text-2xl font-bold text-center transition-colors duration-300 ${status === 'loser' ? 'text-gray-400' : 'text-gray-900'}`}
      >
        {player.name}
      </h3>

      {/* Status indicator */}
      {status === 'winner' && (
        <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-bounce">
          ¡Ganador!
        </div>
      )}
      {status === 'loser' && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Eliminado
        </div>
      )}
    </button>
  )
}
