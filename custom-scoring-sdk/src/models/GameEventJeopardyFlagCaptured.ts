import GameEvent from "./GameEvent";
import Team from './Team'
import JeopardyMission from './JeopardyMission'
import GameEventsEmitter from '../utilities/GameEventsEmitter'

export default class GameEventJeopardyFlagCaptured extends GameEvent {
    private team: Team
    private mission: JeopardyMission
    private firstBlood: boolean

    constructor (id: string, timestamp: number) {
        super(id, GameEventsEmitter.EventTypes.JeopardyFlagCaptured, timestamp)
    }

    getTeam (): Team {
        return this.team
    }

    getMission (): JeopardyMission {
        return this.mission
    }

    isFirstBlood (): boolean {
        return this.firstBlood
    }

    setTeam (team: Team): void {
        this.team = team
    }

    setMission (mission: JeopardyMission): void {
        this.mission = mission
    }

    setFirstBlood (firstBlood: boolean): void {
        this.firstBlood = firstBlood
    }
}
