import db from "../utils/prisma"
import * as teamSchemas from '../schemas/team.schema'

// TODO - Debug ts ignore lines
export const createTeamService = async (input: teamSchemas.jobTeamResponse) => {
    return await db.team.upsert({
        where: {
            // @ts-ignore
            leagueId: input.id
        },
        update: {
            name: input.name,
            // @ts-ignore
            updatedAt: new Date().toISOString()
        },
        // @ts-ignore
        create: {
            leagueId: input.id,
            name: input.name
            
        }
    })
}

export const getTeamsService = async () => {
    return await db.team.findMany()
}
