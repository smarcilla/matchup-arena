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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  if (duelState === 'finished' && mvp) {
    return (
      <div className="text-center animate-fade-in">
        <div className="mb-6">
          <span className="inline-block bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-lg font-bold animate-pulse">
            🏆 ¡MVP Decidido! 🏆
          </span>
        </div>

        <div className="relative inline-block mb-8">
          <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto rounded-2xl overflow-hidden border-4 border-yellow-400 shadow-2xl shadow-yellow-200">
            <Image
              src={mvp.image}
              alt={mvp.name}
              fill
              sizes="(max-width: 768px) 256px, 320px"
              className="object-cover object-top"
              priority
            />
          </div>
          <div className="absolute -top-4 -right-4 text-6xl animate-bounce">🏆</div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{mvp.name}</h2>
        <p className="text-lg text-gray-600 mb-8">
          MVP de {competitionName} - Jornada {jornada}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => initializeDuel(players)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            🔄 Volver a jugar
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            ← Elegir otra competición
          </Link>
        </div>

        {/* Toggle history button */}
        <div className="mt-8">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-blue-600 hover:text-blue-800 font-medium underline"
          >
            {showHistory ? 'Ocultar historial de duelos' : 'Ver historial de duelos'}
          </button>
        </div>

        {/* Duel History */}
        {showHistory && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Historial de duelos</h3>
            <div className="space-y-3 max-w-md mx-auto">
              {duelHistory.map((duel) => (
                <div
                  key={duel.round}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-3 text-sm"
                >
                  <span className="text-gray-500 font-medium">Ronda {duel.round}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-semibold">{duel.winner.name}</span>
                    <span className="text-gray-400">vs</span>
                    <span className="text-red-400 line-through">{duel.loser.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>
            Duelo {completedDuels + 1} de {totalDuels}
          </span>
          <span>{pendingPlayers.length} restantes</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* VS Header */}
      <div className="text-center mb-4">
        <span className="inline-block bg-red-500 text-white px-6 py-2 rounded-full text-2xl font-bold shadow-lg">
          VS
        </span>
      </div>

      {/* Duel Cards */}
      {leftPlayer && rightPlayer && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Player (Top on mobile) */}
          <div className="flex flex-col items-center">
            <PlayerCard
              player={leftPlayer}
              onSelect={handleSelectWinner}
              disabled={duelState === 'animating'}
              status={getCardStatus(leftPlayer)}
            />
          </div>

          {/* Right Player (Bottom on mobile) */}
          <div className="flex flex-col items-center">
            <PlayerCard
              player={rightPlayer}
              onSelect={handleSelectWinner}
              disabled={duelState === 'animating'}
              status={getCardStatus(rightPlayer)}
            />
          </div>
        </div>
      )}

      {/* Instructions */}
      <p className="text-center text-gray-500 mt-8">
        Toca la tarjeta del jugador que consideres mejor para avanzar al siguiente duelo
      </p>
    </div>
  )
}
