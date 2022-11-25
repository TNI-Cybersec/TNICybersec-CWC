import Sdk from './src'
const path = require('path')
const EventTypes = Sdk.game.EventTypes

async function main () {
    await Sdk.initializeSDK({
        programPersistentFilePath: path.resolve(__dirname, 'persistent.json')
    })

    if (!Sdk.auth().currentUser) {
        await Sdk.auth().signInWithEmailAndPassword('em@il.com', 'P@ssw0rd')
    }

    // Can use Sdk.localStorage() to store some data
    let lastEventId = Sdk.localStorage().get('lastEventId') || null

    // Load game instance
    let game = Sdk.gameList().getGameControlInstance('gameId')

    // Load all resources
    await game.boot(lastEventId)

    // subscribe to some events
    game.on(EventTypes.AllEvents, async (event) => {
        // TODO: Score Processing...
        // Note: can recover game state by process all events even it's processed in previous run

        if (!event.isProcessed()) {
            // not processed => no transaction submitted for this event
            await game.submitTransaction({
                // Transaction Info (implements Transaction)
                team: null,
                score: 0,
                timestamp: event.getTimestamp()
            })
        }

        Sdk.localStorage().set('lastEventId', event.getId())
    })
}

main().then(() => {
    console.log('process terminated')
})
