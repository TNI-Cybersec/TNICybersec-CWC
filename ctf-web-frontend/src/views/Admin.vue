<template>
  <div class="page-container full-content">
    <div class="container-fluid">
      <div class="row">
        <nav class="col-md-2 d-none d-md-block bg-white sidebar">
          <div class="sidebar-sticky">
            <ul class="nav flex-column">
              <li class="nav-item">
                <router-link class="nav-link" active-class="active" :to="`/admin/${gameId}/general-configuration`">
                  General Configuration
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" active-class="active" :to="`/admin/${gameId}/missions`">
                  Missions
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" active-class="active" :to="`/admin/${gameId}/item-shop`">
                  Item Shop
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" active-class="active" :to="`/admin/${gameId}/participants`">
                  Participants
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" active-class="active" :to="`/admin/${gameId}/leaderboard`">
                  Live Scoreboard
                </router-link>
              </li>
              <li class="nav-item" v-if="false">
                <router-link class="nav-link" active-class="active" :to="`/admin/${gameId}/game-events`">
                  Game Events
                </router-link>
              </li>
            </ul>
          </div>
        </nav>
        <div class="col-md-9 ml-sm-auto col-lg-10 pt-3 menu-content bg-light">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RequireAuthentication from '@/mixins/RequireAuthentication.js'
import { mapActions } from 'vuex'

export default {
  mixins: [RequireAuthentication],
  name: 'Admin',
  computed: {
    gameId () {
      return this.$store.state.admin.gameId
    }
  },
  async created () {
    await this.boot(this.$route.params.gameId)
  },
  async beforeRouteUpdate (to, from, next) {
    if (from.params.gameId !== to.params.gameId) await this.boot(to.params.gameId)
    next()
  },
  async beforeRouteLeave (to, from, next) {
    await this.halt()
    next()
  },
  methods: {
    ...mapActions('admin', ['boot', 'halt'])
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100; /* Behind the navbar */
  padding: 0;
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}

.sidebar-sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 56px; /* Height of navbar */
  height: calc(100vh - 56px);
  padding-top: .5rem;
  overflow-x: hidden;
  overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
}

.sidebar .nav-link {
  font-weight: 500;
  color: #333;
}

.sidebar .nav-link .feather {
  margin-right: 4px;
  color: #999;
}

.sidebar .nav-link.active {
  color: #007bff;
}

.sidebar .nav-link:hover .feather,
.sidebar .nav-link.active .feather {
  color: inherit;
}

.sidebar-heading {
  font-size: .75rem;
  text-transform: uppercase;
}

.menu-content {
  min-height: calc(100vh - 56px);
  background-color: white;
}
</style>
