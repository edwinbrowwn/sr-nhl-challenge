import db from '../utils/prisma'
import * as gameSchemas from '../schemas/game.schema'
import { paginateResponse } from "../utils/fortmat"

// TODO - Debug ts ignore lines

export const createGameService = async (input: gameSchemas.jobGameCreate) => {
    return await db.game.upsert({
        where: {
            // @ts-ignore
            leagueId: input.leagueId
        },
        update: {
            status: input.status,
            // @ts-ignore
            homeTeamScore: input.homeTeamScore,
            awayTeamScore: input.awayTeamScore,
            updatedAt: new Date().toISOString()
        },
        create: {
            // @ts-ignore
            leagueId: input.leagueId,
            gameType: input.gameType,
            season: input.season,
            gameDate: input.gameDate,
            status: input.status,
            homeTeamScore: input.homeTeamScore,
            awayTeamScore: input.awayTeamScore,
            homeTeamId: input.homeTeamId,
            awayTeamId: input.awayTeamId
        }
    })
}

export const getGameService = async (input: gameSchemas.GetGameInput) => {
    const page: number = input.page || 1
    const pageSize: number = input.pageSize || 10
    const skip: number = page > 1 ? (page - 1) * pageSize : 0

    const games = await db.game.findMany({
        where: {
            AND: [
                {id: input.id},
                {
                    status: {
                        equals: input.status,
                        mode: 'insensitive'
                    }
                }
            ]
        },
        orderBy: {
            gameDate: 'desc',
        },
        take: pageSize < 25 ? pageSize : 25,
        skip: skip,
        include: {
            gameAgg: input.stats !== undefined ? true : false,
            homeTeam: true,
            awayTeam: true
        }
    })

    return paginateResponse(page, pageSize, games)
}

export const createPlayerGameAggService = async (input: gameSchemas.jobPlayerGameAggCreate) => {
    const checkExists = await db.playerGameAgg.findMany({
        where: {
            // @ts-ignore
            AND: [
                {playerId: input.playerId},
                {gameId: input.gameId}
            ]
        }
    })

    if (checkExists.length === 0){
        return await db.playerGameAgg.create({
            // @ts-ignore
            data: {
                playerId: input.playerId,
                gameId: input.gameId,
                teamId: input.teamId,
                assists: input.assists,
                goals: input.goals,
                hits: input.hits,
                penaltyMin: input.penaltyMin,
                position: input.position,
            }
        })
    }

    return await db.playerGameAgg.update({
        where: {
            id: checkExists[0].id
        },
        data: {
            assists: input.assists,
            goals: input.goals,
            hits: input.hits,
            penaltyMin: input.penaltyMin,
            position: input.position,
            // @ts-ignore
            updatedAt: new Date().toISOString()
        }
    })
}