import fastify from 'fastify'
import Routes from './routes'
import Schemas from './schemas'
import jobs from './jobs'

const server = fastify()

server.get('/health', async () => {
    // TODO - Add db connected HC
    return { status: 'ok' }
})

export const app = async () => {

    for (const schema of Schemas.gameSchemas) {
        server.addSchema(schema)
    }

    server.register(Routes.gameRoutes, { prefix: 'api/v1/game/' })

    try {
        server.addHook('onReady', () => {
            jobs.start();
        })
    
        server.addHook('onClose', () => {
            jobs.stop();
        })

        await server.listen(8000, '0.0.0.0')
        console.log('Server listening at http://localhost:8000')
    } catch (err) {
        console.error(err)
        process.exit(1)
    }

    return server
}

app()
