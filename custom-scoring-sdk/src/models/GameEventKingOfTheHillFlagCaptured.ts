import GameEvent from "./GameEvent";
import Team from './Team'
import KothMission from './KothMission'
import GameEventsEmitter from '../utilities/GameEventsEmitter'

export default class GameEventKingOfTheHillFlagCaptured extends GameEvent {
    private team: Team
    private lastTeam: Team
    private mission: KothMission
    private firstBlood: boolean

    constructor (id: string, timestamp: number) {
        super(id, GameEventsEmitter.EventTypes.KingOfTheHillFlagCaptured, timestamp)
    }

    getTeam (): Team {
        return this.team
    }

    getLastTeam (): Team {
        return this.lastTeam
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

    setLastTeam (lastTeam: Team): void {
        this.lastTeam = lastTeam
    }

    setMission (mission: KothMission): void {
        this.mission = mission
    }

    setFirstBlood (firstBlood: boolean): void {
        this.firstBlood = firstBlood
    }
}
