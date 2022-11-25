import firebase from '@/firebase'
import FirestoreTimestamp from '@/firebase-utilities/FirestoreTimestamp'

export default class FromDatabase {
  static async updateUserProfile (userProfile) {
    const user = firebase.auth().currentUser
    const firebaseAuthUpdate = {}
    const firestoreUpdate = {}

    firebaseAuthUpdate.displayName = userProfile.displayName || ''
    firestoreUpdate.name = userProfile.displayName || ''

    await Promise.all([
      user.updateProfile(firebaseAuthUpdate),
      firebase.firestore().collection('profiles').doc(user.uid).set(firestoreUpdate)
    ])
  }

  static async getMyAdminEvents () {
    let userId = firebase.auth().currentUser.uid
    let ref = firebase.firestore().collection('events').where(`admins.${userId}`, 'in', ['owner', 'editor'])
    let querySnapshot = await ref.get()

    let results = []

    querySnapshot.forEach(doc => {
      const docData = doc.data()

      results.push({
        ...docData,
        documentId: doc.id,
        myRole: docData.admins[userId]
      })
    })

    return results
  }

  static async getPublicEvent (eventId) {
    let ref = firebase.firestore().collection('public_events').doc(eventId)
    return ref.get()
  }

  static async getPublicMissions (eventId) {
    let ref = firebase.firestore().collection('public_events').doc(eventId).collection('missions')
    return ref.get()
  }

  static async getPublicShopItems (eventId) {
    let ref = firebase.firestore().collection('public_events').doc(eventId).collection('shop')
    return ref.get()
  }

  static async getPublicTeams (eventId) {
    let ref = firebase.firestore().collection('public_events').doc(eventId).collection('teams')
    return ref.get()
  }

  static getLiveScoreRef (eventId, teamId) {
    return firebase.database().ref('events').child(eventId).child('event_team_score').child(teamId)
  }

  static getJeopardyAnsweredRef (eventId, teamId) {
    return firebase.database().ref('events').child(eventId).child('event_answers').child(teamId)
  }

  static getLeaderboardRef (eventId) {
    return firebase.database().ref('events').child(eventId).child('event_team_score').orderByValue().limitToLast(10)
  }

  static getScoreboardRef (eventId) {
    return firebase.database().ref('events').child(eventId).child('event_team_score').orderByValue()
  }

  static getTenLatestEventRef (eventId) {
    return firebase.database().ref('events').child(eventId).child('game_events').orderByKey().limitToLast(15)
  }

  static getTeamTenLatestEventRef (eventId, teamId) {
    return firebase.database().ref('events').child(eventId).child('game_events').orderByChild('team').equalTo(teamId).limitToLast(15)
  }

  static getTeamInventoryRef (eventId, teamId) {
    return firebase.database().ref('events').child(eventId).child('event_team_inventory').child(teamId)
  }

  static getScoreHistoryRef (eventId) {
    // let firstTimePrefix = PushId.getTimePrefix(Date.now() - 28800000)
    return firebase.database().ref('events').child(eventId).child('event_score_transactions').orderByKey()
  }

  static getKothStatusRef (eventId) {
    return firebase.database().ref('events').child(eventId).child('event_koth_status')
  }

  static getTeamNameRef (eventId) {
    return firebase.database().ref('events').child(eventId).child('event_teams')
  }

  static async getMyTeam (eventId) {
    let userId = firebase.auth().currentUser.uid
    let ref = firebase.database().ref('events').child(eventId).child('event_members').child(userId)

    return ref.once('value')
  }

  static async getEventName (eventId) {
    let ref = firebase.database().ref('events').child(eventId).child('event_info').child('name')
    let snapshot = await ref.once('value')

    return snapshot.val() || ''
  }

  static async checkAnswer (eventId, flag) {
    let ref = firebase.database().ref('events').child(eventId).child('event_flags').orderByValue().equalTo(flag).limitToFirst(1)

    try {
      let snapshot = await ref.once('value')

      let key = false

      snapshot.forEach(e => {
        key = e.key
      })

      return key
    } catch (e) {
      return false
    }
  }

  static async answerFlag (eventId, teamId, missionId, flag) {
    let ref = firebase.database().ref('events').child(eventId).child('event_answers').child(teamId).child(missionId)

    try {
      await ref.set(flag)
      return true
    } catch (e) {
      return false
    }
  }

  static async buyShopItem (eventId, teamId, itemId) {
    let ref = firebase.database().ref('events').child(eventId).child('event_user_shopping')

    try {
      await ref.push({
        item_id: itemId,
        team_id: teamId,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      })

      return true
    } catch (e) {
      return false
    }
  }

  static async getJoinedEvents () {
    let userId = firebase.auth().currentUser.uid
    let ref = firebase.firestore().collection('profiles').doc(userId).collection('joined_events')
    let querySnapshot = await ref.get()

    let results = []

    querySnapshot.forEach(doc => {
      const docData = doc.data()

      if (docData.start) {
        docData.start = docData.start.toDate()
      } else {
        docData.start = new Date(0)
      }

      if (docData.end) {
        docData.end = docData.end.toDate()
      } else {
        docData.end = new Date(Date.now() + 31536000000)
      }

      let splitDocId = doc.id.split('%')
      docData.eventId = splitDocId[0]
      docData.teamId = splitDocId[1]

      results.push({
        ...docData,
        documentId: doc.id
      })
    })

    return results
  }

  static async createEvent (generalConfiguration) {
    let userId = firebase.auth().currentUser.uid
    let ref = firebase.firestore().collection('events')

    return ref.add({
      name: '',
      description: '',
      ...generalConfiguration,
      start: null,
      end: null,
      paused: false,
      admins: {
        [userId]: 'owner'
      }
    })
  }

  static async getGeneralConfiguration (gameId) {
    let ref = firebase.firestore().collection('events').doc(gameId)
    return ref.get()
  }

  static async updateGeneralConfiguration (gameId, generalConfiguration) {
    let ref = firebase.firestore().collection('events').doc(gameId)

    let updateData = {}

    if (generalConfiguration.hasOwnProperty('name')) {
      updateData.name = generalConfiguration.name
    }

    if (generalConfiguration.hasOwnProperty('description')) {
      updateData.description = generalConfiguration.description
    }

    if (generalConfiguration.hasOwnProperty('start')) {
      updateData.start = generalConfiguration.start ? FirestoreTimestamp.fromDate(generalConfiguration.start) : null
    }

    if (generalConfiguration.hasOwnProperty('end')) {
      updateData.end = generalConfiguration.end ? FirestoreTimestamp.fromDate(generalConfiguration.end) : null
    }

    if (generalConfiguration.hasOwnProperty('paused')) {
      updateData.paused = generalConfiguration.paused
    }

    await ref.update(generalConfiguration)
  }

  static async getMissions (gameId) {
    let ref = firebase.firestore().collection('events').doc(gameId).collection('missions')
    return ref.get()
  }

  static async getMission (gameId, missionId) {
    let ref = firebase.firestore().collection('events').doc(gameId).collection('missions').doc(missionId)
    return ref.get()
  }

  static async updateMission (gameId, missionId, updateData) {
    let ref = firebase.firestore().collection('events').doc(gameId)
      .collection('missions').doc(missionId)

    delete updateData.documentId

    await ref.update(updateData)

    updateData.documentId = missionId
  }

  static async addMission (gameId, mission) {
    let ref = firebase.firestore().collection('events').doc(gameId).collection('missions')
    return ref.add(mission)
  }

  static async deleteMission (gameId, missionId) {
    let ref = firebase.firestore().collection('events').doc(gameId)
      .collection('missions').doc(missionId)

    await ref.delete()
  }

  static async getShopItems (gameId) {
    let ref = firebase.firestore().collection('events').doc(gameId).collection('shop')
    return ref.get()
  }

  static async getShopItem (gameId, itemId) {
    let ref = firebase.firestore().collection('events').doc(gameId).collection('shop').doc(itemId)
    return ref.get()
  }

  static async updateShopItem (gameId, itemId, updateData) {
    let ref = firebase.firestore().collection('events').doc(gameId)
      .collection('shop').doc(itemId)

    delete updateData.documentId

    await ref.update(updateData)

    updateData.documentId = itemId
  }

  static async addShopItem (gameId, shopItem) {
    let ref = firebase.firestore().collection('events').doc(gameId).collection('shop')
    return ref.add(shopItem)
  }

  static async deleteShopItem (gameId, itemId) {
    let ref = firebase.firestore().collection('events').doc(gameId)
      .collection('shop').doc(itemId)

    await ref.delete()
  }

  static async getParticipants (gameId) {
    let ref = firebase.firestore().collection('events').doc(gameId).collection('teams')
    return ref.get()
  }

  static async getParticipant (gameId, participantId) {
    let ref = firebase.firestore().collection('events').doc(gameId).collection('teams').doc(participantId)
    return ref.get()
  }

  static async updateParticipant (gameId, participantId, updateData) {
    let ref = firebase.firestore().collection('events').doc(gameId)
      .collection('teams').doc(participantId)

    delete updateData.documentId

    await ref.update(updateData)

    updateData.documentId = participantId
  }

  static async addParticipant (gameId, mission) {
    let ref = firebase.firestore().collection('events').doc(gameId).collection('teams')
    return ref.add(mission)
  }

  static async deleteParticipant (gameId, participantId) {
    let ref = firebase.firestore().collection('events').doc(gameId)
      .collection('teams').doc(participantId)

    await ref.delete()
  }

  static async getProfileById (userId) {
    let ref = firebase.firestore().collection('profiles').doc(userId)

    return ref.get()
  }

  static async getProfilesByName (name) {
    let ref = firebase.firestore().collection('profiles').where('name', '==', name)
    let querySnapshot = await ref.get()

    let results = []

    querySnapshot.forEach(doc => {
      results.push({
        ...doc.data(),
        documentId: doc.id
      })
    })

    return results
  }
}
