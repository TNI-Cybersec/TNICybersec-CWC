import Vue from 'vue'
import Vuex from 'vuex'
import Auth from './auth'
import Admin from './admin'
import Gameboard from './gameboard'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth: Auth,
    admin: Admin,
    gameboard: Gameboard
  }
})
