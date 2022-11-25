<template>
  <router-view />
</template>

<script>
export default {
  name: 'Gameboard',
  async created () {
    await this.$store.dispatch('gameboard/boot', this.$route.params.gameId)
  },
  async beforeRouteUpdate (to, from, next) {
    if (to.params.gameId !== from.params.gameId) {
      await this.$store.dispatch('gameboard/halt')
      next()
      await this.$store.dispatch('gameboard/boot', this.$route.params.gameId)
    } else {
      next()
    }
  },
  async beforeDestroy () {
    await this.$store.dispatch('gameboard/halt')
  }
}
</script>

<style scoped>

</style>
