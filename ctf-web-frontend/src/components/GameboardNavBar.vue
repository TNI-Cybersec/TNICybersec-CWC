<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
    <a class="navbar-brand" :href="routePrefix">TNI-CWC Console</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault"
            aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon" />
    </button>

    <div class="collapse navbar-collapse" id="navbarsExampleDefault">
      <ul class="navbar-nav mr-auto">
        <template v-if="$store.getters['auth/isLoggedIn']">
          <li class="nav-item">
            <router-link class="nav-link" :to="`${routePrefix}/summary`" active-class="active">Summary</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="`${routePrefix}/profile`" active-class="active">Profile</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="`${routePrefix}/items`" exact-active-class="active">Item Shop</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="routePrefix" exact-active-class="active">Game</router-link>
          </li>
        </template>
      </ul>
      <ul class="navbar-nav">
        <template v-if="$store.getters['auth/isLoggedIn']">
          <li class="nav-item">
            <router-link class="nav-link" to="/" exact-active-class="active">Back to Platform</router-link>
          </li>
          <li class="nav-item" v-if="false">
            <a class="nav-link" href="javascript:void(0)" @click="logout">Logout</a>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script>
import firebase from '@/firebase.js'

export default {
  name: 'GameboardNavBar',
  computed: {
    routePrefix () {
      return `/gameboard/${this.$route.params.gameId}`
    }
  },
  methods: {
    async logout () {
      await firebase.auth().signOut()
    }
  }
}
</script>

<style scoped>

</style>
