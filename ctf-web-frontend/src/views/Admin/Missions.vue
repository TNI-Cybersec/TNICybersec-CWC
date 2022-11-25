<template>
  <div class="page-container full-content">
    <h1>Missions</h1>
    <router-link class="btn mx-1 my-2 btn-primary" to="create" append>Create Mission</router-link>
    <div class="table-responsive">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <template v-for="group in missionByGroup">
          <thead :key="group.name">
          <tr>
            <th colspan="5">{{ group.name || 'Ungrouped Missions' }}</th>
          </tr>
          </thead>
          <tbody :key="`${group.name}-items`">
          <tr v-for="item in group.missions" :key="item.documentId">
            <td>{{ item.name }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.description }}</td>
            <td><router-link :to="item.documentId" append>Edit</router-link></td>
            <td><a href="javascript:void(0)" @click="deleteMission(item.documentId)">Delete</a></td>
          </tr>
          <tr>
            <td colspan="5" v-html="'&nbsp;'" />
          </tr>
          </tbody>
        </template>
      </table>
    </div>
  </div>
</template>

<script>
import RequireAuthentication from '@/mixins/RequireAuthentication'
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  mixins: [RequireAuthentication],
  name: 'Missions',
  computed: {
    ...mapState('admin', ['missions']),
    ...mapGetters('admin', ['missionByGroup'])
  },
  async created () {
    if (!this.$store.state.admin.missionsLoaded) {
      await this.load()
    }
  },
  methods: {
    ...mapActions('admin', {
      load: 'loadMissions'
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
