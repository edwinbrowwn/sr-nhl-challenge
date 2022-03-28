import db from '../utils/prisma'
import * as teamSchemas from '../schemas/team.schema'

// TODO - Debug ts ignore lines
export const createPlayerService = async (input: teamSchemas.jobTeamResponsePlayer, teamId: string) => {
    const number = input.primaryNumber ? parseInt(input.primaryNumber) : null

    return await db.player.upsert({
        where: {
            // @ts-ignore
            leagueId: input.id
        },
        update: {
            name: input.fullName,
            age: input.currentAge,
            number: number,
            // @ts-ignore
            teamId: teamId,
            // @ts-ignore
            position: input.primaryPosition.code,
            updatedAt: new Date().toISOString()
        },
        create: {
            leagueId: input.id,
            name: input.fullName,
            age: input.currentAge,
            number: number,
            // @ts-ignore
            teamId: teamId,
            // @ts-ignore
            position: input.primaryPosition.code
        }
    })
}

export const getPlayersService = async () => {
    return await db.player.findMany()
}
