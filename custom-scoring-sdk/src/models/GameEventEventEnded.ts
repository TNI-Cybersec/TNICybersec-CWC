import GameEvent from "./GameEvent";
import GameEventsEmitter from '../utilities/GameEventsEmitter'

export default class GameEventEventEnded extends GameEvent {
    constructor (id: string, timestamp: number) {
        super(id, GameEventsEmitter.EventTypes.EventEnded, timestamp)
    }
}
