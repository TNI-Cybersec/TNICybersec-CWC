<template>
  <div class="page-container full-content" v-if="itemIndex >= 0">
    <h1 class="mb-4">Edit Item</h1>
    <div class="row form">
      <div class="col-12">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="disabled" v-model="disabled">
          <label class="form-check-label" for="disabled">
            Disabled
          </label>
        </div>
      </div>
      <div class="col-12">
        <label for="name">Name</label>
        <input id="name" type="text" class="form-control" v-model="name">
      </div>
      <div class="col-12">
        <label for="description">Description</label>
        <input id="description" type="text" class="form-control" v-model="description">
      </div>
      <div class="col-12">
        <label for="item">Item</label>
        <textarea id="item" class="form-control" v-model="item" />
      </div>
      <div class="col-12">
        <label for="price">Price</label>
        <input id="price" type="text" class="form-control" v-model="price">
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
import { mapActions } from 'vuex'
import RequireAuthentication from '@/mixins/RequireAuthentication'

export default {
  mixins: [RequireAuthentication],
  name: 'EditItemShop',
  data () {
    return {
      saving: false
    }
  },
  computed: {
    itemIndex () {
      let itemId = this.$route.params.itemId
      return this.$store.state.admin.items.findIndex(e => e.documentId === itemId)
    },
    disabled: {
      get () {
        return !!this.$store.state.admin.items[this.itemIndex].disabled
      },
      set (value) {
        this.$store.state.admin.items[this.itemIndex].disabled = !!value
      }
    },
    name: {
      get () {
        return this.$store.state.admin.items[this.itemIndex].name
      },
      set (value) {
        this.$store.state.admin.items[this.itemIndex].name = value
      }
    },
    description: {
      get () {
        return this.$store.state.admin.items[this.itemIndex].description
      },
      set (value) {
        this.$store.state.admin.items[this.itemIndex].description = value
      }
    },
    item: {
      get () {
        return this.$store.state.admin.items[this.itemIndex].item
      },
      set (value) {
        this.$store.state.admin.items[this.itemIndex].item = value
      }
    },
    price: {
      get () {
        return this.$store.state.admin.items[this.itemIndex].price
      },
      set (value) {
        this.$store.state.admin.items[this.itemIndex].price = parseInt(value)
      }
    }
  },
  async created () {
    if (!this.$store.state.admin.itemsLoaded) {
      await this.load()
    }
  },
  methods: {
    ...mapActions('admin', {
      load: 'loadItems',
      reset: 'resetItem'
    }),
    async save () {
      this.saving = true
      await this.$store.dispatch('admin/saveItem', this.$route.params.itemId)
      await this.$router.push('.')
      this.saving = false
    },
    async cancel () {
      await this.reset(this.$route.params.itemId)
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
