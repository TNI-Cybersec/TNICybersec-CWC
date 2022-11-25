import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import globalState from '../utils/globalState'

export default functions.firestore.document('/events/{eventId}/teams/{teamId}').onWrite(async (change, context) => {
    if (!globalState.isAdminInitialized) {
        admin.initializeApp()
        globalState.isAdminInitialized = true
    }

    const eventId = context.params.eventId
    const teamId = context.params.teamId
    const eventRef = change.after.ref.parent.parent
    const teamData = change.after.data() || {}
    const oldTeamData = change.before.data() || {}

    let eventData: any = {
        name: 'Unknown Event',
        description: 'Something wrong here',
        start: null,
        end: null,
        paused: false
    }

    if (eventRef) {
        const eventSnapshot = await eventRef.get() || {}
        eventData = eventSnapshot.data()
    }

    const joinedEventId = `${eventId}%${teamId}`
    const joinedEventData = {
        name: eventData.name,
        description: eventData.description,
        start: eventData.start,
        end: eventData.end,
        paused: eventData.paused
    }

    const updateData: any = {}
    const batch = admin.firestore().batch()

    const publicTeamRef = admin.firestore().collection('public_events').doc(eventId).collection('teams').doc(teamId)

    if (change.after.exists) {
        updateData[`events/${eventId}/event_teams/${teamId}`] = teamData.name || ''
        batch.set(publicTeamRef, teamData)
    } else {
        updateData[`events/${eventId}/event_teams/${teamId}`] = null
        batch.delete(publicTeamRef)
    }

    for (const memberId in teamData.members) {
        if (teamData.members.hasOwnProperty(memberId)) {
            updateData[`events/${eventId}/event_members/${memberId}`] = teamId
            const ref = admin.firestore().collection('profiles').doc(memberId).collection('joined_events').doc(joinedEventId)
            batch.set(ref, joinedEventData)
        }
    }

    for (const memberId in oldTeamData.members) {
        if (oldTeamData.members.hasOwnProperty(memberId) && (!change.after.exists || !teamData.members.hasOwnProperty(memberId))) {
            updateData[`events/${eventId}/event_members/${memberId}`] = null
            const ref = admin.firestore().collection('profiles').doc(memberId).collection('joined_events').doc(joinedEventId)
            batch.delete(ref)
        }
    }

    await Promise.all([
        admin.database().ref().update(updateData),
        batch.commit()
    ])

    return Promise.resolve()
})
