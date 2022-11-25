<template>
  <div class="page-container full-content">
    <h1 class="mb-4">Add Item</h1>
    <div class="row form">
      <div class="col-12">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="disabled" v-model="item.disabled">
          <label class="form-check-label" for="disabled">
            Disabled
          </label>
        </div>
      </div>
      <div class="col-12">
        <label for="name">Name</label>
        <input id="name" type="text" class="form-control" v-model="item.name">
      </div>
      <div class="col-12">
        <label for="description">Description</label>
        <input id="description" type="text" class="form-control" v-model="item.description">
      </div>
      <div class="col-12">
        <label for="item">Item</label>
        <textarea id="item" class="form-control" v-model="item.item" />
      </div>
      <div class="col-12">
        <label for="price">Price</label>
        <input id="price" type="text" class="form-control" v-model="item.price">
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

export default {
  mixins: [RequireAuthentication],
  name: 'AddItemShop',
  data () {
    return {
      saving: false,
      item: {
        disabled: false,
        name: '',
        description: '',
        item: '',
        price: 0
      }
    }
  },
  methods: {
    async save () {
      this.saving = true
      await this.$store.dispatch('admin/addItem', this.item)
      await this.$router.push('.')
      this.saving = false
    },
    async cancel () {
      await this.$router.push('.')
    }
  }
}
</script>

<style scoped>
  .form > div + div {
    margin-top: 1rem;
  }
</style>
