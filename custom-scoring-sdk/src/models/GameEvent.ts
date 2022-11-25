export default class GameEvent {
    private id: string
    private type: string
    private timestamp: number
    private processed: boolean

    constructor (id: string, type: string, timestamp: number) {
        this.id = id
        this.type = type
        this.timestamp = timestamp
    }

    getId () {
        return this.id
    }

    getType () {
        return this.type
    }

    getTimestamp () {
        return this.timestamp
    }

    isProcessed () {
        return this.processed
    }

    setId (id: string) {
        this.id = id
    }

    setType (type: string) {
        this.type = type
    }

    setTimestamp (timestamp: number) {
        this.timestamp = timestamp
    }

    setProcessed (processed: boolean) {
        this.processed = processed
    }
}
