import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

export type jobTeamResponsePlayers = {
    person: {
        id: number
    }
}

export type jobTeamResponsePlayer = {
    id: number,
    fullName: string,
    currentAge: number,
    primaryNumber: string,
    primaryPosition: {
        code: string
    }
}

export type jobTeamResponse = {
    id: number,
    name: string,
    roster: {
        roster: jobTeamResponsePlayers[]
    }
}
