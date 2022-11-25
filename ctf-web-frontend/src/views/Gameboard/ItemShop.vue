<template>
  <div class="page-container full-content">
    <section class="jumbotron text-center">
      <div class="container">
        <h1 class="jumbotron-heading">{{ gameInfo.name }}</h1>
        <p class="lead text-muted">Time Remaining</p>
        <h2 class="jumbotron-time-remaining">{{ timeRemaining }}</h2>
      </div>
    </section>
    <div class="modal fade" id="itemModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="challengeModalLabel">
              {{ selectedInventory ? selectedInventory.item.name : 'Loading...' }}
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" v-if="selectedInventory">
            <p v-if="selectedInventory.item.description">{{ selectedInventory.item.description }}</p>
            <hr v-if="selectedInventory.item.description" />
            <div v-html="marked(selectedInventory.item_text || '')" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div class="container pt-5">
      <div class="row">
        <div class="col-md-12 mb-4">
          <h2>My Items</h2>
        </div>
        <div class="col-4" v-for="inventory in teamInventory" :key="inventory.id">
          <div class="card mb-4 box-shadow">
            <div class="card-body">
              <h5 class="card-title">{{ inventory.item.name }}</h5>
              <p class="card-text">{{ inventory.item.description }}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <router-link tag="button" :to="inventory.id" append type="button" class="btn btn-sm btn-outline-secondary">View Item</router-link>
                </div>
                <p class="m-0 small text-muted">
                  {{ timeTo(inventory.timestamp) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="album pt-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-md-12 mb-4">
            <h2>Item Shop</h2>
          </div>
          <div class="col-md-4 px-2" v-for="item in shopItems" :key="item.documentId">
            <div class="card mb-4 box-shadow">
              <div class="card-body">
                <h5 class="card-title">{{ item.name }}</h5>
                <p class="card-text">{{ item.description }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-secondary" @click="buyItem(item.documentId)">Buy</button>
                  </div>
                <p class="card-text text-muted">{{ item.price }} Pt.</p>
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
import { mapGetters, mapState } from 'vuex'
import FromDatabase from '@/firebase-utilities/FromDatabase'
import Moment from '@/utilities/Moment'
import RequireAuthentication from '@/mixins/RequireAuthentication'
import $ from 'jquery'
import marked from 'marked'

export default {
  mixins: [RequireAuthentication],
  name: 'ItemShop',
  data () {
    return {
      timeRemaining: '99:59:59:59',
      timeRemainingUpdateIntervalRef: null
    }
  },
  computed: {
    ...mapState('gameboard', {
      gameInfo: 'gameInfo',
      shopItems: 'shopItems',
      teamId: 'teamId',
      currentScore: 'currentScore',
      answeredJeopardyMissions: 'answeredJeopardyMissions',
      teamInventory: 'teamInventory'
    }),
    ...mapGetters('gameboard', {
      missionByGroup: 'missionByGroup',
      myTeamName: 'myTeamName'
    }),
    selectedInventory () {
      if (this.$route.params.inventoryId) {
        return this.teamInventory.find(e => e.id === this.$route.params.inventoryId)
      } else {
        return null
      }
    }
  },
  watch: {
    '$route.params.inventoryId' (inventoryId, oldInventoryId) {
      if (oldInventoryId) {
        $('#itemModal').modal('hide')
      }

      if (inventoryId) {
        $('#itemModal').modal('show')
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      $('#itemModal').on('hide.bs.modal', (e) => {
        if (this.$route.name === 'game-items-view-item') {
          this.$router.push(`/gameboard/${this.$route.params.gameId}/items`)
        }
      })

      if (this.$route.params.inventoryId) {
        $('#itemModal').modal('show')
      }
    })
  },
  created () {
    this.updateTimeRemaining()
    this.timeRemainingUpdateIntervalRef = setInterval(this.updateTimeRemaining, 1000)
  },
  beforeDestroy () {
    if (this.timeRemainingUpdateIntervalRef !== null) {
      clearInterval(this.timeRemainingUpdateIntervalRef)
      this.timeRemainingUpdateIntervalRef = null
    }
  },
  methods: {
    marked (t) {
      return marked(t, {
        breaks: true
      })
    },
    async buyItem (itemId) {
      let item = this.shopItems.find(e => e.documentId === itemId)
      if (!item) return

      let confirmation = confirm(`BUY "${item.name}" AT ${item.price} POINTS ?`)

      if (!confirmation) return

      let success = await FromDatabase.buyShopItem(this.$route.params.gameId, this.teamId, itemId)

      if (success) {
        alert('buy item ok')
      } else {
        alert('cannot buy this item')
      }
    },
    timeTo (time) {
      return Moment(time).fromNow()
    },
    updateTimeRemaining () {
      this.timeRemaining = this.getTimeRemaining()
    },
    getTimeRemaining () {
      let endTime = this.$store.state.gameboard.gameInfo.end.valueOf()
      let now = Date.now()

      if (now > endTime) return '00:00:00:00'

      let days = 0
      let hours = 0
      let minutes = 0
      let seconds = Math.floor((endTime - now) / 1000)

      if (seconds >= 60) {
        minutes = Math.floor(seconds / 60)
        seconds = seconds % 60
      }

      if (minutes >= 60) {
        hours = Math.floor(minutes / 60)
        minutes = minutes % 60
      }

      if (hours >= 24) {
        days = Math.floor(hours / 24)
        hours = hours % 24
      }

      days = days.toString()
      hours = hours.toString()
      minutes = minutes.toString()
      seconds = seconds.toString()

      if (days.length === 1) days = '0' + days
      if (hours.length === 1) hours = '0' + hours
      if (minutes.length === 1) minutes = '0' + minutes
      if (seconds.length === 1) seconds = '0' + seconds

      return `${days}:${hours}:${minutes}:${seconds}`
    }
  }
}
</script>

<style scoped>
  .jumbotron {
    --jumbotron-padding-y: 3rem;
  }

  .jumbotron {
    padding-top: var(--jumbotron-padding-y);
    padding-bottom: var(--jumbotron-padding-y);
    margin-bottom: 0;
    background-color: #fff;
  }
  @media (min-width: 768px) {
    .jumbotron {
      padding-top: calc(var(--jumbotron-padding-y) * 2);
      padding-bottom: calc(var(--jumbotron-padding-y) * 2);
    }
  }

  .jumbotron p:last-child {
    margin-bottom: 0;
  }

  .jumbotron-heading {
    font-weight: 700;
  }

  .jumbotron-time-remaining {
    font-weight: 600;
  }

  .jumbotron .container {
    max-width: 40rem;
  }

  .box-shadow { box-shadow: 0 .25rem .75rem rgba(0, 0, 0, .05); }
</style>
