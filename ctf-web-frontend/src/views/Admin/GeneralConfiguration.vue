<template>
  <div class="container-fluid">
    <h4 class="mb-4">General Configuration</h4>
    <div class="row form">
      <div class="col-12">
        <label for="name">Event Name</label>
        <input id="name" type="text" class="form-control" v-model="generalConfiguration.name">
      </div>
      <div class="col-12">
        <label for="description">Event Description</label>
        <input id="description" type="text" class="form-control" v-model="generalConfiguration.description">
      </div>
      <div class="col-12 col-md-6">
        <label for="start">Start Time</label>
        <input id="start"
               type="text"
               class="form-control"
               :value="generalConfiguration.start ? generalConfiguration.start.valueOf() : ''"
               @input="generalConfiguration.start = new Date(parseInt($event.target.value))" />
        <p>{{ generalConfiguration.start ? generalConfiguration.start.toString() : '' }}</p>
      </div>
      <div class="col-12 col-md-6">
        <label for="end">End Time</label>
        <input id="end"
               type="text"
               class="form-control"
               :value="generalConfiguration.end ? generalConfiguration.end.valueOf() : ''"
               @input="generalConfiguration.end = new Date(parseInt($event.target.value))" />
        <p>{{ generalConfiguration.start ? generalConfiguration.end.toString() : '' }}</p>
      </div>
      <div class="col-12">
        <a class="btn mx-1 btn-primary" href="javascript:void(0)" @click="save">Save</a>
        <a class="btn mx-1 btn-primary" href="javascript:void(0)" @click="reset">Reset</a>
        <p class="m-0" v-if="saving">Saving...</p>
      </div>
    </div>
  </div>
</template>

<script>
import RequireAuthentication from '@/mixins/RequireAuthentication'
import { mapState, mapActions } from 'vuex'

export default {
  mixins: [RequireAuthentication],
  name: 'GeneralConfiguration',
  data () {
    return {
      saving: false
    }
  },
  computed: {
    ...mapState('admin', ['generalConfiguration'])
  },
  async created () {
    if (!this.$store.state.admin.generalConfigurationLoaded) {
      await this.load()
    }
  },
  methods: {
    ...mapActions('admin', {
      load: 'loadGeneralConfiguration',
      reset: 'resetGeneralConfiguration'
    }),
    async save () {
      this.saving = true
      await this.$store.dispatch('admin/saveGeneralConfiguration')
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
