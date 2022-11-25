<template>
  <div class="page-container full-content">
    <section class="jumbotron text-center">
      <div class="container">
        <h1 class="jumbotron-heading">{{ gameInfo.name }}</h1>
        <p class="lead text-muted">Time Remaining</p>
        <h2 class="jumbotron-time-remaining">{{ timeRemaining }}</h2>
      </div>
    </section>
    <div class="modal fade" id="challengeModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="challengeModalLabel">
              {{ selectedMission ? selectedMission.name : 'Loading...' }}
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" v-if="selectedMission">
            <div v-html="marked(selectedMission.text || '')" />
            <template v-if="selectedMission.children && selectedMission.children.length > 0">
              <h6 v-if="!!selectedMission.flag">More flags:</h6>
              <h6 v-else>Flags:</h6>
              <ul>
                <li v-for="child in selectedMission.children" :key="child.key" :class="{ 'text-success': answeredJeopardyMissions[child.documentId], 'font-weight-bold': answeredJeopardyMissions[child.documentId] }">{{ child.name }}<template v-if="selectedMission.type === 'jeopardy'"> ({{ child.point }} Pt.)</template></li>
              </ul>
            </template>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div class="container pt-5">
      <div class="row">
        <div class="col-12 mb-3">
          <h2 class="font-weight-bold">{{ myTeamName }} : {{ currentScore }} Points</h2>
          <hr>
        </div>
        <div class="col-12">
          <h2>Submit Flag</h2>
        </div>
        <div class="col-12">
          <div class="input-group mt-3 mb-1 bg-light">
            <input type="text" class="form-control" placeholder="Answer Flag Here" aria-label="Answer Flag Here" v-model="flagInput">
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button" @click="onSubmitFlag">Submit</button>
            </div>
          </div>
        </div>
        <div class="col-12 mb-3">
          <p class="text-success" v-if="flagSuccess === true">You got a flag !</p>
          <p class="text-muted" v-if="flagSuccess === 'already-answered'">You already got this flag</p>
          <p class="text-danger" v-else-if="flagSuccess === false">Not a flag.</p>
        </div>
      </div>
    </div>
    <div class="album pt-5 bg-light" v-for="group in missionByGroup" :key="group.name">
      <div class="container">
        <div class="row">
          <div class="col-md-12 mb-4">
            <h2>{{ group.name }}</h2>
          </div>
          <div class="col-md-4 px-2" v-for="mission in group.missions" :key="mission.documentId">
            <div class="card mb-4 box-shadow"
            :class="{ answered: (mission.type === 'jeopardy' && answeredJeopardyMissions[mission.documentId] && (mission.children || []).every(e => answeredJeopardyMissions[e.documentId])) || (mission.type === 'king_of_the_hill' && kothStatus[mission.documentId] === teamId) }">
              <div class="card-body">
                <h5 class="card-title">{{ mission.name }}</h5>
                <p class="card-text">{{ mission.description }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <router-link tag="button" :to="`chall/${mission.documentId}`" append type="button" class="btn btn-sm btn-outline-secondary">Details</router-link>
                  </div>
                  <p class="m-0 small text-muted" v-if="mission.children && mission.children.length > 0">
                    <span>{{ (!!mission.flag ? answeredJeopardyMissions[mission.documentId] : 0) + mission.children.filter(e => e.flag && answeredJeopardyMissions[e.documentId]).length }}</span>
                    <span>/</span>
                    <span>{{ mission.children.filter(e => e.flag).length + (!!mission.flag ? 1 : 0) }} Flags</span>
                    <span v-if="mission.type === 'jeopardy' && mission.children.every(m => m.type === 'jeopardy')"> ({{ sum(mission.point || 0, ...mission.children.map(e => e.point || 0)) }} Pt.)</span>
                  </p>
                  <p class="m-0 small text-muted" v-else-if="mission.type === 'jeopardy'">{{ mission.point }} Pt.</p>
                  <p class="m-0 small text-muted" v-else>TBD</p>
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
import $ from 'jquery'
import { mapState, mapGetters } from 'vuex'
import marked from 'marked'
import FromDatabase from '@/firebase-utilities/FromDatabase'

export default {
  mixins: [RequireAuthentication],
  name: 'Gameboard',
  data () {
    return {
      timeRemaining: '99:59:59:59',
      flagInput: '',
      flagSuccess: null,
      timeRemainingUpdateIntervalRef: null
    }
  },
  computed: {
    ...mapState('gameboard', {
      gameInfo: 'gameInfo',
      missions: 'missions',
      teamId: 'teamId',
      currentScore: 'currentScore',
      answeredJeopardyMissions: 'answeredJeopardyMissions',
      kothStatus: 'kothStatus'
    }),
    ...mapGetters('gameboard', {
      missionByGroup: 'missionByGroup',
      myTeamName: 'myTeamName'
    }),
    selectedMission () {
      if (this.$route.params.challId) {
        return this.missions.find(e => e.documentId === this.$route.params.challId)
      } else {
        return {}
      }
    }
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
  watch: {
    '$route.params.challId' (challId, oldChallId) {
      if (oldChallId) {
        $('#challengeModal').modal('hide')
      }

      if (challId) {
        $('#challengeModal').modal('show')
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      $('#challengeModal').on('hide.bs.modal', (e) => {
        if (this.$route.name === 'gameboard-chall') {
          this.$router.push(`/gameboard/${this.$route.params.gameId}`)
        }
      })

      if (this.$route.params.challId) {
        $('#challengeModal').modal('show')
      }
    })
  },
  methods: {
    marked (t) {
      return marked(t, {
        breaks: true
      })
    },
    sum (...numbers) {
      return numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
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
    },
    async onSubmitFlag () {
      this.flagInput = this.flagInput.trim()

      let missionId = await FromDatabase.checkAnswer(this.$route.params.gameId, this.flagInput)

      if (!missionId) {
        this.flagSuccess = false
        this.flagInput = ''
        return
      }

      if (this.answeredJeopardyMissions[missionId] === this.flagInput) {
        this.flagSuccess = 'already-answered'
        this.flagInput = ''
        return
      }

      let answerResult = await FromDatabase.answerFlag(this.$route.params.gameId, this.teamId, missionId, this.flagInput)

      if (!answerResult) {
        this.flagSuccess = false
        this.flagInput = ''
        return
      }

      this.flagSuccess = true
      this.flagInput = ''
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

.card.answered {
  background-color: rgba(0, 255, 0, 0.1)
}
</style>
