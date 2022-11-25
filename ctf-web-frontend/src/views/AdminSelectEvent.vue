<template>
  <div class="page-container full-content">
    <div class="album py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-12 mb-4">
            <h2>My Events</h2>
          </div>
          <div class="col-6 col-md-4" v-for="item in events" :key="item.documentId">
            <div class="card mb-4 box-shadow">
              <div class="card-body">
                <h5 class="card-title mb-0">{{ item.name }}</h5>
                <p class="card-text small mt-0">{{ roleName[item.myRole] }}</p>
                <p class="card-text">{{ item.description }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <router-link :to="`/admin/${item.documentId}`" class="btn btn-sm btn-outline-secondary">Manage Event</router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-4">
            <div class="card mb-4 box-shadow text-center" id="create-event">
              <div class="card-body">
                <div class="row h-100">
                  <div class="col-12 align-self-center">
                    <router-link to="/admin/create">Create a new event</router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
  name: 'AdminSelectEvent',
  data () {
    return {
      events: [],
      roleName: {
        owner: 'OWNER',
        editor: 'EDITOR'
      }
    }
  },
  async created () {
    this.events = await FromDatabase.getMyAdminEvents()
  }
}
</script>

<style scoped>
  .box-shadow {
    box-shadow: 0 .25rem .75rem rgba(0, 0, 0, .05);
  }

  #create-event {
    height: calc(100% - 1.5rem)
  }
</style>
