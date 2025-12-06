'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PlayerCard from './PlayerCard'
import { useGameStore, type Player } from '@/store/gameStore'

type DuelArenaProps = {
  players: Player[]
  competitionName: string
  jornada: number
}

// Pre-generate confetti particle data to avoid Math.random during render
const CONFETTI_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i * 5 + ((i * 7) % 13) * 3) % 100}%`,
  color: ['#ffd700', '#ff00ff', '#00f5ff', '#22c55e'][i % 4],
  duration: 2 + (i % 3),
  delay: (i % 5) * 0.4,
}))

export default function DuelArena({ players, competitionName, jornada }: DuelArenaProps) {
  const {
    duelState,
    leftPlayer,
    rightPlayer,
    pendingPlayers,
    losers,
    mvp,
    duelHistory,
    initializeDuel,
    selectWinner,
    advanceToNextDuel,
    resetDuel,
  } = useGameStore()

  const [selectedWinner, setSelectedWinner] = useState<Player | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  // Initialize duel when component mounts
  useEffect(() => {
    initializeDuel(players)
    return () => resetDuel()
  }, [players, initializeDuel, resetDuel])

  // Handle winner selection with animation delay
  const handleSelectWinner = (winner: Player) => {
    if (duelState !== 'selecting') return

    setSelectedWinner(winner)
    selectWinner(winner)

    // Wait for animation then advance
    setTimeout(() => {
      setSelectedWinner(null)
      advanceToNextDuel()
    }, 1500)
  }

  // Get card status based on selection
  const getCardStatus = (player: Player): 'idle' | 'winner' | 'loser' => {
    if (duelState !== 'animating' || !selectedWinner) return 'idle'
    return player === selectedWinner ? 'winner' : 'loser'
  }

  // Progress calculation
  const totalDuels = players.length - 1
  const completedDuels = losers.length
  const progress = totalDuels > 0 ? (completedDuels / totalDuels) * 100 : 0

  if (duelState === 'idle') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-cyan-500 border-t-transparent"></div>
          <div className="absolute inset-0 rounded-full blur-md bg-cyan-500/30 animate-pulse"></div>
        </div>
      </div>
    )
  }

  // MVP Victory Screen
  if (duelState === 'finished' && mvp) {
    return (
      <div className="text-center animate-fade-in min-h-[80vh] flex flex-col justify-center relative overflow-hidden">
        {/* Background light rays */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] opacity-20 animate-light-rays">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent blur-3xl"></div>
          </div>
        </div>

        {/* Confetti particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {CONFETTI_PARTICLES.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: particle.left,
                top: '-20px',
                backgroundColor: particle.color,
                animation: `confetti-fall ${particle.duration}s linear ${particle.delay}s infinite`,
              }}
            />
          ))}
        </div>

        {/* MVP Badge */}
        <div className="mb-6 animate-victory-burst relative z-10">
          <span className="inline-block bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-yellow-900 px-6 py-2 rounded-full text-xl font-bold shadow-lg shadow-yellow-500/50">
            🏆 ¡MVP DECIDIDO! 🏆
          </span>
        </div>

        {/* MVP Card */}
        <div className="relative inline-block mb-6 mx-auto animate-float">
          {/* Glow effect behind */}
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/50 to-yellow-600/30 blur-3xl scale-125 rounded-full"></div>

          {/* Card frame */}
          <div className="relative p-1 rounded-2xl bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-600 shadow-2xl shadow-yellow-500/30">
            <div className="relative w-56 h-72 md:w-64 md:h-80 rounded-xl overflow-hidden bg-[var(--bg-secondary)]">
              <Image
                src={mvp.image}
                alt={mvp.name}
                fill
                sizes="(max-width: 768px) 224px, 256px"
                className="object-cover object-top"
                priority
              />
              {/* Bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent"></div>

              {/* MVP name overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                <h2
                  className="text-2xl font-bold text-white drop-shadow-lg"
                  style={{
                    textShadow: '0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.5)',
                  }}
                >
                  {mvp.name}
                </h2>
              </div>
            </div>
          </div>

          {/* Trophy badge */}
          <div className="absolute -top-4 -right-4 text-5xl animate-bounce drop-shadow-lg">🏆</div>
        </div>

        <p className="text-[var(--text-secondary)] mb-8 relative z-10">
          MVP de {competitionName} - Jornada {jornada}
        </p>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 px-4 relative z-10">
          <button
            onClick={() => initializeDuel(players)}
            className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/30"
          >
            🔄 Volver a jugar
          </button>
          <Link
            href="/"
            className="w-full px-6 py-4 glass glass-hover text-white rounded-xl font-semibold text-center transition-all"
          >
            ← Elegir otra competición
          </Link>
        </div>

        {/* Toggle history button */}
        <div className="mt-8 relative z-10">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-4 transition-colors"
          >
            {showHistory ? 'Ocultar historial' : 'Ver historial de duelos'}
          </button>
        </div>

        {/* Duel History */}
        {showHistory && (
          <div className="mt-6 pt-6 border-t border-white/10 relative z-10">
            <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">Historial</h3>
            <div className="space-y-2 max-w-md mx-auto px-4">
              {duelHistory.map((duel) => (
                <div
                  key={duel.round}
                  className="flex items-center justify-between glass rounded-lg p-3 text-sm"
                >
                  <span className="text-[var(--text-muted)] font-mono">R{duel.round}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-semibold">{duel.winner.name}</span>
                    <span className="text-[var(--text-muted)]">vs</span>
                    <span className="text-red-400/60 line-through">{duel.loser.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Duel View - Layout vertical optimizado
  return (
    <div className="flex flex-col min-h-[85vh] relative">
      {/* Progress bar - Minimal neón style */}
      <div className="px-4 py-3">
        <div className="flex justify-between text-xs text-[var(--text-muted)] mb-2 font-mono">
          <span>
            DUELO {completedDuels + 1}/{totalDuels}
          </span>
          <span>{pendingPlayers.length} restantes</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 transition-all duration-500 shadow-[0_0_10px_rgba(0,245,255,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Duel Cards - Layout vertical */}
      {leftPlayer && rightPlayer && (
        <div className="flex-1 flex flex-col px-4 gap-3">
          {/* Top Player Card */}
          <div className="flex-1 flex items-center justify-center animate-slide-in-left">
            <div className="w-full max-w-[280px]">
              <PlayerCard
                player={leftPlayer}
                onSelect={handleSelectWinner}
                disabled={duelState === 'animating'}
                status={getCardStatus(leftPlayer)}
              />
            </div>
          </div>

          {/* VS Badge - Épico con energía */}
          <div className="flex items-center justify-center py-2">
            <div className="relative">
              {/* Energy glow behind */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 blur-xl opacity-60 scale-150 animate-vs-pulse"></div>

              {/* VS Badge */}
              <div className="relative bg-gradient-to-b from-red-500 via-red-600 to-red-700 px-8 py-3 rounded-full animate-vs-pulse shadow-lg shadow-red-500/50">
                <span
                  className="text-3xl font-black text-white tracking-widest drop-shadow-lg"
                  style={{
                    textShadow: '0 0 10px rgba(255, 100, 50, 0.8), 0 2px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  VS
                </span>
              </div>

              {/* Energy lines */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-16 h-0.5 bg-gradient-to-r from-transparent to-red-500 opacity-50"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-16 h-0.5 bg-gradient-to-l from-transparent to-red-500 opacity-50"></div>
            </div>
          </div>

          {/* Bottom Player Card */}
          <div className="flex-1 flex items-center justify-center animate-slide-in-right">
            <div className="w-full max-w-[280px]">
              <PlayerCard
                player={rightPlayer}
                onSelect={handleSelectWinner}
                disabled={duelState === 'animating'}
                status={getCardStatus(rightPlayer)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <p className="text-center text-[var(--text-muted)] text-sm py-4 px-4">
        Toca al jugador que consideres mejor
      </p>
    </div>
  )
}
