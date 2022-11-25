import FromDatabase from '../firebase-utilities/FromDatabase'

export default {
  namespaced: true,
  state: {
    gameId: '',
    generalConfigurationLoaded: false,
    generalConfiguration: {
      name: '',
      description: '',
      start: null,
      end: null,
      paused: false,
      documentId: ''
    },
    missionsLoaded: false,
    missions: [],
    itemsLoaded: false,
    items: [],
    participantsLoaded: false,
    participants: [],
    originalData: {
      generalConfiguration: null,
      missions: [],
      items: [],
      participants: []
    },
    leaderboard: [],
    leaderboardLoaded: false
  },
  mutations: {
    mutate (state, runner) {
      runner(state)
    },
    reboot (state, gameId) {
      state.gameId = gameId
      state.generalConfigurationLoaded = false
      state.missionsLoaded = false
      state.itemsLoaded = false
      state.participantsLoaded = false
      state.generalConfiguration = {
        name: '',
        description: '',
        start: null,
        end: null,
        paused: false,
        documentId: ''
      }
      state.missions = []
      state.items = []
      state.participants = []
      state.originalData = {
        generalConfiguration: null,
        missions: [],
        items: [],
        participants: []
      }
      state.leaderboard = []
      state.leaderboardLoaded = false
    },
    setGeneralConfiguration (state, doc) {
      if (!doc) {
        if (state.originalData.generalConfiguration) {
          doc = state.originalData.generalConfiguration
        } else {
          throw new Error('cannot restore data without some data available')
        }
      } else {
        state.originalData.generalConfiguration = doc
      }

      state.generalConfigurationLoaded = true

      state.generalConfiguration = {
        ...doc.data(),
        documentId: doc.id
      }

      if (state.generalConfiguration.start) {
        state.generalConfiguration.start = state.generalConfiguration.start.toDate()
      }

      if (state.generalConfiguration.end) {
        state.generalConfiguration.end = state.generalConfiguration.end.toDate()
      }
    },
    setMissions (state, docs) {
      if (!docs) {
        if (state.originalData.missions.length) {
          docs = state.originalData.missions
        } else {
          throw new Error('cannot restore data without some data available')
        }
      } else {
        state.originalData.missions = docs
      }

      state.missionsLoaded = true

      state.missions = docs.map(doc => ({
        ...doc.data(),
        documentId: doc.id
      }))

      state.missions.sort((a, b) => {
        if (a.order !== b.order) {
          if (a.order > b.order) return 1
          if (a.order < b.order) return -1
        } else if (a.name !== b.name) {
          if (a.name > b.name) return 1
          if (a.name < b.name) return -1
        } else {
          return 0
        }
      })
    },
    setMission (state, doc) {
      if (!doc) throw new Error('no document')
      let missionIndex = state.missions.findIndex(e => e.documentId === doc.id)

      if (missionIndex >= 0) {
        state.missions[missionIndex] = {
          ...doc.data(),
          documentId: doc.id
        }

        state.originalData.missions[missionIndex] = doc
      } else {
        state.missions.push({
          ...doc.data(),
          documentId: doc.id
        })
        state.originalData.missions.push(doc)
      }
    },
    resetMission (state, missionId) {
      let missionIndex = state.missions.findIndex(e => e.documentId === missionId)

      if (missionIndex < 0) {
        throw new Error('mission id not found')
      }

      if (!state.originalData.missions[missionIndex]) {
        throw new Error('cannot restore data without some data available')
      }

      let doc = state.originalData.missions[missionIndex]

      state.missions[missionIndex] = {
        ...doc.data(),
        documentId: doc.id
      }
    },
    deleteMission (state, missionId) {
      let missionIndex = state.missions.findIndex(e => e.documentId === missionId)

      if (missionIndex < 0) {
        throw new Error('mission id not found')
      }

      state.missions.splice(missionIndex, 1)
      state.originalData.missions.splice(missionIndex, 1)
    },
    setItems (state, docs) {
      if (!docs) {
        if (state.originalData.items.length) {
          docs = state.originalData.items
        } else {
          throw new Error('cannot restore data without some data available')
        }
      } else {
        state.originalData.items = docs
      }

      state.itemsLoaded = true

      state.items = docs.map(doc => ({
        ...doc.data(),
        documentId: doc.id
      }))
    },
    setItem (state, doc) {
      if (!doc) throw new Error('no document')
      let itemIndex = state.items.findIndex(e => e.documentId === doc.id)

      if (itemIndex >= 0) {
        state.items[itemIndex] = {
          ...doc.data(),
          documentId: doc.id
        }

        state.originalData.items[itemIndex] = doc
      } else {
        state.items.push({
          ...doc.data(),
          documentId: doc.id
        })
        state.originalData.items.push(doc)
      }
    },
    resetItem (state, itemId) {
      let itemIndex = state.items.findIndex(e => e.documentId === itemId)

      if (itemIndex < 0) {
        throw new Error('item id not found')
      }

      if (!state.originalData.items[itemIndex]) {
        throw new Error('cannot restore data without some data available')
      }

      let doc = state.originalData.items[itemIndex]

      state.items[itemIndex] = {
        ...doc.data(),
        documentId: doc.id
      }
    },
    deleteItem (state, itemId) {
      let itemIndex = state.items.findIndex(e => e.documentId === itemId)

      if (itemIndex < 0) {
        throw new Error('item id not found')
      }

      state.items.splice(itemIndex, 1)
      state.originalData.items.splice(itemIndex, 1)
    },
    setParticipants (state, docs) {
      if (!docs) {
        if (state.originalData.participants.length) {
          docs = state.originalData.participants
        } else {
          throw new Error('cannot restore data without some data available')
        }
      } else {
        state.originalData.participants = docs
      }

      state.participantsLoaded = true

      state.participants = docs.map(doc => ({
        ...doc.data(),
        documentId: doc.id
      }))
    },
    setParticipant (state, doc) {
      if (!doc) throw new Error('no document')
      let participantIndex = state.participants.findIndex(e => e.documentId === doc.id)

      if (participantIndex >= 0) {
        state.participants[participantIndex] = {
          ...doc.data(),
          documentId: doc.id
        }

        state.originalData.participants[participantIndex] = doc
      } else {
        state.participants.push({
          ...doc.data(),
          documentId: doc.id
        })
        state.originalData.participants.push(doc)
      }
    },
    resetParticipant (state, participantId) {
      let participantIndex = state.participants.findIndex(e => e.documentId === participantId)

      if (participantIndex < 0) {
        throw new Error('participant id not found')
      }

      if (!state.originalData.participants[participantIndex]) {
        throw new Error('cannot restore data without some data available')
      }

      let doc = state.originalData.participants[participantIndex]

      state.participants[participantIndex] = {
        ...doc.data(),
        documentId: doc.id
      }
    },
    deleteParticipant (state, participantId) {
      let participantIndex = state.participants.findIndex(e => e.documentId === participantId)

      if (participantIndex < 0) {
        throw new Error('participant id not found')
      }

      state.participants.splice(participantIndex, 1)
      state.originalData.participants.splice(participantIndex, 1)
    },
    setLeaderboard (state, leaderboard) {
      state.leaderboardLoaded = true
      state.leaderboard = leaderboard
    }
  },
  actions: {
    boot (store, gameId) {
      store.commit('reboot', gameId)
    },
    halt (store) {
      let leaderboardRef = FromDatabase.getLeaderboardRef(store.state.gameId)
      leaderboardRef.off('value')

      store.commit('reboot', null)
    },
    async loadGeneralConfiguration (store) {
      let generalConfiguration = await FromDatabase.getGeneralConfiguration(store.state.gameId)
      store.commit('setGeneralConfiguration', generalConfiguration)
    },
    async saveGeneralConfiguration (store) {
      await FromDatabase.updateGeneralConfiguration(store.state.gameId, store.state.generalConfiguration)
    },
    async resetGeneralConfiguration (store) {
      store.commit('setGeneralConfiguration')
    },
    async loadMissions (store) {
      let missions = await FromDatabase.getMissions(store.state.gameId)

      let docs = []
      missions.forEach(doc => docs.push(doc))
      store.commit('setMissions', docs)
    },
    async saveMission (store, missionId) {
      let mission = store.state.missions.find(e => e.documentId === missionId)
      await FromDatabase.updateMission(store.state.gameId, missionId, mission)

      let newDoc = await FromDatabase.getMission(store.state.gameId, missionId)
      store.commit('setMission', newDoc)
    },
    async addMission (store, mission) {
      let docRef = await FromDatabase.addMission(store.state.gameId, mission)

      let newDoc = await FromDatabase.getMission(store.state.gameId, docRef.id)
      store.commit('setMission', newDoc)
    },
    async resetMission (store, missionId) {
      store.commit('resetMission', missionId)
    },
    async deleteMission (store, missionId) {
      await FromDatabase.deleteMission(store.state.gameId, missionId)
      store.commit('deleteMission', missionId)
    },
    async loadItems (store) {
      let items = await FromDatabase.getShopItems(store.state.gameId)

      let docs = []
      items.forEach(doc => docs.push(doc))
      store.commit('setItems', docs)
    },
    async saveItem (store, itemId) {
      let item = store.state.items.find(e => e.documentId === itemId)
      await FromDatabase.updateShopItem(store.state.gameId, itemId, item)

      let newDoc = await FromDatabase.getShopItem(store.state.gameId, itemId)
      store.commit('setItem', newDoc)
    },
    async addItem (store, item) {
      let docRef = await FromDatabase.addShopItem(store.state.gameId, item)

      let newDoc = await FromDatabase.getShopItem(store.state.gameId, docRef.id)
      store.commit('setItem', newDoc)
    },
    async resetItem (store, itemId) {
      store.commit('resetItem', itemId)
    },
    async deleteItem (store, itemId) {
      await FromDatabase.deleteShopItem(store.state.gameId, itemId)
      store.commit('deleteItem', itemId)
    },
    async loadParticipants (store) {
      let participants = await FromDatabase.getParticipants(store.state.gameId)

      let docs = []
      participants.forEach(doc => docs.push(doc))
      store.commit('setParticipants', docs)
    },
    async saveParticipant (store, participantId) {
      let participant = store.state.participants.find(e => e.documentId === participantId)
      await FromDatabase.updateParticipant(store.state.gameId, participantId, participant)

      let newDoc = await FromDatabase.getParticipant(store.state.gameId, participantId)
      store.commit('setParticipant', newDoc)
    },
    async addParticipant (store, participant) {
      let docRef = await FromDatabase.addParticipant(store.state.gameId, participant)

      let newDoc = await FromDatabase.getParticipant(store.state.gameId, docRef.id)
      store.commit('setParticipant', newDoc)
    },
    async resetParticipant (store, participantId) {
      store.commit('resetParticipant', participantId)
    },
    async deleteParticipant (store, participantId) {
      await FromDatabase.deleteParticipant(store.state.gameId, participantId)
      store.commit('deleteParticipant', participantId)
    },
    async loadLiveScoreboard (store) {
      let leaderboardRef = FromDatabase.getLeaderboardRef(store.state.gameId)

      leaderboardRef.on('value', snapshots => {
        let scores = snapshots.val() || {}

        let leaderboard = store.state.participants.map(p => {
          return {
            name: p.name,
            score: scores[p.documentId] || 0
          }
        }).sort((a, b) => b.score - a.score)

        store.commit('setLeaderboard', leaderboard)
      })

      return Promise.resolve()
    }
  },
  getters: {
    missionByGroup (state) {
      let groups = []

      for (let i = 0; i < state.missions.length; i++) {
        let mission = state.missions[i]
        let groupIndex = groups.findIndex(group => {
          return group.name === mission.group
        })

        if (groupIndex >= 0) {
          groups[groupIndex].missions.push(mission)
        } else {
          groups.push({
            name: mission.group,
            missions: [mission]
          })
        }
      }

      return groups
    }
  }
}
