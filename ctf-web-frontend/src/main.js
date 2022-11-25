import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'
import $ from 'jquery'
import 'bootstrap'

Vue.config.productionTip = false
window.$ = $

const unsync = sync(store, router, {
  moduleName: 'route'
})

new Vue({
  router,
  store,
  render: h => h(App),
  beforeDestroy () {
    unsync()
  }
}).$mount('#app')
