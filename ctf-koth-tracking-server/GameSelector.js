const fs = require('fs')
const inquirer = require('inquirer')
const firebase = require('./Firebase.js')
const EndpointTracker = require('./EndpointTracker')

const STATE_FILE = './game.json'

if (!fs.existsSync(STATE_FILE)) {
    fs.writeFileSync(STATE_FILE, JSON.stringify({}), { encoding: "utf-8" })
}

const GameSelector = {
    data: JSON.parse(fs.readFileSync(STATE_FILE, { encoding: "utf-8" })),
    menu () {
        let menus = []

        if (this.isLoggedIn()) {
            menus.push({
                name: 'Select Game',
                value: 'selectGame'
            })
            menus.push({
                name: 'Sign Out',
                value: 'logout'
            })
        } else {
            menus.push({
                name: 'Sign In (with Email & Password)',
                value: 'login'
            })
        }

        return menus
    },
    isLoggedIn () {
        return firebase.auth().currentUser
    },
    getEmail () {
        if (!this.isLoggedIn()) return null
        return this.data.auth.email
    },
    getGameId () {
        return this.data.game_id || null
    },
    save () {
        fs.writeFileSync(STATE_FILE, JSON.stringify(this.data, null, '    '))
    },
    async selectGame () {
        if (!this.isLoggedIn()) return

        console.log('Getting game list...')
        let gameListSnapshot = await firebase.firestore().collection('events').where(`admins.${firebase.auth().currentUser.uid}`, '==', 'owner').get()
        console.log()
        let gameList = []

        gameListSnapshot.forEach((function(gameSnapshot) {
            const { name } = gameSnapshot.data()
            gameList.push({
                name: name,
                value: gameSnapshot.id
            })
        }).bind(this))

        gameList.push({
            name: '== Deselect ==',
            value: ''
        })

        let selection = await inquirer.prompt({
            type: 'list',
            name: 'game_id',
            message: 'Select a game:',
            choices: gameList
        })
        console.log()

        this.data.game_id = selection.game_id
        this.save()

        console.log('Rebooting EndpointTracker...')
        await EndpointTracker.boot()
    },
    async login () {
        let cred = await inquirer.prompt([
            {
                type: 'input',
                name: 'email',
                message: 'Email:'
            },
            {
                type: 'password',
                name: 'password',
                message: 'Password:'
            }
        ])

        await firebase.auth().signInWithEmailAndPassword(cred.email, cred.password)
        this.data.auth = firebase.auth().currentUser.toJSON()
        this.save()

        console.log('Logged in as: ' + GameSelector.getEmail())
    },
    async logout () {
        await firebase.auth().signOut()
        this.data.auth = null
        this.data.game_id = ''
        this.save()

        console.log('Logged out')
    }
}

module.exports = new Promise(function(resolve, reject) {
    if (GameSelector.data.auth) {
        let user = new firebase.User(GameSelector.data.auth, GameSelector.data.auth.stsTokenManager, GameSelector.data.auth)
        firebase.auth().updateCurrentUser(user).then(function() {
            resolve(GameSelector)
        })
    } else {
        resolve(GameSelector)
    }
})
