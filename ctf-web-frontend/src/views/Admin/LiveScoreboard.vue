<template>
  <div class="page-container full-content">
    <h1>Scoreboard</h1>
    <div class="table-responsive">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th>No. #</th>
            <th>Team Name</th>
            <th>Current Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(team, index) in leaderboard" :key="`admin-leaderboard-${index+1}`">
            <td>{{ index + 1 }}</td>
            <td>{{ team.name }}</td>
            <td>{{ team.score }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import RequireAuthentication from '@/mixins/RequireAuthentication'
import { mapActions, mapState } from 'vuex'

export default {
  mixins: [RequireAuthentication],
  name: 'LiveScoreboard',
  computed: {
    ...mapState('admin', ['leaderboard'])
  },
  async created () {
    if (!this.$store.state.admin.participantsLoaded) {
      await this.loadParticipants()
    }

    if (!this.$store.state.admin.leaderboardLoaded) {
      await this.load()
    }
  },
  methods: {
    ...mapActions('admin', {
      loadParticipants: 'loadParticipants',
      load: 'loadLiveScoreboard'
    }),
    async deleteMission (missionId) {
      let confirmation = confirm(`Delete mission ID: \`${missionId}\` ?`)

      if (confirmation) {
        await this.$store.dispatch('admin/deleteMission', missionId)
      }
    }
  }
}
</script>

<style scoped>

</style>
