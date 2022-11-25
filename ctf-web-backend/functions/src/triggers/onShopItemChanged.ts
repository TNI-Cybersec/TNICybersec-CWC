import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import globalState from '../utils/globalState'

export default functions.firestore.document('/events/{eventId}/shop/{itemId}').onWrite(async (change, context) => {
    if (!globalState.isAdminInitialized) {
        admin.initializeApp()
        globalState.isAdminInitialized = true
    }

    const eventId = context.params.eventId
    const itemId = context.params.itemId

    const ref = admin.firestore().collection('public_events').doc(eventId).collection('shop').doc(itemId)
    const shopItemRef = `events/${eventId}/event_shop_items/${itemId}`
    const shopPriceRef = `events/${eventId}/event_shop_price/${itemId}`

    const itemData = change.after.data() || {}

    if (change.after.exists && !itemData.disabled) {
        await ref.set({
            name: itemData.name || 'Unknown Item',
            description: itemData.description || '',
            price: itemData.price || 0,
        })

        await admin.database().ref().update({
            [shopItemRef]: itemData.name || 'Unknown Item',
            [shopPriceRef]: itemData.price || 0
        })
    } else {
        await ref.delete()
        await admin.database().ref().update({
            [shopItemRef]: null,
            [shopPriceRef]: null
        })
    }

    return Promise.resolve()
})
