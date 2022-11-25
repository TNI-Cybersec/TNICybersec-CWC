// libraries
console.log('Loading libraries...')
const express = require('express')
const fs = require('fs')
const generatePushId = require('./GeneratePushId.js')

// main app
console.log('Setting up...')
const app = express()

// configuration
const APP_PORT = 52799
const FLAG_FILE_PATH = '/root/flag.txt'
const HISTORY_MAX = 50
console.log(`Using flag file: ${FLAG_FILE_PATH}`)

// variables
let flag = {
    get current () {
        return this.history[this.history.length - 1]
    },
    set current (value) {
        if (this.current && this.current.value === value) return

        if (value) {
            console.log(`[INFO] Flag captured by '${value}'`)
        } else {
            console.log(`[INFO] Flag uncaptured`)
        }

        let time = Date.now()

        this.history.push({
            value: value,
            time: time,
            key: generatePushId(time)
        })

        if (this.history.length > HISTORY_MAX) {
            this.history.shift()
        }
    },
    history: []
}

// update flag function
function updateFlag () {
    try {
        flag.current = fs.readFileSync(FLAG_FILE_PATH, { encoding: 'utf8' }).trim()
    } catch (error) {
        flag.current = ''
    }
}

// initialize flag
updateFlag()

// setup file watcher
fs.watchFile(FLAG_FILE_PATH, { interval: 1000 }, updateFlag)

// setup endpoint(s)
app.get('/', function(req, res) {
    let response = []

    if (req.query.since) {
        let timeSince = parseInt(req.query.since)

        if (!isNaN(timeSince)) {
            response = flag.history.filter(function(e) {
                return e.time > timeSince
            })
        }
    } else if (flag.current) {
        let now = Date.now()

        response.push({
            value: flag.current.value,
            time: now,
            key: generatePushId(now)
        })
    }

    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(JSON.stringify(response))
})

// listen on port
app.listen(APP_PORT, function() {
    console.log(`Agent ready, listening on port ${APP_PORT}`)
})
