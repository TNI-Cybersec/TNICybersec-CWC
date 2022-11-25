export default class ShopItem {
    private id: string
    private name: string
    private description: string
    private item: string
    private price: number

    constructor (id: string, name: string, description: string, item: string, price: number) {
        this.id = id
        this.name = name
        this.description = description
        this.item = item
        this.price = price
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

    getItem (): string {
        return this.item
    }

    getPrice (): number {
        return this.price
    }

    setId (id: string) {
        this.id = id
    }

    setName (name: string) {
        this.name = name
    }

    setDescription (description: string): void {
        this.description = description
    }

    setItem (item: string): void {
        this.item = item
    }

    setPrice (price: number): void {
        this.price = price
    }
}
