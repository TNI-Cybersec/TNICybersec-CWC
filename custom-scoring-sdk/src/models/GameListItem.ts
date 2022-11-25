export default class GameListItem {
    private id: string
    private name: string

    constructor (id: string, name: string) {
        this.id = id
        this.name = name
    }

    getId (): string {
        return this.id
    }

    getName (): string {
        return this.name
    }

    setId (id: string) {
        this.id = id
    }

    setName (name: string) {
        this.name = name
    }
}