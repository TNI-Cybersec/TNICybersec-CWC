import Sdk from './src'
import GameEvent from './src/models/GameEvent'
import GameEventKingOfTheHillFlagCaptured from './src/models/GameEventKingOfTheHillFlagCaptured'
import GameEventJeopardyFlagCaptured from './src/models/GameEventJeopardyFlagCaptured'
import GameEventBuyShopItem from './src/models/GameEventBuyShopItem'

const exec = require('child-process-promise').exec
const path = require('path')
const EventTypes = Sdk.game.EventTypes

let game;

async function submitTransaction(event: any, score: number) {
    if (!event.isProcessed() && ['king_of_the_hill_flag_captured', 'jeopardy_flag_captured', 'buy_shop_item'].includes(event.getType())) {
        // not processed => no transaction submitted for this event
        if(event.getTeam()) {
            await game.submitTransaction({
                // Transaction Info (implements Transaction)
                team: event.getTeam(),
                score: score,
                timestamp: event.getTimestamp()
            })
        }
    }

    Sdk.localStorage().set('lastEventId', event.getId())
}

async function main () {
    await Sdk.initializeSDK({
        programPersistentFilePath: path.resolve(__dirname, 'persistent.json')
    })

    if (!Sdk.auth().currentUser) {
        await Sdk.auth().signInWithEmailAndPassword('ve.natthasak_st@tni.ac.th', 'abcd1234')
    }

    // Can use Sdk.localStorage() to store some data
    let lastEventId = Sdk.localStorage().get('lastEventId') || null

    // Load game instance
    game = Sdk.gameList().getGameControlInstance('sZQU0BgbgMz8Q5ZbMXi3')

    // Load all resources
    await game.boot(lastEventId)

    // subscribe to some events
    game.on(EventTypes.KingOfTheHillFlagCaptured, async (event: GameEventKingOfTheHillFlagCaptured) => {
        if (event.isProcessed()) return;
        let gameClockMinute = Math.round((event.getTimestamp() - game.getStartTimestamp()) / 60000)
        let shell = `/opt/custom-scoring-sdk/calculate.sh ${gameClockMinute} "${event.getMission().getName()}" ${event.getTeam().getName()}`
        let score = 0;
        try {
            let result = await exec(shell)

            if(result.stdout) {
                score = parseInt(result.stdout);
            }
        } catch (error) {
            console.error(error);
        }
        console.log(`[Minute: ${gameClockMinute}.00] "${event.getTeam().getName()}" has been captured "${event.getMission().getName()}". Earned ${score} points.`);
        await submitTransaction(event, score);
    });

    game.on(EventTypes.JeopardyFlagCaptured, async (event: GameEventJeopardyFlagCaptured) => {
        if(event.isProcessed()) return;
        if(!event.getTeam()) return
        let score = 0;
        score = event.getMission().getPoint();
        if(event.isFirstBlood()){
            score += event.getMission().getFirstBloodBonus();
        }
        console.log(`[Minute: ${((event.getTimestamp() - game.getStartTimestamp()) / 60000).toFixed(2)}] "${event.getTeam().getName()}" has been captured "${event.getMission().getName()}". Earned ${score} points.`);
        await submitTransaction(event, score);
    });

    game.on(EventTypes.BuyShopItem, async (event: GameEventBuyShopItem) => {
        if (event.isProcessed()) return;
        let score = 0;
        score = -event.getItem().getPrice();
        console.log(`[Minute: ${((event.getTimestamp() - game.getStartTimestamp()) / 60000).toFixed(2)}] "${event.getTeam().getName()}" has been purchased "${event.getItem().getName()}". Loss ${score} points.`);
        await submitTransaction(event, score);
    })

    /*game.on(EventTypes.AllEvents, async (event) => {
        // TODO: Score Processing...
        // Note: can recover game state by process all events even it's processed in previous run

        //console.log('received', event.getType())

        if (event.isProcessed()) return

        let score = 0;
        
        let gameClockMinute = Math.round((event.getTimestamp() - game.getStartTimestamp()) / 60000)

        switch(event.getType()) {
            case 'king_of_the_hill_flag_captured': 
                let koth = <GameEventKingOfTheHillFlagCaptured>event;
                //console.log(koth);
                if(!koth.getTeam()) return
                let shell = `/opt/custom-scoring-sdk/calculate.sh ${gameClockMinute} "${koth.getMission().getName()}" ${koth.getTeam().getName()}`
                //console.log(shell);
                //let calculator = spawn("/opt/custom-scoring-sdk/calculate.sh", [koth.getTimestamp(), koth.getMission().getName(), koth.getTeam().getName()])
                
                try {
                    let result = await exec(shell)

                    if(result.stdout) {
                        score = parseInt(result.stdout);
                    }
                } catch (error) {
                    console.error(error);
                }
                console.log(`[${gameClockMinute}.00] ${koth.getTeam().getName()} has been captured ${koth.getMission().getName()} earned ${score} points`);

                break;
            case 'jeopardy_flag_captured':
                let flag = <GameEventJeopardyFlagCaptured>event;
                score = flag.getMission().getPoint();
                if(flag.isFirstBlood()){
                    score += flag.getMission().getFirstBloodBonus();
                }
                break;
            case 'buy_shop_item':
                let item = <GameEventBuyShopItem>event;
                score = -item.getItem().getPrice();
                break;
            default:
                score = 0;
                break;
        }


        if (!event.isProcessed() && ['king_of_the_hill_flag_captured', 'jeopardy_flag_captured', 'buy_shop_item'].includes(event.getType())) {
            // not processed => no transaction submitted for this event
            if(event.getTeam()) {
                await game.submitTransaction({
                    // Transaction Info (implements Transaction)
                    team: event.getTeam(),
                    score: score,
                    timestamp: event.getTimestamp()
                })
            }
        }

        Sdk.localStorage().set('lastEventId', event.getId())
    })*/
}

main().then(() => {
    console.log('boot ok')
})
