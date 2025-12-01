import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './page'

test('renders the main heading Matchup Arena', () => {
  // Arrange
  // (no setup required for this simple component)

  // Act
  render(<Home />)

  // Assert
  const heading = screen.getByRole('heading', { name: /matchup arena/i })
  expect(heading).toHaveTextContent(/matchup arena/i)
})
