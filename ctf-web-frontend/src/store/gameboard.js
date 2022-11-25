import FromDatabase from '@/firebase-utilities/FromDatabase'

export default {
  namespaced: true,
  state: {
    eventId: '',
    gameInfo: {
      name: '',
      description: '',
      start: new Date(0),
      end: new Date(Date.now() + 31536000000)
    },
    missions: [],
    shopItems: [],
    teams: [],
    answeredJeopardyMissions: {},
    kothStatus: {},
    teamId: '',
    currentScore: -1,
    leaderboard: [],
    tenLatestEvent: [],
    teamTenLatestEvent: [],
    teamInventory: [],
    scoreHistoryByTeam: []
  },
  mutations: {
    setEventId (state, eventId) {
      state.eventId = eventId
    },
    setGameInfo (state, gameInfo) {
      if (gameInfo.start && !(gameInfo.start instanceof Date)) gameInfo.start = gameInfo.start.toDate()
      if (!gameInfo.start) gameInfo.start = state.gameInfo.start

      if (gameInfo.end && !(gameInfo.end instanceof Date)) gameInfo.end = gameInfo.end.toDate()
      if (!gameInfo.end) gameInfo.end = state.gameInfo.end

      state.gameInfo = gameInfo
    },
    setMissions (state, docs) {
      let rawMissions = docs.map(doc => ({
        ...doc.data(),
        documentId: doc.id
      }))

      rawMissions.sort((a, b) => {
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

      let missions = rawMissions.filter(e => !e.parent)

      for (let i = 0; i < missions.length; i++) {
        let mission = missions[i]
        let children = rawMissions.filter(e => e.parent === mission.documentId)

        if (children.length > 0) {
          mission.children = children
        }
      }

      state.missions = missions
    },
    setShopItems (state, docs) {
      state.shopItems = docs.map(doc => ({
        ...doc.data(),
        documentId: doc.id
      }))
    },
    setTeams (state, docs) {
      state.teams = docs.map(doc => ({
        ...doc.data(),
        documentId: doc.id
      }))
    },
    setTeamId (state, teamId) {
      state.teamId = teamId
    },
    setCurrentScore (state, currentScore) {
      state.currentScore = currentScore
    },
    setAnsweredJeopardyMissions (state, answeredJeopardyMissions) {
      state.answeredJeopardyMissions = answeredJeopardyMissions || {}
    },
    setLeaderboard (state, leaderboard) {
      state.leaderboard = leaderboard
    },
    setTenLatestEvent (state, tenLatestEvent) {
      state.tenLatestEvent = tenLatestEvent
    },
    setTeamTenLatestEvent (state, teamTenLatestEvent) {
      state.teamTenLatestEvent = teamTenLatestEvent
    },
    setTeamInventory (state, teamInventory) {
      state.teamInventory = teamInventory
    },
    setKothStatus (state, kothStatus) {
      state.kothStatus = kothStatus
    },
    setScoreHistoryByTeam (state, scoreHistoryByTeam) {
      scoreHistoryByTeam.sort(e => e.totalScore)
      state.scoreHistoryByTeam = scoreHistoryByTeam
    },
    addScoreHistoryByTeam (state, transaction) {
      let team = state.scoreHistoryByTeam.find(e => e.team === transaction.team)

      if (!team) {
        team = {
          team: transaction.team,
          history: [
            {
              team: transaction.team,
              score: 0,
              currentScore: 0,
              timestamp: 0
            }
          ],
          totalScore: 0
        }

        state.scoreHistoryByTeam.push(team)
      }

      transaction.currentScore = transaction.score

      if (team.history.length) {
        transaction.currentScore += team.history[team.history.length - 1].currentScore
      }

      team.history.push(transaction)
      team.totalScore += transaction.score
      state.scoreHistoryByTeam.sort(e => e.totalScore)
    }
  },
  actions: {
    async boot (store, eventId) {
      store.commit('setEventId', eventId)

      await Promise.all([
        store.dispatch('loadGameInfo', eventId),
        store.dispatch('loadMissions', eventId),
        store.dispatch('loadShopItems', eventId),
        store.dispatch('loadTeams', eventId),
        store.dispatch('loadMyTeamId', eventId)
      ])

      await Promise.all([
        store.dispatch('loadLiveScore', eventId),
        store.dispatch('loadJeopardyAnswered', eventId),
        store.dispatch('loadLeaderboard', eventId),
        store.dispatch('loadTenLatestEvent', eventId),
        store.dispatch('loadTeamTenLatestEvent', eventId),
        store.dispatch('loadTeamInventory', eventId),
        store.dispatch('loadKothStatus', eventId),
        store.dispatch('loadScoreHistory', eventId)
      ])
    },
    async halt (store) {
      let liveScoreRef = FromDatabase.getLiveScoreRef(store.state.eventId, store.state.teamId)
      let jeopardyAnsweredRef = FromDatabase.getJeopardyAnsweredRef(store.state.eventId, store.state.teamId)
      let leaderboardRef = FromDatabase.getLeaderboardRef(store.state.eventId)
      let tenLatestEventRef = FromDatabase.getTenLatestEventRef(store.state.eventId)
      let teamTenLatestEventRef = FromDatabase.getTeamTenLatestEventRef(store.state.eventId, store.state.teamId)
      let teamInventoryRef = FromDatabase.getTeamInventoryRef(store.state.eventId, store.state.teamId)
      let kothStatusRef = FromDatabase.getKothStatusRef(store.state.eventId)
      let scoreHistoryRef = FromDatabase.getScoreHistoryRef(store.state.eventId)

      liveScoreRef.off('value')
      jeopardyAnsweredRef.off('value')
      leaderboardRef.off('value')
      tenLatestEventRef.off('value')
      teamTenLatestEventRef.off('value')
      teamInventoryRef.off('value')
      kothStatusRef.off('value')
      scoreHistoryRef.off('child_added')

      store.commit('setGameInfo', {
        name: '',
        description: '',
        start: new Date(0),
        end: new Date(Date.now() + 31536000000)
      })
      store.commit('setMissions', [])
      store.commit('setShopItems', [])
      store.commit('setTeams', [])
      store.commit('setLeaderboard', [])
      store.commit('setTenLatestEvent', [])
      store.commit('setTeamTenLatestEvent', [])
      store.commit('setTeamInventory', [])
      store.commit('setScoreHistoryByTeam', [])
      store.commit('setKothStatus', {})
      store.commit('setTeamId', '')
      store.commit('setCurrentScore', -1)
      store.commit('setAnsweredJeopardyMissions', {})
      store.commit('setEventId', '')
    },
    async loadGameInfo (store, eventId) {
      let snapshot = await FromDatabase.getPublicEvent(eventId)

      if (snapshot.exists) {
        store.commit('setGameInfo', snapshot.data())
      }
    },
    async loadMissions (store, eventId) {
      let snapshot = await FromDatabase.getPublicMissions(eventId)

      let docs = []
      snapshot.forEach(doc => docs.push(doc))

      store.commit('setMissions', docs)
    },
    async loadShopItems (store, eventId) {
      let snapshot = await FromDatabase.getPublicShopItems(eventId)

      let docs = []
      snapshot.forEach(doc => docs.push(doc))
      store.commit('setShopItems', docs)
    },
    async loadTeams (store, eventId) {
      let snapshot = await FromDatabase.getPublicTeams(eventId)

      let docs = []
      snapshot.forEach(doc => docs.push(doc))
      store.commit('setTeams', docs)
    },
    async loadMyTeamId (store, eventId) {
      let snapshot = await FromDatabase.getMyTeam(eventId)

      if (snapshot.exists()) {
        let teamId = snapshot.val()
        store.commit('setTeamId', teamId)
      }
    },
    loadLiveScore (store, eventId) {
      let liveScoreRef = FromDatabase.getLiveScoreRef(eventId, store.state.teamId)

      liveScoreRef.on('value', snapshot => {
        store.commit('setCurrentScore', snapshot.val() || 0)
      })

      return Promise.resolve()
    },
    loadJeopardyAnswered (store, eventId) {
      let jeopardyAnsweredRef = FromDatabase.getJeopardyAnsweredRef(eventId, store.state.teamId)

      jeopardyAnsweredRef.on('value', snapshot => {
        store.commit('setAnsweredJeopardyMissions', snapshot.val() || {})
      })

      return Promise.resolve()
    },
    loadLeaderboard (store, eventId) {
      let leaderboardRef = FromDatabase.getLeaderboardRef(eventId, store.state.teamId)

      leaderboardRef.on('value', snapshots => {
        let leaderboard = []

        snapshots.forEach(snapshot => {
          let team = store.state.teams.find(e => e.documentId === snapshot.key)

          let entry = {
            id: snapshot.key,
            name: team ? team.name : 'Unknown Team',
            score: snapshot.val()
          }

          leaderboard.unshift(entry)
        })

        store.commit('setLeaderboard', leaderboard)
      })

      return Promise.resolve()
    },
    loadTenLatestEvent (store, eventId) {
      let tenLatestEventRef = FromDatabase.getTenLatestEventRef(eventId)

      tenLatestEventRef.on('value', snapshots => {
        let events = []

        snapshots.forEach(snapshot => {
          let data = snapshot.val()

          let team = store.state.teams.find(e => e.documentId === data.team)

          let entry = {
            id: snapshot.key,
            teamName: team ? team.name : 'Unknown Team',
            objectType: '',
            eventType: ''
          }

          switch (data.type) {
            case 'jeopardy_flag_captured': {
              entry.eventType = 'Capture Jeopardy Flag'
              break
            }
            case 'king_of_the_hill_flag_captured': {
              if (data.team === data.lastTeam) {
                entry.eventType = 'Capture Hill Flag'
              } else {
                entry.eventType = 'Gain an interval points from the hill'
              }
              break
            }
            case 'king_of_the_hill_flag_lost': {
              // ignore this event
              return
            }
            case 'buy_shop_item': {
              // ignore this event
              return
            }
            default: {
              entry.eventType = data.type || 'Unknown Event'
            }
          }

          events.unshift(entry)
        })

        store.commit('setTenLatestEvent', events)
      })

      return Promise.resolve()
    },
    loadTeamTenLatestEvent (store, eventId) {
      let teamTenLatestEventRef = FromDatabase.getTeamTenLatestEventRef(eventId, store.state.teamId)

      teamTenLatestEventRef.on('value', snapshots => {
        let events = []

        snapshots.forEach(snapshot => {
          let data = snapshot.val()

          let team = store.state.teams.find(e => e.documentId === data.team)

          let entry = {
            id: snapshot.key,
            teamName: team ? team.name : 'Unknown Team',
            eventType: ''
          }

          switch (data.type) {
            case 'jeopardy_flag_captured': {
              entry.objectType = 'Flag'
              entry.eventType = 'Capture Jeopardy Flag'
              break
            }
            case 'king_of_the_hill_flag_captured': {
              entry.objectType = 'Hill'
              if (data.team === data.lastTeam) {
                entry.eventType = 'Capture Hill Flag'
              } else {
                entry.eventType = 'Gain an interval points from the hill'
              }
              break
            }
            case 'king_of_the_hill_flag_lost': {
              // ignore this event
              return
            }
            case 'buy_shop_item': {
              entry.objectType = 'Item'
              entry.eventType = 'Buy an Item'
              break
            }
            default: {
              entry.eventType = data.type || 'Unknown Event'
            }
          }

          events.unshift(entry)
        })

        store.commit('setTeamTenLatestEvent', events)
      })

      return Promise.resolve()
    },
    loadTeamInventory (store, eventId) {
      let teamInventoryRef = FromDatabase.getTeamInventoryRef(eventId, store.state.teamId)

      teamInventoryRef.on('value', snapshots => {
        let teamInventory = []

        snapshots.forEach(snapshot => {
          let data = snapshot.val()

          teamInventory.push({
            id: snapshot.key,
            item: store.state.shopItems.find(e => e.documentId === data.item),
            item_text: data.item_text,
            timestamp: new Date(data.timestamp)
          })
        })

        store.commit('setTeamInventory', teamInventory)
      })

      return Promise.resolve()
    },
    loadKothStatus (store, eventId) {
      let kothStatusRef = FromDatabase.getKothStatusRef(eventId)

      kothStatusRef.on('value', snapshot => {
        store.commit('setKothStatus', snapshot.val() || {})
      })

      return Promise.resolve()
    },
    loadScoreHistory (store, eventId) {
      let scoreHistoryRef = FromDatabase.getScoreHistoryRef(eventId)

      scoreHistoryRef.on('child_added', snapshot => {
        let data = snapshot.val()

        store.commit('addScoreHistoryByTeam', {
          id: snapshot.key,
          score: data.score,
          team: store.state.teams.find(e => e.documentId === data.team) || null,
          timestamp: new Date(data.timestamp)
        })
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
    },
    myTeamName (state) {
      if (!state.teamId || !state.teams.length) return 'Loading...'

      let team = state.teams.find(e => e.documentId === state.teamId)

      if (team) return team.name
      else return 'Unknown Team'
    }
  }
}
