<template>
  <div id="app">
    <template v-if="$store.getters['auth/isLoaded']">
      <component :is="navBarType"></component>
      <main role="main" class="main-container">
        <router-view></router-view>
      </main>
    </template>
    <template v-else>
      <div class="loader"></div>
    </template>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import GameboardNavBar from '@/components/GameboardNavBar'

export default {
  name: 'App',
  components: { NavBar },
  data () {
    return {
      navBarTypes: {
        default: NavBar,
        gameboard: GameboardNavBar
      }
    }
  },
  computed: {
    navBarType () {
      if (this.$route.matched.some(r => !!r.meta.navBarType)) {
        for (let i = this.$route.matched.length - 1; i >= 0; i--) {
          let route = this.$route.matched[i]
          if (typeof route.meta.navBarType === 'string' && this.navBarTypes[route.meta.navBarType]) {
            return this.navBarTypes[route.meta.navBarType]
          }
        }
      }

      return this.navBarTypes.default
    }
  },
  created () {
    this.$store.dispatch('auth/boot')
  }
}
</script>

<style scoped>
.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  position: fixed;
  left: calc(50vw - 60px);
  top: calc(50vh - 60px);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

<style lang="scss">
@import './sass/bootstrap_settings';
@import '~bootstrap/scss/bootstrap';

main.main-container > .page-container {
  min-height: 100vh;
  width: 100%;
  padding: 3.5rem 1rem 0 1rem;
}

main.main-container > .page-container.full-content {
  padding: 3.5rem 0 0 0;
}

pre code {
  display: inline-block;
  background-color: #ddd;
  padding: 0.5rem;
}
</style>
