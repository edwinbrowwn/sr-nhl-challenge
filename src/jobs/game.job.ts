import axios from 'axios'
import db from '../utils/prisma'
db.$connect()
import { jobGameResponse, jobGameCreate, jobGameStatsResponsePlayer } from '../schemas/game.schema'
import { getTeamsService } from '../services/team.service'
import { createGameService, createPlayerGameAggService } from '../services/game.service'
import { getPlayersService } from '../services/player.service'

const updatePlayerGameAggregate = async (games: { id: string, leagueId: number }[]) => {
    const players = await getPlayersService()

    await Promise.all(games.map(async game => {
        const gameStats = await axios.get(`https://statsapi.web.nhl.com/api/v1/game/${game.leagueId}/boxscore`)
        const allPlayerStats = Object.assign(gameStats.data.teams.away.players, gameStats.data.teams.home.players)
 
        for (const player in allPlayerStats) {
            const currentPlayerStats: jobGameStatsResponsePlayer = allPlayerStats[player]
            const currentPlayerId = parseInt(player.replace('ID',''))

            const currentPlayer: any = players.find(p => p.leagueId === currentPlayerId)
            if (currentPlayer) {
                const playerGameAggInput = {
                    assists: currentPlayerStats.stats.skaterStats?.assists || 0,
                    goals: currentPlayerStats.stats.skaterStats?.goals || 0,
                    hits: currentPlayerStats.stats.skaterStats?.hits || 0,
                    penaltyMin: currentPlayerStats.stats.skaterStats?.penaltyMinutes || 0,
                    position: currentPlayerStats.position.code,
                    teamId: currentPlayer.teamId,
                    playerId: currentPlayer.id,
                    gameId: game.id
                }

                await createPlayerGameAggService(playerGameAggInput)
            }
        }
    }))
}

const getLiveGameStatus = async () => {
    const games: { id: string, leagueId: number }[] = []

    const teamsData = await getTeamsService()
    if (!teamsData) return console.error('Job: Team data not found. Skipping update')

    try {
        const schedule = await axios.get('https://statsapi.web.nhl.com/api/v1/schedule')

        if (!schedule.data?.dates) return console.error('Job: Unable to update games invalid response body')

        // Create and update games
        await Promise.all(schedule.data.dates.map(async (date: { games: jobGameResponse[] }) => {
            await Promise.all(date.games.map(async game => {
                const homeTeamId = teamsData.find(team => team.leagueId === game.teams.home.team.id).id
                const awayTeamId = teamsData.find(team => team.leagueId === game.teams.away.team.id).id

                const gameInput: jobGameCreate = {
                    leagueId: game.gamePk,
                    gameType: game.gameType,
                    season: game.season,
                    gameDate: game.gameDate,
                    status: game.status.abstractGameState,
                    homeTeamId: homeTeamId,
                    awayTeamId: awayTeamId,
                    homeTeamScore: game.teams.home.score,
                    awayTeamScore: game.teams.away.score
                }

                const updateGame: any = await createGameService(gameInput)
                games.push({ id: updateGame.id, leagueId: updateGame.leagueId })
            }))
        }))

        // Update player game aggregate
        try {
            await updatePlayerGameAggregate(games)
        } catch (err) {
            console.error('Job: Unable to update players', err)
        }

        db.$disconnect()
        return console.log('Job: Games/Player aggregate updated')
    } catch (err) {
        return console.error('Job: Unable to update games', err)
    }

}

getLiveGameStatus()