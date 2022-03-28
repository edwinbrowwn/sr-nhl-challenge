import { PrismaClient } from '@prisma/client'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'

export type Context = {
    prisma: PrismaClient
}

export type MockContext = {
    prisma: DeepMockProxy<PrismaClient>
}

export const createMockContext = (): MockContext => {
    return {
        prisma: mockDeep<PrismaClient>(),
    }
}

type CreateTeam = {
    id: string,
    leagueId: number,
    name: string,
    createdAt: string,
    updatedAt: string
}
  
export async function createTeam(team: CreateTeam, ctx: Context) {
    if (team.leagueId) {
        return await ctx.prisma.team.create({
            data: {
                leagueId: team.leagueId,
                name: team.name
            }
        })

    } else {
        return new Error('Team must contain id')
    }
}
  
//   interface UpdateUser {
//     id: number
//     name: string
//     email: string
//   }
  
//   export async function updateUsername(user: UpdateUser, ctx: Context) {
//     return await ctx.prisma.team.update({
//       where: { id: user.id },
//       data: user,
//     })
//   }