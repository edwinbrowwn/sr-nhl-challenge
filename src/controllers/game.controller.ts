import { FastifyReply, FastifyRequest } from "fastify"
import { getGameService } from "../services/game.service"
import * as gameSchemas from '../schemas/game.schema'

export const getGames = async (req: FastifyRequest<{ Querystring: gameSchemas.GetGameInput }>, res: FastifyReply) => {
    try {
        const games = await getGameService(req.query)
        return res.code(200).send(games)
    } catch (err) {
        console.log(err)
        res.code(500).send(err)
    } 
}