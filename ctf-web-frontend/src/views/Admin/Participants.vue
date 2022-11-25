<template>
  <div class="page-container full-content">
    <h1>Participants</h1>
    <div class="table-responsive">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Members</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in participants" :key="item.documentId">
            <td>{{ item.documentId }}</td>
            <td>{{ item.name }}</td>
            <td>{{ Object.keys(item.members).length }}</td>
            <td><router-link :to="item.documentId" append>Edit</router-link></td>
            <td><a href="javascript:void(0)" @click="deleteParticipant(item.documentId)">Delete</a></td>
          </tr>
        </tbody>
      </table>
    </div>
    <router-link class="btn mx-1 btn-primary" to="create" append>Add Participant</router-link>
  </div>
</template>

<script>
import RequireAuthentication from '@/mixins/RequireAuthentication'
import { mapActions, mapState } from 'vuex'

export default {
  mixins: [RequireAuthentication],
  name: 'Participants',
  computed: {
    ...mapState('admin', ['participants'])
  },
  async created () {
    if (!this.$store.state.admin.participantsLoaded) {
      await this.load()
    }
  },
  methods: {
    ...mapActions('admin', {
      load: 'loadParticipants'
    }),
    async deleteParticipant (itemId) {
      let confirmation = confirm(`Delete team ID: \`${itemId}\` ?`)

      if (confirmation) {
        await this.$store.dispatch('admin/deleteParticipant', itemId)
      }
    }
  }
}
</script>

<style scoped>

</style>
