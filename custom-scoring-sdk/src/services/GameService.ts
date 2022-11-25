import Firebase from '../utilities/Firebase'
import GameEventsEmitter from '../utilities/GameEventsEmitter'
import JeopardyMission from '../models/JeopardyMission'
import KothMission from '../models/KothMission'
import ShopItem from '../models/ShopItem'
import Team from '../models/Team'
import TransactionInfo from '../interfaces/TransactionInfo'
import TeamMember from '../models/TeamMember'
import GameEventEventStarted from '../models/GameEventEventStarted'
import GameEventKingOfTheHillFlagCaptured from '../models/GameEventKingOfTheHillFlagCaptured'
import GameEventBuyShopItem from '../models/GameEventBuyShopItem'
import GameEventJeopardyFlagCaptured from '../models/GameEventJeopardyFlagCaptured'
import GameEventKingOfTheHillFlagLost from '../models/GameEventKingOfTheHillFlagLost'
import GameEventEventEnded from '../models/GameEventEventEnded'

export default class GameService {
    // Basic Information
    private id: string
    private eventName: string
    private eventDescription: string
    private startTimestamp: number
    private endTimestamp: number
    private events: GameEventsEmitter
    private startAfterEventId: string

    // Game Resources
    private jeopardyMissions: Array<JeopardyMission>
    private kothMissions: Array<KothMission>
    private shopItems: Array<ShopItem>
    private participantTeams: Array<Team>

    // Reference for Developers
    static EventTypes = GameEventsEmitter.EventTypes

    constructor (id: string) {
        this.id = id
        this.events = new GameEventsEmitter()
        this.jeopardyMissions = []
        this.kothMissions = []
        this.shopItems = []
        this.participantTeams = []
    }

    getEventName () {
        return this.eventName
    }

    getEventDescription () {
        return this.eventDescription
    }

    getStartTimestamp () {
        return this.startTimestamp
    }

    getEndTimestamp () {
        return this.endTimestamp
    }

    // expose event subscribe methods
    get on () {
        return this.events.on.bind(this.events)
    }

    get once () {
        return this.events.once.bind(this.events)
    }

    public async boot (lastEventId = null) {
        if (lastEventId) this.startAfterEventId = lastEventId

        // load resources
        await Promise.all([
            this.loadGeneralConfig(),
            this.loadMissions(),
            this.loadShopItems(),
            this.loadTeams()
        ])

        // subscribe to event
        let ref = Firebase.database().ref('events').child(this.id).child('game_events').orderByKey()
        ref.on('child_added', this.onEventReceived.bind(this))

        return Promise.resolve()
    }

    public async submitTransaction (transactionInfo: TransactionInfo) {
        let ref = Firebase.database().ref('events').child(this.id).child('event_score_transactions')

        await ref.push({
            team: transactionInfo.team.getId(),
            score: transactionInfo.score,
            timestamp: transactionInfo.timestamp
        })

        return Promise.resolve()
    }

    private async loadGeneralConfig () {
        let eventSnapshot = await Firebase.firestore().collection('events').doc(this.id).get()

        let eventData = eventSnapshot.data()

        this.eventName = eventData.name || ''
        this.eventDescription = eventData.description || ''
        this.startTimestamp = eventData.start ? eventData.start.toDate() : null
        this.endTimestamp = eventData.end ? eventData.end.toDate() : null
    }

    private async loadMissions () {
        let missionsSnapshot = await Firebase.firestore().collection('events').doc(this.id).collection('missions').get()

        this.jeopardyMissions = []
        this.kothMissions = []

        if (!missionsSnapshot.empty) {
            let parentIds = {}

            missionsSnapshot.forEach(missionSnapshot => {
                let missionId = missionSnapshot.id
                let mission = missionSnapshot.data()

                switch (mission.type) {
                    case 'jeopardy': {
                        this.jeopardyMissions.push(
                            new JeopardyMission(
                                missionId,
                                mission.name || '',
                                mission.description || '',
                                mission.group || '',
                                mission.text || '',
                                mission.type || '',
                                mission.flag || '',
                                mission.point || 0,
                                mission.firstBloodBonus || 0
                            )
                        )

                        if (mission.parent) {
                            parentIds[missionId] = mission.parent
                        }
                        break
                    }
                    case 'king_of_the_hill': {
                        this.kothMissions.push(
                            new KothMission(
                                missionId,
                                mission.name || '',
                                mission.description || '',
                                mission.group || '',
                                mission.text || '',
                                mission.type || '',
                                mission.initialDelay || 600000,
                                mission.interval || 600000,
                                mission.point || 0,
                                mission.increasingPoints || 0,
                                mission.firstBloodBonus || 0,
                                mission.uniqueCapturePoints || 0,
                                mission.uniqueCaptureIncreasingPoints || 0,
                                mission.holdStreakIncreasingPoints || 0,
                                mission.holdStreakComeBackStart || 0
                            )
                        )
                        break
                    }
                    default: {}
                }
            })

            for (let i = 0; i < this.jeopardyMissions.length; i++) {
                let mission = this.jeopardyMissions[i]
                let missionId = mission.getId()

                if (parentIds.hasOwnProperty(missionId)) {
                    let parentMission = this.jeopardyMissions.find(e => e.getId() === parentIds[missionId]) || null
                    mission.setParent(parentMission)
                }
            }
        }

        return Promise.resolve()
    }

    private async loadShopItems () {
        let itemsSnapshot = await Firebase.firestore().collection('events').doc(this.id).collection('shop').get()

        this.shopItems = []

        if (!itemsSnapshot.empty) {
            itemsSnapshot.forEach(itemSnapshot => {
                let itemId = itemSnapshot.id
                let item = itemSnapshot.data()

                this.shopItems.push(
                    new ShopItem(
                        itemId,
                        item.name || '',
                        item.description || '',
                        item.item || '',
                        item.price || 0
                    )
                )
            })
        }

        return Promise.resolve()
    }

    private async loadTeams () {
        let teamsSnapshot = await Firebase.firestore().collection('events').doc(this.id).collection('teams').get()

        this.participantTeams = []

        if (!teamsSnapshot.empty) {
            teamsSnapshot.forEach(teamSnapshot => {
                let teamId = teamSnapshot.id
                let team = teamSnapshot.data()

                let members = []
                for (let memberId in team.members) {
                    if(team.members.hasOwnProperty(memberId)) {
                        let member = team.members[memberId]
                        members.push(
                            new TeamMember(memberId, member.name)
                        )
                    }
                }

                let teamObject = new Team(teamId, team.name || '', 0)
                teamObject.setMembers(members)
                this.participantTeams.push(teamObject)
            })
        }

        return Promise.resolve()
    }

    private async onEventReceived (eventSnapshot) {
        let eventId = eventSnapshot.key
        let eventData = eventSnapshot.val()

        let event = null

        switch (eventData.type) {
            case GameEventsEmitter.EventTypes.EventStarted: {
                event = new GameEventEventStarted(eventId, eventData.timestamp)
                break
            }
            case GameEventsEmitter.EventTypes.JeopardyFlagCaptured: {
                event = new GameEventJeopardyFlagCaptured(eventId, eventData.timestamp)

                let team = this.participantTeams.find(e => e.getId() === eventData.team) || null
                let mission = this.jeopardyMissions.find(e => e.getId() === eventData.missionId) || null

                event.setTeam(team)
                event.setMission(mission)
                event.setFirstBlood(eventData.firstBlood)
                break
            }
            case GameEventsEmitter.EventTypes.KingOfTheHillFlagCaptured: {
                event = new GameEventKingOfTheHillFlagCaptured(eventId, eventData.timestamp)

                let team = this.participantTeams.find(e => e.getId() === eventData.team) || null
                let lastTeam = this.participantTeams.find(e => e.getId() === eventData.lastTeam) || null
                let mission = this.kothMissions.find(e => e.getId() === eventData.missionId) || null

                event.setTeam(team)
                event.setLastTeam(lastTeam)
                event.setMission(mission)
                event.setFirstBlood(eventData.firstBlood)
                break
            }
            case GameEventsEmitter.EventTypes.KingOfTheHillFlagLost: {
                event = new GameEventKingOfTheHillFlagLost(eventId, eventData.timestamp)

                let team = this.participantTeams.find(e => e.getId() === eventData.team) || null
                let nextTeam = this.participantTeams.find(e => e.getId() === eventData.nextTeam) || null
                let mission = this.kothMissions.find(e => e.getId() === eventData.missionId) || null

                event.setTeam(team)
                event.setNextTeam(nextTeam)
                event.setMission(mission)
                event.setFirstBlood(eventData.firstBlood)
                break
            }
            case GameEventsEmitter.EventTypes.BuyShopItem: {
                event = new GameEventBuyShopItem(eventId, eventData.timestamp)

                let team = this.participantTeams.find(e => e.getId() === eventData.team) || null
                let item = this.shopItems.find(e => e.getId() === eventData.item) || null

                event.setTeam(team)
                event.setItem(item)
                break
            }
            case GameEventsEmitter.EventTypes.EventEnded: {
                event = new GameEventEventEnded(eventId, eventData.timestamp)
                break
            }
            default: {
                console.warn('unknown event type')
                return
            }
        }

        // mark already processed events (in case of restart)
        if (eventId <= this.startAfterEventId) {
            event.setProcessed(true)
        }

        this.events.emit(GameEventsEmitter.EventTypes.AllEvents, event)
        this.events.emit(event.getType(), event)

        return Promise.resolve()
    }
}
