<template>
  <div class="page-container full-content">
    <section class="jumbotron text-center">
      <div class="container">
        <h1 class="jumbotron-heading">My Events</h1>
        <p class="lead text-muted">Logged in as: {{ this.$store.getters['auth/displayName'] }}</p>
        <p v-if="false">
          <router-link to="/" class="btn btn-primary my-2" style="margin-right: 5px;">Join an Event</router-link>
        </p>
      </div>
    </section>
    <div class="album py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-md-12 mb-4" v-if="activeEvents.length || this.loading">
            <h2>Active Now</h2>
          </div>
          <div class="col-md-4" v-for="event in activeEvents" :key="event.documentId">
            <div class="card mb-4 box-shadow">
              <div class="card-body">
                <h5 class="card-title">{{ event.name }}</h5>
                <p class="card-text">{{ event.description }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <router-link tag="button" :to="`/gameboard/${event.eventId}`" type="button" class="btn btn-sm btn-outline-secondary">Go to Gameboard</router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-12 my-4" v-if="upcomingEvents.length">
            <h2>Upcoming Events</h2>
          </div>
          <div class="col-md-4" v-for="event in upcomingEvents" :key="event.documentId">
            <div class="card mb-4 box-shadow">
              <div class="card-body">
                <h5 class="card-title">{{ event.name }}</h5>
                <p class="card-text">{{ event.description }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group"></div>
                  <small class="text-muted">{{ timeTo(event.start) }}</small>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-12 my-4" v-if="pastEvents.length">
            <h2>Past Events</h2>
          </div>
          <div class="col-md-4" v-for="event in pastEvents" :key="event.documentId">
            <div class="card mb-4 box-shadow">
              <div class="card-body">
                <h5 class="card-title">{{ event.name }}</h5>
                <p class="card-text">{{ event.description }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <router-link tag="button" :to="`/scoreboard/${event.eventId}`" type="button" class="btn btn-sm btn-outline-secondary">View Scoreboard</router-link>
                  </div>
                  <small class="text-muted">{{ timeTo(event.end) }}</small>
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
import RequireAuthentication from '@/mixins/RequireAuthentication.js'
import FromDatabase from '@/firebase-utilities/FromDatabase'
import Moment from '@/utilities/Moment'

export default {
  mixins: [RequireAuthentication],
  name: 'MyEvents',
  data () {
    return {
      myEvents: [],
      loading: true
    }
  },
  computed: {
    activeEvents () {
      return this.myEvents.filter(event => {
        let now = Date.now()
        return now >= event.start.valueOf() && now <= event.end.valueOf()
      })
    },
    upcomingEvents () {
      return this.myEvents.filter(event => {
        let now = Date.now()
        return now < event.start.valueOf()
      })
    },
    pastEvents () {
      return this.myEvents.filter(event => {
        let now = Date.now()
        return now > event.end.valueOf()
      })
    }
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
