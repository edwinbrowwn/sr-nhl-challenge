import { FastifyInstance } from "fastify"
import * as gameController from '../controllers/game.controller'
import { $ref } from '../schemas/game.schema'

const gameRoutes = async (server: FastifyInstance) => {
    // TODO - Get by season/date
    // Get - Get games
    server.get('/', { schema: {
        querystring: $ref('getGameSchema')
    }},
    gameController.getGames)

}

export default gameRoutes