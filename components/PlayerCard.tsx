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
    idle: 'hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,245,255,0.3)] active:scale-[0.98]',
    winner: 'animate-winner scale-[1.02] border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.5)]',
    loser: 'animate-loser scale-95 border-red-500/50 opacity-60',
  }

  const imageClasses = {
    idle: '',
    winner: 'brightness-110 contrast-105',
    loser: 'grayscale brightness-50',
  }

  const borderGradient = {
    idle: 'from-cyan-500 via-fuchsia-500 to-cyan-500',
    winner: 'from-green-400 via-green-500 to-green-400',
    loser: 'from-red-500/30 via-red-600/30 to-red-500/30',
  }

  return (
    <button
      onClick={() => onSelect(player)}
      disabled={disabled}
      className={`
        group relative flex flex-col items-center p-1 rounded-2xl 
        transition-all duration-300 ease-out
        w-full cursor-pointer
        ${statusClasses[status]}
        ${disabled && status === 'idle' ? 'cursor-not-allowed opacity-70' : ''}
      `}
    >
      {/* Gradient border wrapper */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${borderGradient[status]} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
      ></div>

      {/* Card content */}
      <div className="relative w-full bg-[var(--bg-secondary)] rounded-xl p-4 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)`,
            }}
          ></div>
        </div>

        {/* Shine sweep effect */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:left-[100%] transition-all duration-700 ease-out"></div>
        </div>

        {/* Player Image Container */}
        <div className="relative w-full aspect-[4/5] mb-3 rounded-xl overflow-hidden bg-gradient-to-b from-transparent to-black/40">
          {/* Diagonal clip mask effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10"></div>

          <Image
            src={player.image}
            alt={player.name}
            fill
            sizes="(max-width: 430px) 180px, 200px"
            className={`object-cover object-top transition-all duration-500 ${imageClasses[status]}`}
            priority
          />

          {/* Bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent"></div>
        </div>

        {/* Player Name */}
        <h3
          className={`text-lg font-bold text-center transition-colors duration-300 tracking-wide ${
            status === 'loser'
              ? 'text-gray-500'
              : status === 'winner'
                ? 'text-green-400 neon-text'
                : 'text-white'
          }`}
          style={
            status === 'winner'
              ? {
                  textShadow: '0 0 10px rgba(34, 197, 94, 0.8), 0 0 20px rgba(34, 197, 94, 0.5)',
                }
              : undefined
          }
        >
          {player.name}
        </h3>

        {/* Status indicators */}
        {status === 'winner' && (
          <div className="absolute top-3 right-3 animate-victory-burst">
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-green-500/50 flex items-center gap-1">
              <span>✓</span>
              <span>¡GANADOR!</span>
            </div>
          </div>
        )}
        {status === 'loser' && (
          <div className="absolute top-3 right-3">
            <div className="bg-red-500/80 text-white px-3 py-1 rounded-full text-xs font-bold">
              ELIMINADO
            </div>
          </div>
        )}

        {/* Corner accents for idle state */}
        {status === 'idle' && (
          <>
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-500/50 rounded-tl"></div>
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-fuchsia-500/50 rounded-tr"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-fuchsia-500/50 rounded-bl"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-500/50 rounded-br"></div>
          </>
        )}
      </div>
    </button>
  )
}
