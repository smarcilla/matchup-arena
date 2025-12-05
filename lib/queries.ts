import { prisma } from './prisma'

// Tipos exportados para uso en componentes
export type CompetitionWithMatchdays = Awaited<ReturnType<typeof getCompetitions>>[number]
export type MatchdayWithPlayers = Awaited<ReturnType<typeof getMatchdayWithPlayers>>
export type PlayerData = Awaited<ReturnType<typeof getPlayersByMatchday>>[number]

/**
 * Obtiene todas las competiciones con sus jornadas publicadas
 * Solo incluye jornadas con status "published"
 */
export async function getCompetitions() {
  const competitions = await prisma.competition.findMany({
    include: {
      matchdays: {
        where: {
          status: 'published',
        },
        orderBy: {
          matchday: 'desc',
        },
        take: 1, // Solo la última jornada publicada
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  // Filtrar solo competiciones que tienen al menos una jornada publicada
  return competitions.filter((c) => c.matchdays.length > 0)
}

/**
 * Obtiene una competición por su slug con la última jornada publicada
 */
export async function getCompetitionBySlug(slug: string) {
  return prisma.competition.findUnique({
    where: { slug },
    include: {
      matchdays: {
        where: {
          status: 'published',
        },
        orderBy: {
          matchday: 'desc',
        },
        take: 1,
        include: {
          players: {
            orderBy: {
              ranking: 'asc',
            },
          },
        },
      },
    },
  })
}

/**
 * Obtiene una jornada específica con sus jugadores
 */
export async function getMatchdayWithPlayers(matchdayId: string) {
  return prisma.matchday.findUnique({
    where: { id: matchdayId },
    include: {
      competition: true,
      players: {
        orderBy: {
          ranking: 'asc',
        },
      },
    },
  })
}

/**
 * Obtiene una jornada por competitionId y número de jornada
 */
export async function getMatchdayByCompetitionAndNumber(
  competitionId: string,
  matchdayNumber: number,
) {
  return prisma.matchday.findUnique({
    where: {
      competitionId_matchday: {
        competitionId,
        matchday: matchdayNumber,
      },
    },
    include: {
      competition: true,
      players: {
        orderBy: {
          ranking: 'asc',
        },
      },
    },
  })
}

/**
 * Obtiene los jugadores de una jornada ordenados por ranking
 * Este es el query principal para la mecánica del juego
 */
export async function getPlayersByMatchday(matchdayId: string) {
  return prisma.player.findMany({
    where: {
      matchdayId,
      // Solo jugadores válidos para el juego
      imageUploaded: true,
    },
    orderBy: {
      ranking: 'asc',
    },
    select: {
      id: true,
      name: true,
      image: true,
      ranking: true,
    },
  })
}

/**
 * Obtiene todas las competiciones con sus últimas jornadas publicadas
 * Formato optimizado para la página principal
 */
export async function getCompetitionsForHome() {
  const competitions = await prisma.competition.findMany({
    include: {
      matchdays: {
        where: {
          status: 'published',
        },
        orderBy: {
          matchday: 'desc',
        },
        take: 1,
        include: {
          _count: {
            select: { players: true },
          },
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  return competitions
    .filter((c) => c.matchdays.length > 0)
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      latestMatchday: c.matchdays[0]
        ? {
            id: c.matchdays[0].id,
            number: c.matchdays[0].matchday,
            playerCount: c.matchdays[0]._count.players,
          }
        : null,
    }))
}

/**
 * Obtiene los datos completos para la página de duelo
 */
export async function getDuelPageData(competitionSlug: string) {
  const competition = await prisma.competition.findUnique({
    where: { slug: competitionSlug },
    include: {
      matchdays: {
        where: {
          status: 'published',
        },
        orderBy: {
          matchday: 'desc',
        },
        take: 1,
        include: {
          players: {
            where: {
              imageUploaded: true,
            },
            orderBy: {
              ranking: 'asc',
            },
            select: {
              id: true,
              name: true,
              image: true,
              ranking: true,
            },
          },
        },
      },
    },
  })

  if (!competition || competition.matchdays.length === 0) {
    return null
  }

  const matchday = competition.matchdays[0]

  return {
    competition: {
      id: competition.id,
      name: competition.name,
      slug: competition.slug,
    },
    matchday: {
      id: matchday.id,
      number: matchday.matchday,
    },
    players: matchday.players,
  }
}
