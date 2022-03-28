import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const getGameSchema = z.object({
    page: z.number({ invalid_type_error: "Page must be a number" }),
    pageSize: z.number({ invalid_type_error: "PageSize must be a number" }).lt(25),
    season: z.string(),
    status: z.string(),
    stats: z.string(),
    id: z.string()
}).partial()

type jobGameResponseTeams = {
    score: number,
    team: {
        id: number,
        name: string 
    }
}

type jobGameStatsResponseTeams = {
    players: object
}

export type jobGameResponse = {
    gamePk: number,
    gameType: string,
    season: string,
    gameDate: string,
    status: {
        abstractGameState: string
    },
    teams: {
        away: jobGameResponseTeams,
        home: jobGameResponseTeams
    }
}

export type jobGameStatsResponse = {
    teams: {
        away: jobGameStatsResponseTeams,
        home: jobGameStatsResponseTeams
    }
}

export type jobGameStatsResponsePlayer = {
    position: {
        code: string
    },
    stats: {
        skaterStats: {
            assists: number,
            goals: number,
            hits: number,
            penaltyMinutes: number
        }
    }
}

export type jobGameCreate = {
    leagueId: number,
    gameType: string,
    season: string,
    gameDate: string,
    status: string,
    homeTeamId: string,
    awayTeamId: string,
    homeTeamScore: number,
    awayTeamScore: number
}

export type jobPlayerGameAggCreate = {
    playerId: string,
    gameId: string,
    teamId: string,
    assists: number,
    goals: number,
    hits: number,
    penaltyMin: number,
    position: string
}

export type GetGameInput = z.infer<typeof getGameSchema>

export const { schemas: gameSchemas, $ref } = buildJsonSchemas({
    getGameSchema
})
