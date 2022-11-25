<template>
  <div class="page-container full-content">
    <div class="container-fluid mt-3">
      <h4 class="mb-4">Create an Event</h4>
      <div class="row form">
        <div class="col-12">
          <label for="name">Event Name</label>
          <input id="name" type="text" class="form-control" v-model="generalConfiguration.name">
        </div>
        <div class="col-12">
          <label for="description">Event Description</label>
          <input id="description" type="text" class="form-control" v-model="generalConfiguration.description">
        </div>

        <div class="col-12">
          <a class="btn mx-1 btn-primary" href="javascript:void(0)" @click="save">Create</a>
          <p class="m-0" v-if="saving">Creating...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RequireAuthentication from '@/mixins/RequireAuthentication'
import FromDatabase from '@/firebase-utilities/FromDatabase'

export default {
  mixins: [RequireAuthentication],
  name: 'CreateEvent',
  data () {
    return {
      saving: false,
      generalConfiguration: {
        name: '',
        description: ''
      }
    }
  },
  methods: {
    async save () {
      this.saving = true

      let docRef = await FromDatabase.createEvent(this.generalConfiguration)
      await this.$router.push(`/admin/${docRef.id}`)

      this.saving = false
    }
  }
}
</script>

<style scoped>
  .form > div + div {
    margin-top: 1rem;
  }
</style>
