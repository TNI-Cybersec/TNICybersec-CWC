import TeamMember from './TeamMember'

export default class Team {
    private id: string
    private name: string
    private members: Array<TeamMember>
    private score: number

    constructor (id: string, name: string, score: number) {
        this.id = id
        this.name = name
        this.score = score
    }

    getId (): string {
        return this.id
    }

    getName (): string {
        return this.name
    }

    getMembers () {
        return this.members
    }

    getScore () {
        return this.score
    }

    setId (id: string) {
        this.id = id
    }

    setName (name: string) {
        this.name = name
    }

    setMembers (members: Array<TeamMember>) {
        this.members = members
    }

    setScore (score: number) {
        this.score = score
    }
}
