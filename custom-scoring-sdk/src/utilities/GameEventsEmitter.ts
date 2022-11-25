const EventEmitter = require('events')

export default class GameEventsEmitter extends EventEmitter {
    static EventTypes = {
        AllEvents: 'triggered',
        EventStarted: 'event_started',
        JeopardyFlagCaptured: 'jeopardy_flag_captured',
        KingOfTheHillFlagCaptured: 'king_of_the_hill_flag_captured',
        KingOfTheHillFlagLost: 'king_of_the_hill_flag_lost',
        BuyShopItem: 'buy_shop_item',
        EventEnded: 'event_ended'
    }
}
