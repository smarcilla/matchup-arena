import { create } from 'zustand'

type Player = {
  id: string
  name: string
}

type GameState = {
  currentPlayers: Player[]
  setCurrentPlayers: (players: Player[]) => void
}

export const useGameStore = create<GameState>((set) => ({
  currentPlayers: [],
  setCurrentPlayers: (players) => set({ currentPlayers: players }),
}))
