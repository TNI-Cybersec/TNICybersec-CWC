import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import globalState from '../utils/globalState'

export default functions.database.ref('/events/{eventId}/event_answers/{teamId}/{missionId}').onCreate(async (snapshot, context) => {
    if (!globalState.isAdminInitialized) {
        admin.initializeApp()
        globalState.isAdminInitialized = true
    }

    const eventId = context.params.eventId
    const teamId = context.params.teamId
    const missionId = context.params.missionId

    ///// answered flag guaranteed to be correct (by rule restrictions)
    // const flagAnswered = snapshot.val()

    const firstBloodStatusRef = admin.database().ref('events').child(eventId).child('event_jeopardy_firstblood').child(missionId)
    const transactionResult = await firstBloodStatusRef.transaction(captured => {
        if (!captured) {
            return teamId
        } else {
            return undefined
        }
    })

    await admin.database().ref('events').child(eventId).child('game_events').push({
        type: 'jeopardy_flag_captured',
        timestamp: Date.now(),
        team: teamId,
        missionId: missionId,
        firstBlood: transactionResult.committed
    })

    return Promise.resolve()
})
