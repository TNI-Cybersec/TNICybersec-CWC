import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import generatePushId from '../utils/GeneratePushId'
import globalState from '../utils/globalState'

export default functions.database.ref('/events/{eventId}/event_koth_captures/{missionId}/{checkId}').onCreate(async (snapshot, context) => {
    if (!globalState.isAdminInitialized) {
        admin.initializeApp()
        globalState.isAdminInitialized = true
    }

    const eventId = context.params.eventId
    const missionId = context.params.missionId
    const checkId = context.params.checkId

    const processedKothCaptureEventRepository = admin.database().ref('events').child(eventId).child('event_koth_captures').child(missionId)
    const lastEventQuery = processedKothCaptureEventRepository.orderByKey().endAt(checkId).limitToLast(2)
    const lastEventsSnapshot = await lastEventQuery.once('value')

    const thisEvent = snapshot.val()
    let lastEvent: any = {}

    lastEventsSnapshot.forEach(lastEventSnapshot => {
        if (lastEventSnapshot.key !== checkId) {
            lastEvent = lastEventSnapshot.val()
        }
    })

    const firstBloodStatusRef = admin.database().ref('events').child(eventId).child('event_koth_firstblood').child(missionId)
    let firstBlood = false

    if (thisEvent.team) {
        const transactionResult = await firstBloodStatusRef.transaction(captured => {
            if (!captured) {
                return thisEvent.team
            } else {
                return undefined
            }
        })

        firstBlood = transactionResult.committed
    }

    const updateData: any = {}

    if (thisEvent.team || lastEvent.team) {
        updateData[`events/${eventId}/game_events/${generatePushId()}`] = {
            type: 'king_of_the_hill_flag_captured',
            missionId: missionId,
            timestamp: thisEvent.timestamp,
            team: thisEvent.team || null,
            lastTeam: lastEvent.team || null,
            firstBlood: firstBlood
        }

        updateData[`events/${eventId}/game_events/${generatePushId()}`] = {
            type: 'king_of_the_hill_flag_lost',
            missionId: missionId,
            timestamp: thisEvent.timestamp,
            team: lastEvent.team || null,
            nextTeam: thisEvent.team || null,
            firstBlood: firstBlood
        }
    }

    await admin.database().ref().update(updateData)

    return Promise.resolve()
})
