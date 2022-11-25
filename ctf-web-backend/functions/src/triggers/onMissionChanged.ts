import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import globalState from '../utils/globalState'

export default functions.firestore.document('/events/{eventId}/missions/{missionId}').onWrite(async (change, context) => {
    if (!globalState.isAdminInitialized) {
        admin.initializeApp()
        globalState.isAdminInitialized = true
    }

    const eventId = context.params.eventId
    const missionId = context.params.missionId

    const updateData: any = {}

    const ref = admin.firestore().collection('public_events').doc(eventId).collection('missions').doc(missionId)
    const trackerConfigRef = `events/${eventId}/tracker_config/clients/${missionId}`
    const flagCheckerRef = `events/${eventId}/event_flags/${missionId}`

    const missionData = change.after.data() || {}

    if (change.after.exists && !missionData.disabled) {
        const publicMission = {
            name: missionData.name || 'Unknown Mission',
            description: missionData.description || '',
            group: missionData.group || 'Missions',
            text: missionData.text || '',
            type: missionData.type || '',
            point: missionData.point || 0,
            firstBloodBonus: missionData.firstBloodBonus || 0,
            flag: false,
            parent: missionData.parent || '',
            order: missionData.order || 0
        }

        if (missionData.type === 'king_of_the_hill') {
            updateData[`${trackerConfigRef}`] = missionData.config || null
        } else {
            updateData[`${trackerConfigRef}`] = null
        }

        if (missionData.type === 'jeopardy') {
            updateData[`${flagCheckerRef}`] = missionData.flag || null
            publicMission.flag = !!missionData.flag
        } else {
            updateData[`${flagCheckerRef}`] = null
        }

        await ref.set(publicMission)
    } else {
        await ref.delete()
        updateData[`${trackerConfigRef}`] = null
        updateData[`${flagCheckerRef}`] = null
    }

    await admin.database().ref().update(updateData)

    return Promise.resolve()
})
