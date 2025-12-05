import { test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock de las queries de Prisma
vi.mock('@/lib/queries', () => ({
  getCompetitionsForHome: vi.fn(() =>
    Promise.resolve([
      {
        id: 'test-1',
        name: 'Champions League',
        slug: 'champions-league',
        latestMatchday: {
          id: 'matchday-1',
          number: 5,
          playerCount: 8,
        },
      },
    ]),
  ),
}))

// Importar después del mock
import Home from './page'

beforeEach(() => {
  vi.clearAllMocks()
})

test('renders the main heading Matchup Arena', async () => {
  // Arrange
  // (no setup required for this simple component)

  // Act - Home es un Server Component async
  const HomeComponent = await Home()
  render(HomeComponent)

  // Assert
  const heading = screen.getByRole('heading', { name: /matchup arena/i })
  expect(heading).toHaveTextContent(/matchup arena/i)
})

test('renders competitions from database', async () => {
  // Act
  const HomeComponent = await Home()
  render(HomeComponent)

  // Assert - Debería mostrar la competición mockeada
  expect(screen.getByText('Champions League')).toBeInTheDocument()
  expect(screen.getByText('Jornada 5')).toBeInTheDocument()
})
