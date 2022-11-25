import LocalStorage from './services/LocalStorage'
import GameService from './services/GameService'
import AuthService from './services/AuthService'
import GameListService from './services/GameListService'
import SdkConfiguration from './interfaces/SdkConfiguration'
import GameEvent from './models/GameEvent'
import GameEventEventStarted from './models/GameEventEventStarted'
import GameEventJeopardyFlagCaptured from './models/GameEventJeopardyFlagCaptured'
import GameEventKingOfTheHillFlagCaptured from './models/GameEventKingOfTheHillFlagCaptured'
import GameEventKingOfTheHillFlagLost from './models/GameEventKingOfTheHillFlagLost'
import GameEventBuyShopItem from './models/GameEventBuyShopItem'
import GameEventEventEnded from './models/GameEventEventEnded'
import GameListItem from './models/GameListItem'
import JeopardyMission from './models/JeopardyMission'
import KothMission from './models/KothMission'
import ShopItem from './models/ShopItem'
import Team from './models/Team'

export default class CustomScoringSDK {
    static isInitialized = false

    static async initializeSDK (config: SdkConfiguration) {
        if (!this.isInitialized) {
            await LocalStorage.initializeLocalStorage(config)
            await AuthService.initializeAuthentication()
        }
    }

    static game = GameService

    static localStorage () {
        return LocalStorage
    }

    static gameList () {
        return GameListService
    }

    static auth () {
        return AuthService
    }
}

export const Models = {
    GameEvent, GameEventEventStarted, GameEventJeopardyFlagCaptured,
    GameEventKingOfTheHillFlagCaptured, GameEventKingOfTheHillFlagLost,
    GameEventBuyShopItem, GameEventEventEnded, GameListItem,
    JeopardyMission, KothMission, ShopItem,
    Team
}