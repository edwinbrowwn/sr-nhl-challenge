import axios from 'axios'
import db from '../utils/prisma'
db.$connect()
import { jobTeamResponse, jobTeamResponsePlayers } from '../schemas/team.schema'
import { createPlayerService } from '../services/player.service'
import { createTeamService } from '../services/team.service'

const getTeamInfo = async () => {
    try {
        const teams = await axios.get('https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster')

        if (!teams.data?.teams) return console.error('Job: Unable to update teams invalid response body')

        await Promise.all(teams.data.teams.map(async (team: jobTeamResponse) => {

            // Create & update team
            const updateTeam = await createTeamService(team)

            // Create & update players
            await Promise.all(team.roster.roster.map(async (player: jobTeamResponsePlayers) => {

                try {
                    const playerData = await axios.get(`https://statsapi.web.nhl.com/api/v1/people/${player.person.id}`)

                    await createPlayerService(playerData.data.people[0], updateTeam.id)

                } catch (err) {
                    console.error('Job: Unable to update player', player.person.id, err)
                }
            }))

        }))

        db.$disconnect()
        return console.log('Job: Teams & Players updated')
    } catch (err) {
        return console.error('Job: Unable to update teams', err)
    }

}

getTeamInfo()
