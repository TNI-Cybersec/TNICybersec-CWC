import firebase from '@/firebase.js'

export default {
  namespaced: true,
  state: {
    currentUser: null
  },
  mutations: {
    setCurrentUser (state, user) {
      state.currentUser = user || false
    }
  },
  actions: {
    boot (store) {
      firebase.auth().onAuthStateChanged(user => {
        store.commit('setCurrentUser', user)
      })
    }
  },
  getters: {
    isLoaded (state) {
      return state.currentUser !== null
    },
    isLoggedIn (state) {
      return !!state.currentUser
    },
    displayName (state) {
      if (state.currentUser) return state.currentUser.displayName
      else return ''
    },
    displayPicture (state) {
      if (state.currentUser) return state.currentUser.photoURL
      else return ''
    }
  }
}
