<template>
  <div class="page-container full-content">
    <h1>Item Shop</h1>
    <div class="table-responsive">
      <table class="table table-striped table-sm">
        <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Price</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in items" :key="item.documentId">
          <td>{{ item.documentId }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.price }} Pt.</td>
          <td><router-link :to="item.documentId" append>Edit</router-link></td>
          <td><a href="javascript:void(0)" @click="deleteItem(item.documentId)">Delete</a></td>
        </tr>
        </tbody>
      </table>
    </div>
    <router-link class="btn mx-1 btn-primary" to="create" append>Add Shop Item</router-link>
  </div>
</template>

<script>
import RequireAuthentication from '@/mixins/RequireAuthentication'
import { mapActions, mapState } from 'vuex'

export default {
  mixins: [RequireAuthentication],
  name: 'ItemShop',
  computed: {
    ...mapState('admin', ['items'])
  },
  async created () {
    if (!this.$store.state.admin.itemsLoaded) {
      await this.load()
    }
  },
  methods: {
    ...mapActions('admin', {
      load: 'loadItems'
    }),
    async deleteItem (itemId) {
      let confirmation = confirm(`Delete item ID: \`${itemId}\` ?`)

      if (confirmation) {
        await this.$store.dispatch('admin/deleteItem', itemId)
      }
    }
  }
}
</script>

<style scoped>

</style>
