import Mission from "../interfaces/Mission"

export default class JeopardyMission implements Mission {
    private id: string
    private name: string
    private description: string
    private group: string
    private text: string
    private type: string
    private flag: string
    private point: number
    private firstBloodBonus: number
    private parent: JeopardyMission|null

    constructor (
        id: string, name: string, description: string,
        group: string, text: string, type: string,
        flag: string, point: number, firstBloodBonus: number,
        parent: JeopardyMission = null
    ) {
        this.id = id
        this.name = name
        this.description = description
        this.group = group
        this.text = text
        this.type = type
        this.flag = flag
        this.point = point
        this.firstBloodBonus = firstBloodBonus
        this.parent = parent
    }

    getId (): string {
        return this.id
    }

    getName (): string {
        return this.name
    }

    getDescription (): string {
        return this.description
    }

    getPoint (): number {
        return this.point
    }

    getFirstBloodBonus (): number {
        return this.firstBloodBonus
    }

    getFlag (): string {
        return this.flag
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

    getParent (): JeopardyMission|null {
        return this.parent
    }

    setId (id: string) {
        this.id = id
    }

    setName (name: string) {
        this.name = name
    }

    setDescription (description: string) {
        this.description = description
    }

    setPoint (point: number): void {
        this.point = point
    }

    setFirstBloodBonus (firstBloodBonus: number): void {
        this.firstBloodBonus = firstBloodBonus
    }

    setFlag (flag: string): void {
        this.flag = flag
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

    setParent (parent: JeopardyMission|null) {
        this.parent = parent
    }
}
