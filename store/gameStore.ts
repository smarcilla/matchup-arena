import { create } from 'zustand'

export type Player = {
  name: string
  image: string
  ranking: number
}

type Competition = {
  name: string
  jornada: number
  players: Player[]
}

type DuelState = 'idle' | 'selecting' | 'animating' | 'finished'

export type DuelRecord = {
  round: number
  winner: Player
  loser: Player
}

type GameState = {
  selectedCompetition: Competition | null
  setSelectedCompetition: (competition: Competition | null) => void
  currentPlayers: Player[]
  setCurrentPlayers: (players: Player[]) => void
  // Duel state
  duelState: DuelState
  pendingPlayers: Player[]
  losers: Player[]
  leftPlayer: Player | null
  rightPlayer: Player | null
  mvp: Player | null
  duelHistory: DuelRecord[]
  // Duel actions
  initializeDuel: (players: Player[]) => void
  selectWinner: (winner: Player) => void
  advanceToNextDuel: () => void
  resetDuel: () => void
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const useGameStore = create<GameState>((set, get) => ({
  selectedCompetition: null,
  setSelectedCompetition: (competition) => set({ selectedCompetition: competition }),
  currentPlayers: [],
  setCurrentPlayers: (players) => set({ currentPlayers: players }),
  // Duel state
  duelState: 'idle',
  pendingPlayers: [],
  losers: [],
  leftPlayer: null,
  rightPlayer: null,
  mvp: null,
  duelHistory: [],

  initializeDuel: (players) => {
    const shuffled = shuffleArray(players)
    const [left, right, ...rest] = shuffled
    set({
      duelState: 'selecting',
      pendingPlayers: rest,
      losers: [],
      leftPlayer: left,
      rightPlayer: right,
      mvp: null,
      duelHistory: [],
    })
  },

  selectWinner: (winner) => {
    const { leftPlayer, rightPlayer, losers, duelHistory } = get()
    if (!leftPlayer || !rightPlayer) return

    const loser = winner === leftPlayer ? rightPlayer : leftPlayer
    const round = duelHistory.length + 1

    set({
      duelState: 'animating',
      losers: [...losers, loser],
      duelHistory: [...duelHistory, { round, winner, loser }],
    })
  },

  advanceToNextDuel: () => {
    const { pendingPlayers, leftPlayer, duelHistory } = get()

    // Get the winner from the last duel
    const lastDuel = duelHistory[duelHistory.length - 1]
    if (!lastDuel) return

    const winner = lastDuel.winner
    const winnerWasOnLeft = winner === leftPlayer

    if (pendingPlayers.length === 0) {
      // No more challengers - we have a winner!
      set({
        duelState: 'finished',
        mvp: winner,
        leftPlayer: null,
        rightPlayer: null,
      })
    } else {
      // Get next challenger - winner stays in their position
      const [nextChallenger, ...rest] = pendingPlayers
      set({
        duelState: 'selecting',
        leftPlayer: winnerWasOnLeft ? winner : nextChallenger,
        rightPlayer: winnerWasOnLeft ? nextChallenger : winner,
        pendingPlayers: rest,
      })
    }
  },

  resetDuel: () => {
    set({
      duelState: 'idle',
      pendingPlayers: [],
      losers: [],
      leftPlayer: null,
      rightPlayer: null,
      mvp: null,
      duelHistory: [],
    })
  },
}))
