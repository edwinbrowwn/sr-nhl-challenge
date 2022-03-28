import bree from 'bree'
import * as path from 'node:path'

const jobs = new bree({
    defaultExtension: 'ts',
    root: path.join(__dirname, ''),
    jobs: [
        {
            name: 'team.job',
            timeout: 0, // Run on start
            interval: '10m'
        },
        {
            name: 'game.job',
            timeout: 15000,
            interval: '10s'
        },
    ]
})

export default jobs
