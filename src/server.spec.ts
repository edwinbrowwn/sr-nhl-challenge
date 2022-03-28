import request from 'supertest'
import db from './utils/prisma'
import { MockContext, Context, createMockContext, createTeam } from './context'

const host = 'http://localhost:8000'

let mockCtx: MockContext
let ctx: Context

beforeEach(() => {
    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
})

describe('server checks', () => {
    it('server is created with valid health check', (done) => {
        request(host).get('/health').expect(200, done)
    })

    it('server should have game endpoint', async () => {
        await request(host).get('/api/v1/game/').expect(200).expect(response => {
            const body = JSON.parse(response.text)
            expect(Array.isArray(body.data)).toBe(true)
        })
    })

    it('database should find team data',async () => {
        const team = await db.team.findMany()
        const length = team.length > 0
        expect(length).toBe(true)
    })

    it('should create new team ', async () => {
        const date = new Date().toISOString()
        const team = {
            id: '123',
            leagueId: 1,
            name: 'Rich',
            createdAt: date,
            updatedAt: date
        }
        // @ts-ignore
        mockCtx.prisma.team.create.mockResolvedValue(team)
    
        await expect(createTeam(team, ctx)).resolves.toEqual({
            id: '123',
            leagueId: 1,
            name: 'Rich',
            createdAt: date,
            updatedAt: date
        })
    })

})
