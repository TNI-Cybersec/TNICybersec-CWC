import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import generatePushId from '../utils/GeneratePushId'
import globalState from '../utils/globalState'

export default functions.database.ref('/events/{eventId}/event_user_shopping/{transactionId}').onCreate(async (snapshot, context) => {
    if (!globalState.isAdminInitialized) {
        admin.initializeApp()
        globalState.isAdminInitialized = true
    }

    const eventId = context.params.eventId
    const transactionData = snapshot.val()

    const itemRef = admin.firestore().collection('events').doc(eventId).collection('shop').doc(transactionData.item_id)
    const itemSnapshot = await itemRef.get()

    if (!itemSnapshot.exists) {
        console.warn('Item not found')
        return Promise.resolve()
    }

    const itemData = itemSnapshot.data() || {}

    const updateData: any = {}

    const eventRef = `events/${eventId}/game_events`
    const inventoryRef = `events/${eventId}/event_team_inventory/${transactionData.team_id}`

    updateData[`${eventRef}/${generatePushId()}`] = {
        type: 'buy_shop_item',
        timestamp: transactionData.timestamp,
        team: transactionData.team_id,
        item: transactionData.item_id
    }

    updateData[`${inventoryRef}/${generatePushId()}`] = {
        item: transactionData.item_id,
        timestamp: transactionData.timestamp,
        item_text: itemData.item || ''
    }

    await admin.database().ref().update(updateData)

    return Promise.resolve()
})
