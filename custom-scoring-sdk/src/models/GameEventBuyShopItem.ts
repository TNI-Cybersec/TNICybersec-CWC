import GameEvent from "./GameEvent"
import ShopItem from './ShopItem'
import Team from './Team'
import GameEventsEmitter from '../utilities/GameEventsEmitter'

export default class GameEventBuyShopItem extends GameEvent {
    private item: ShopItem
    private team: Team

    constructor (id: string, timestamp: number) {
        super(id, GameEventsEmitter.EventTypes.BuyShopItem, timestamp)
    }

    getTeam (): Team {
        return this.team
    }

    getItem (): ShopItem {
        return this.item
    }

    setTeam (team: Team): void {
        this.team = team
    }

    setItem (item: ShopItem): void {
        this.item = item
    }
}
