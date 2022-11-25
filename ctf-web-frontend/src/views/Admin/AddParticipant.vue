<template>
  <div class="page-container full-content">
    <h1 class="mb-4">Add Participant</h1>
    <div class="row form">
      <div class="col-12">
        <label for="name">Name</label>
        <input id="name" type="text" class="form-control" v-model="participant.name">
      </div>
      <div class="col-12">
        <label for="members">Members</label>
        <ol id="members">
          <li v-for="(member, memberId) in participant.members" :key="memberId">
            <span style="margin-right: 1rem;">{{ member.name }}</span><a href="javascript:void(0)" @click="removeMember(memberId)">[Remove]</a>
          </li>
        </ol>
        <div class="row">
          <div class="col-auto my-auto">
            <label class="m-0" for="add-member">Add Member</label>
          </div>
          <div class="col-auto px-0">
            <input id="add-member" class="form-control" type="text" placeholder="User ID" v-model="addMemberId" />
          </div>
          <div class="col-auto">
            <button class="btn btn-secondary" @click="addMember" :disabled="adding">Add</button>
          </div>
        </div>
      </div>
      <div class="col-12">
        <a class="btn mx-1 btn-primary" href="javascript:void(0)" @click="save">Save</a>
        <a class="btn mx-1 btn-primary" href="javascript:void(0)" @click="cancel">Cancel</a>
        <p class="m-0" v-if="saving">Saving...</p>
      </div>
    </div>
  </div>
</template>

<script>
import RequireAuthentication from '@/mixins/RequireAuthentication'
import FromDatabase from '@/firebase-utilities/FromDatabase'

export default {
  mixins: [RequireAuthentication],
  name: 'AddParticipant',
  data () {
    return {
      saving: false,
      adding: false,
      addMemberId: '',
      participant: {
        name: '',
        members: {}
      }
    }
  },
  methods: {
    async save () {
      this.saving = true
      await this.$store.dispatch('admin/addParticipant', this.participant)
      await this.$router.push('.')
      this.saving = false
    },
    async cancel () {
      await this.$router.push('.')
    },
    async addMember () {
      this.adding = true
      let newMember = await FromDatabase.getProfileById(this.addMemberId)

      if (!newMember.exists) {
        this.adding = false
        return
      }

      let data = newMember.data()

      this.$set(this.participant.members, newMember.id, {
        name: data.name
      })

      this.addMemberId = ''
      this.adding = false
    },
    removeMember (memberId) {
      this.$delete(this.participant.members, memberId)
    }
  }
}
</script>

<style scoped>
  .form > div + div {
    margin-top: 1rem;
  }
</style>
