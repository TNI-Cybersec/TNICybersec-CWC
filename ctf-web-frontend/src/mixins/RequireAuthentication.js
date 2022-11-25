import { mapGetters } from 'vuex'

export default {
  computed: mapGetters({ isLoggedIn: 'auth/isLoggedIn' }),
  watch: {
    isLoggedIn: {
      immediate: true,
      handler (isLoggedIn) {
        if (!isLoggedIn) {
          this.$router.push({
            name: 'login',
            query: {
              next: this.$route.fullPath
            }
          })
        }
      }
    }
  }
}
