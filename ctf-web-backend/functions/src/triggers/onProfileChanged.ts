import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import globalState from '../utils/globalState'

export default functions.firestore.document('/profiles/{userId}').onWrite(async (change, context) => {
    if (!globalState.isAdminInitialized) {
        admin.initializeApp()
        globalState.isAdminInitialized = true
    }

    const userId = context.params.userId
    const profile = change.after.data() || {}
    const eventsRef = change.after.ref.collection('joined_events')

    await admin.auth().updateUser(userId, {
        displayName: profile.name || ''
    })

    const batch = admin.firestore().batch()

    const eventsSnapshot = await eventsRef.get()

    eventsSnapshot.forEach(eventSnapshot => {
        const split = eventSnapshot.id.split('%')
        const eventId = split[0]
        const teamId = split[1]
        const ref = admin.firestore().collection('events').doc(eventId).collection('teams').doc(teamId)
        batch.update(ref, profile)
    })

    await batch.commit()

    return Promise.resolve()
})
