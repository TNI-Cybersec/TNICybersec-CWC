<template>
  <div class="page-container full-content">
    <section class="jumbotron text-center">
      <div class="container">
        <h1 class="jumbotron-heading">TNI-CWC</h1>
        <p class="lead text-muted">Logged in as: {{ this.$store.getters['auth/displayName'] }}</p>
        <p>
          <router-link to="/" class="btn btn-primary my-2" style="margin-right: 5px;">Join an Event</router-link>
        </p>
      </div>
    </section>
  </div>
</template>

<script>
import RequireAuthentication from '@/mixins/RequireAuthentication.js'
import FromDatabase from '@/firebase-utilities/FromDatabase'
import Moment from '@/utilities/Moment'

export default {
  mixins: [RequireAuthentication],
  name: 'Home',
  data () {
    return {
      myEvents: [],
      loading: true
    }
  },
  computed: {
  },
  async created () {
    this.myEvents = await FromDatabase.getJoinedEvents()
    this.loading = false
  },
  methods: {
    timeTo (time) {
      return Moment(time).fromNow()
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
  font-weight: 300;
}

.jumbotron .container {
  max-width: 40rem;
}

.box-shadow { box-shadow: 0 .25rem .75rem rgba(0, 0, 0, .05); }
</style>
