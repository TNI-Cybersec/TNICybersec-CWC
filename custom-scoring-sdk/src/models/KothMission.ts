import Mission from '../interfaces/Mission'

export default class KothMission implements Mission {
    private id: string
    private name: string
    private description: string
    private group: string
    private text: string
    private type: string
    private initialDelay: number
    private interval: number
    private point: number
    private increasingPoints: number
    private firstBloodBonus: number
    private uniqueCapturePoints: number
    private uniqueCaptureIncreasingPoints: number
    private holdStreakIncreasingPoints: number
    private holdStreakComeBackStart: number

    constructor (
        id: string, name: string, description: string,
        group: string, text: string, type: string,
        initialDelay: number, interval: number, point: number,
        increasingPoints: number, firstBloodBonus: number, uniqueCapturePoints: number,
        uniqueCaptureIncreasingPoints: number, holdStreakIncreasingPoints: number, holdStreakComeBackStart: number
    ) {
        this.id = id
        this.name = name
        this.description = description
        this.group = group
        this.text = text
        this.type = type
        this.initialDelay = initialDelay
        this.interval = interval
        this.point = point
        this.increasingPoints = increasingPoints
        this.firstBloodBonus = firstBloodBonus
        this.uniqueCapturePoints = uniqueCapturePoints
        this.uniqueCaptureIncreasingPoints = uniqueCaptureIncreasingPoints
        this.holdStreakIncreasingPoints = holdStreakIncreasingPoints
        this.holdStreakComeBackStart = holdStreakComeBackStart
    }

    getId (): string {
        return this.id
    }

    getName (): string {
        return this.name
    }

    getDescription(): string {
        return this.description
    }

    getInterval (): number {
        return this.interval
    }

    getInitialDelay (): number {
        return this.initialDelay
    }

    getPoint (): number {
        return this.point
    }

    getIncreasingPoints (): number {
        return this.increasingPoints
    }

    getFirstBloodBonus (): number {
        return this.firstBloodBonus
    }

    getUniqueCapturePoints (): number {
        return this.uniqueCapturePoints
    }

    getUniqueCaptureIncreasingPoints (): number {
        return this.uniqueCaptureIncreasingPoints
    }

    getHoldStreakIncreasingPoints (): number {
        return this.holdStreakIncreasingPoints
    }

    getHoldStreakComeBackStart (): number {
        return this.holdStreakComeBackStart
    }

    getGroup (): string {
        return this.group
    }

    getText (): string {
        return this.text
    }

    getType (): string {
        return this.type
    }

    setId (id: string) {
        this.id = id
    }

    setName (name: string) {
        this.name = name
    }
    
    setDescription(description: string): void {
        this.description = description
    }

    setInterval (interval: number): void {
        this.interval = interval
    }

    setInitialDelay (initialDelay: number): void {
        this.initialDelay = initialDelay
    }

    setPoint (point: number): void {
        this.point = point
    }

    setIncreasingPoints (increasingPoints: number): void {
        this.increasingPoints = increasingPoints
    }

    setFirstBloodBonus (firstBloodBonus: number): void {
        this.firstBloodBonus = firstBloodBonus
    }

    setUniqueCapturePoints (uniqueCapturePoints: number): void {
        this.uniqueCapturePoints = uniqueCapturePoints
    }

    setUniqueCaptureIncreasingPoints (uniqueCaptureIncreasingPoints: number): void {
        this.uniqueCaptureIncreasingPoints = uniqueCaptureIncreasingPoints
    }

    setHoldStreakIncreasingPoints (holdStreakIncreasingPoints: number): void {
        this.holdStreakIncreasingPoints = holdStreakIncreasingPoints
    }

    setHoldStreakComeBackStart (holdStreakComeBackStart: number): void {
        this.holdStreakComeBackStart = holdStreakComeBackStart
    }

    setGroup (group: string): void {
        this.group = group
    }

    setText (text: string): void {
        this.text = text
    }

    setType (type: string): void {
        this.type = type
    }
}
