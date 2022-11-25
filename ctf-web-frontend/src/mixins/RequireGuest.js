import { mapGetters } from 'vuex'

export default {
  computed: mapGetters({ isLoggedIn: 'auth/isLoggedIn' }),
  watch: {
    isLoggedIn: {
      immediate: true,
      handler (isLoggedIn) {
        if (isLoggedIn) {
          this.$router.push({
            path: this.$route.query.next || '/'
          })
        }
      }
    }
  }
}
