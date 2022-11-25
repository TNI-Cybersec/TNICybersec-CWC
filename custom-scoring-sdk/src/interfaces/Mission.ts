export default interface Mission {
    getId (): string
    setId (id: string): void

    getName (): string
    setName (name: string): void

    getDescription (): string
    setDescription (description: string): void

    getPoint (): number
    setPoint (point: number): void

    getText (): string
    setText (text: string): void

    getType (): string
    setType (type: string): void

    getGroup (): string
    setGroup (group: string): void
}