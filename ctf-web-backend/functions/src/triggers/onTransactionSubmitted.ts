import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import globalState from '../utils/globalState'

export default functions.database.ref('/events/{eventId}/event_score_transactions/{transactionId}').onCreate(async (snapshot, context) => {
    if (!globalState.isAdminInitialized) {
        admin.initializeApp()
        globalState.isAdminInitialized = true
    }

    const eventId = context.params.eventId
    const transactionData = snapshot.val()

    const teamScoreRef = admin.database().ref('events').child(eventId).child('event_team_score').child(transactionData.team)
    await teamScoreRef.transaction(score => (score || 0) + transactionData.score)

    return Promise.resolve()
})
