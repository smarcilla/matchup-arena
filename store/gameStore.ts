import { create } from 'zustand'

type Player = {
  name: string
  image: string
  ranking: number
}

type Competition = {
  name: string
  jornada: number
  players: Player[]
}

type GameState = {
  selectedCompetition: Competition | null
  setSelectedCompetition: (competition: Competition | null) => void
  currentPlayers: Player[]
  setCurrentPlayers: (players: Player[]) => void
}

export const useGameStore = create<GameState>((set) => ({
  selectedCompetition: null,
  setSelectedCompetition: (competition) => set({ selectedCompetition: competition }),
  currentPlayers: [],
  setCurrentPlayers: (players) => set({ currentPlayers: players }),
}))
