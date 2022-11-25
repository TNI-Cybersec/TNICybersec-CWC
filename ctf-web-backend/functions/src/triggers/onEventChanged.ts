import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import globalState from '../utils/globalState'

export default functions.firestore.document('/events/{eventId}').onWrite(async (change, context) => {
    if (!globalState.isAdminInitialized) {
        admin.initializeApp()
        globalState.isAdminInitialized = true
    }

    const eventId = context.params.eventId
    const eventData = change.after.data() || {}
    const eventListRef = `events/${eventId}/event_info`
    const eventConfigRef = `events/${eventId}/tracker_config`
    const teamsRef = change.after.ref.collection('teams')
    const teamsSnapshot = await teamsRef.get()

    const updateData: any = {}

    let ownerId = null

    for (const adminId in eventData.admins) {
        if (eventData.admins.hasOwnProperty(adminId) && eventData.admins[adminId] === 'owner') {
            ownerId = adminId
            break
        }
    }

    updateData[eventListRef] = {
        name: eventData.name,
        owner: ownerId,
        admins: eventData.admins || {}
    }

    updateData[`${eventConfigRef}/start`] = eventData.start ? eventData.start.toMillis() : null
    updateData[`${eventConfigRef}/end`] = eventData.end ? eventData.end.toMillis() : null

    const batch = admin.firestore().batch()
    const joinedEventData = {
        name: eventData.name,
        description: eventData.description,
        start: eventData.start,
        end: eventData.end,
        paused: eventData.paused
    }

    batch.set(
        admin.firestore().collection('public_events').doc(eventId),
        joinedEventData
    )

    teamsSnapshot.forEach(teamSnapshot => {
        const teamId = teamSnapshot.id
        const teamData = teamSnapshot.data()
        const entryId = `${eventId}%${teamId}`

        for (const memberId in teamData.members) {
            if (teamData.members.hasOwnProperty(memberId)) {
                const ref = admin.firestore().collection('profiles').doc(memberId).collection('joined_events').doc(entryId)
                batch.set(ref, joinedEventData)
            }
        }
    })

    await Promise.all([
        admin.database().ref().update(updateData),
        batch.commit()
    ])

    return Promise.resolve()
})
