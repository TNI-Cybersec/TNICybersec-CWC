import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import globalState from '../utils/globalState'

export default functions.database.ref('/events/{eventId}/tracking_data/{missionId}/{checkId}').onCreate(async (snapshot, context) => {
    if (!globalState.isAdminInitialized) {
        admin.initializeApp()
        globalState.isAdminInitialized = true
    }

    const eventId = context.params.eventId
    const missionId = context.params.missionId
    const checkId = context.params.checkId
    const checkData = snapshot.val()
    const timestamp = checkData.timestamp || Date.now()

    const teamListRepository = admin.database().ref('events').child(eventId).child('event_teams')
    const findTeamId = teamListRepository.orderByValue().equalTo(checkData.value).limitToFirst(1)
    const searchResultsSnapshot = await findTeamId.once('value')

    let teamId = null

    searchResultsSnapshot.forEach(searchResultSnapshot => {
        teamId = searchResultSnapshot.key
        console.log('found team:', searchResultSnapshot.val())
    })

    const updateData: any = {}

    updateData[`events/${eventId}/event_koth_status/${missionId}`] = teamId
    updateData[`events/${eventId}/event_koth_captures/${missionId}/${checkId}`] = {
        team: teamId, timestamp
    }

    await admin.database().ref().update(updateData)

    return Promise.resolve()
})
