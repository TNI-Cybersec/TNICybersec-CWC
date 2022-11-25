<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
    <a class="navbar-brand" href="/">TNI-CWC</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarsExampleDefault">
      <ul class="navbar-nav mr-auto">
        <template v-if="$store.getters['auth/isLoggedIn']">
          <li class="nav-item">
            <router-link class="nav-link" to="/my-events" exact-active-class="active">My Events</router-link>
          </li>
          <li class="nav-item d-none d-lg-block">
            <router-link class="nav-link" to="/admin" active-class="active">Administration</router-link>
          </li>
          <li>
            <router-link class="nav-link"
                         to="/account"
                         active-class="active">My Account</router-link>
          </li>
          <li class="nav-item">
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
  name: 'NavBar',
  methods: {
    async logout () {
      await firebase.auth().signOut()
    }
  }
}
</script>

<style scoped>
</style>
