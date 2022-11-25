const axios = require('axios')
const firebase = require('firebase')

module.exports = {
    data: {
        start: 0,
        clients: {}
    },
    trackingHistory: {},
    intervalRef: [],
    initialDelayRef: [],
    waitRef: null,
    existingGame: false,
    async boot () {
        let GameSelector = await require('./GameSelector')

        if (this.existingGame) {
            if (this.waitRef) {
                console.log('clearing game start schedule...')
                clearTimeout(this.waitRef)
            }

            if (this.initialDelayRef.length > 0) {
                console.log('clearing initial delay...')
                while (this.initialDelayRef.length > 0) {
                    let ref = this.initialDelayRef.pop()
                    if (ref !== null) clearInterval(ref)
                }
            }

            if (this.intervalRef.length > 0) {
                console.log('clearing game check loop...')
                while (this.intervalRef.length > 0) {
                    let ref = this.intervalRef.pop()
                    if (ref !== null) clearInterval(ref)
                }
            }

            console.log('making sure existing game is cleared...')
            await this.delay(10000)

            console.log('clearing data...')
            this.data = {
                start: 0,
                clients: {}
            }
            this.trackingHistory = {}
            this.intervalRef = []
            this.initialDelayRef = []
            this.waitRef = null
            this.existingGame = false
        }

        if (GameSelector.isLoggedIn() && GameSelector.getGameId()) {
            this.existingGame = GameSelector.getGameId()

            console.log('getting game config...')
            let eventRef = firebase.firestore().collection('events').doc(GameSelector.getGameId())
            let missionsRef = firebase.firestore()
                .collection('events').doc(GameSelector.getGameId()).collection('missions')
                .where('type', '==', 'king_of_the_hill')

            let eventSnapshot = await eventRef.get()
            let missionSnapshots = await missionsRef.get()

            const config = {
                clients: {},
                start: eventSnapshot.data().start.toMillis(),
                end: eventSnapshot.data().end.toMillis(),
            }

            missionSnapshots.forEach(missionSnapshot => {
                config.clients[missionSnapshot.id] = missionSnapshot.data().config
            })

            this.data = config

            console.log('starting...')

            this.waitForStart().then((function() {
                for (let clientId in this.data.clients) {
                    if (this.data.clients.hasOwnProperty(clientId)) {
                        let interval = this.data.clients[clientId].interval
                        let initialDelay = this.data.clients[clientId].initialDelay
                        let now = Date.now()
                        let firstCheck = this.data.start + initialDelay
                        let timeFromFirstCheck = now - firstCheck


                        if (timeFromFirstCheck <= 0) {
                            // time to first check
                            initialDelay = firstCheck - now
                        } else {
                            // time to next check
                            initialDelay = interval - (timeFromFirstCheck % interval)
                        }

                        let index = this.initialDelayRef.push(null) - 1

                        this.initialDelayRef[index] = setTimeout((function() {
                            this.initialDelayRef[index] = null

                            this.checkOne.bind(this)(clientId)
                            let intervalRef = setInterval((function() {
                                this.checkOne.bind(this)(clientId)
                            }).bind(this), interval, )

                            this.intervalRef.push(intervalRef)
                        }).bind(this), initialDelay)
                    }
                }
            }).bind(this))
        }
    },
    async delay (time) {
        return new Promise(function(resolve) {
            setTimeout(resolve, time)
        })
    },
    async waitForStart () {
        let wait = (function(resolve) {
            let timeRemaining = this.data.start - Date.now()
            if (timeRemaining > 86400000) timeRemaining = 86400000

            if (timeRemaining > 0) {
                this.waitRef = setTimeout(wait, timeRemaining, resolve)
            } else {
                this.waitRef = null
                resolve()
            }

        }).bind(this)

        return new Promise(wait)
    },
    async menu () {
        let GameSelector = await require('./GameSelector')

        if (GameSelector.isLoggedIn() && GameSelector.getGameId()) {
            return [
                {
                    name: 'View current capture status',
                    value: 'currentStatus'
                },
                {
                    name: 'Reboot Tracker',
                    value: 'boot'
                }
            ]
        } else return []
    },
    currentStatus () {
        for (let clientId in this.data.clients) {
            if (this.data.clients.hasOwnProperty(clientId)) {
                let client = this.data.clients[clientId]

                let found = false
                let captured = false
                let lastCheck = false

                if (Array.isArray(this.trackingHistory[clientId])) {
                    let history = this.trackingHistory[clientId]

                    if (history.length > 0) {
                        let lastResult = history[history.length - 1]
                        found = true
                        captured = lastResult.value
                        lastCheck = lastResult.time
                    }
                }

                if (found) {
                    if (captured) {
                        if (lastCheck) {
                            console.log(`[${client.host}:${client.port}]: CAPTURED BY '${captured}' SINCE ${lastCheck}`)
                        } else {
                            console.log(`[${client.host}:${client.port}]: CAPTURED BY '${captured}'`)
                        }
                    } else {
                        console.log(`[${client.host}:${client.port}]: UNCAPTURED`)
                    }
                } else {
                    console.log(`[${client.host}:${client.port}]: NOT CHECKED / NOT FOUND`)
                }
            }
        }
    },
    async checkAll () {
        let operations = []

        let updateData = {}

        for (let clientId in this.data.clients) {
            if (this.data.clients.hasOwnProperty(clientId)) {
                operations.push(this.check(clientId, updateData))
            }
        }

        await Promise.all(operations)
        await firebase.database().ref('events').child(this.existingGame).child('tracking_data').update(updateData)
    },
    async checkOne (clientId) {
        let updateData = {}
        await this.check(clientId, updateData)
        await firebase.database().ref('events').child(this.existingGame).child('tracking_data').update(updateData)
    },
    async check (clientId, updateData) {
        try {
            let client = this.data.clients[clientId]
            let lastCheck = null

            if (client.hostTime) {
                if (Array.isArray(this.trackingHistory[clientId])) {
                    let history = this.trackingHistory[clientId]
                    lastCheck = history[history.length - 1].time
                } else {
                    lastCheck = 0
                }
            }

            let serverResponse = await this.checkServer(client.host, client.port, lastCheck)

            if (!Array.isArray(this.trackingHistory[clientId])) {
                this.trackingHistory[clientId] = []
            }

            if (!Array.isArray(serverResponse) || serverResponse.length < 1) {
                return {
                    clientId: clientId,
                    result: 'error'
                }
            }

            if (!client.hostTime) {
                if (serverResponse.length > 1) {
                    return {
                        clientId: clientId,
                        result: 'error'
                    }
                }

                serverResponse[0].time = Date.now()
            }

            if (this.trackingHistory[clientId].length > 0) {
                serverResponse = serverResponse.filter((function(item) {
                    return !this.trackingHistory[clientId].find(function(existingItem) {
                        return existingItem.key === item.key
                    })
                }).bind(this))
            }

            this.trackingHistory[clientId] = this.trackingHistory[clientId].concat(serverResponse)
            for (let i = serverResponse.length - 1; i >= 0; i--) {
                updateData[`${clientId}/${serverResponse[i].key}`] = serverResponse[i]
            }

            return {
                clientId: clientId,
                result: 'ok'
            }
        } catch (e) {
            return {
                clientId: clientId,
                result: 'error'
            }
        }
    },
    async checkServer (host = '127.0.0.1', port = 52799, since = null) {
        let url = `http://${host}:${port}/`
        if (typeof since === 'number') url = `${url}?since=${since}`

        let response = await axios.get(url)
        return response.data
    }
}
