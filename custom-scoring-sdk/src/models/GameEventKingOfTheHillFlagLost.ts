import GameEvent from "./GameEvent";
import Team from './Team'
import KothMission from './KothMission'
import GameEventsEmitter from '../utilities/GameEventsEmitter'

export default class GameEventKingOfTheHillFlagLost extends GameEvent {
    private team: Team
    private nextTeam: Team
    private mission: KothMission
    private firstBlood: boolean

    constructor (id: string, timestamp: number) {
        super(id, GameEventsEmitter.EventTypes.KingOfTheHillFlagLost, timestamp)
    }

    getTeam (): Team {
        return this.team
    }

    getNextTeam (): Team {
        return this.nextTeam
    }

    getMission (): KothMission {
        return this.mission
    }

    isFirstBlood (): boolean {
        return this.firstBlood
    }

    setTeam (team: Team): void {
        this.team = team
    }

    setNextTeam (nextTeam: Team): void {
        this.nextTeam = nextTeam
    }

    setMission (mission: KothMission): void {
        this.mission = mission
    }

    setFirstBlood (firstBlood: boolean): void {
        this.firstBlood = firstBlood
    }
}
