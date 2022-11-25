<template>
  <div class="page-container">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="alert alert-info text-center" role="alert">
            <b>** Announcement **</b><br>
            Good Luck, Have Fun!
          </div>
        </div>
      </div>
      <section class="jumbotron text-center" style="padding: 30px;">
        <div class="container">
          <h2 class="jumbotron-heading">{{ gameInfo.name }}</h2>
          <span class="lead text-muted">Time Remaining</span>
          <h3 class="jumbotron-time-remaining" style="margin-bottom: 0;">{{ timeRemaining }}</h3>
        </div>
      </section>
      <div class="row">
        <div class="col-lg-12">
          <div>
            <h2>Timeline</h2>
            <!--<p class="lead">Use this document as a way to quickly start any new project.<br> All you get is this text and a mostly barebones HTML document.</p>-->
          </div>
          <canvas ref="summary-chart" width="400" height="150"></canvas>
        </div>
        <div class="col-lg-12">
          <br>
          <h2>Leaderboard</h2>
          <table class="table table-striped table-bordered">
            <thead>
            <tr>
              <th>Team</th>
              <th class="text-center">Score</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="team in leaderboard" :key="`leaderboard-${team.id}`">
              <td>{{ team.name }}</td>
              <td class="text-center">{{ team.score }}</td>
            </tr>
            </tbody>
          </table>
          <br>
          <h2>Latest Actions</h2>
          <table class="table table-striped table-bordered">
            <thead>
            <tr>
              <th>Teams</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in tenLatestEvent" :key="item.id">
              <td>{{ item.teamName }}</td>
              <td>{{ item.eventType }}</td>
            </tr>
            </tbody>
          </table>
          <br>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js'
import Moment from 'moment'
import RequireAuthentication from '@/mixins/RequireAuthentication'
import { mapGetters, mapState } from 'vuex'

export default {
  mixins: [RequireAuthentication],
  name: 'Summary',
  data () {
    return {
      timeRemaining: '99:59:59:59',
      timeRemainingUpdateIntervalRef: null,
      generalConfig: {
        steppedLine: false
      },
      timeFormat: 'MM/DD/YYYY HH:mm',
      chart: null,
      chartConfig: {
        type: 'line',
        data: {
          labels: [],
          datasets: []
        },
        options: {
          scales: {
            xAxes: [{
              gridLines: {
                display: true,
                drawBorder: true,
                drawOnChartArea: false
              },
              type: 'time',
              time: {
                parser: this.timeFormat,
                tooltipFormat: 'll HH:mm'
              },
              ticks: {
                source: 'labels'
              },
              scaleLabel: {
                display: true,
                labelString: 'Time'
              }
            }],
            yAxes: [{
              gridLines: {
                display: true,
                drawBorder: true,
                drawOnChartArea: false
              },
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      },
      chartColors: [
        {
          backgroundColor: 'rgba(54, 162, 235, 1)',
          borderColor: 'rgba(54, 162, 235, 1)'
        },
        {
          backgroundColor: 'rgba(255, 99, 132, 1)',
          borderColor: 'rgba(255, 99, 132, 1)'
        },
        {
          backgroundColor: 'rgba(75, 192, 192, 1)',
          borderColor: 'rgba(75, 192, 192, 1)'
        },
        {
          backgroundColor: 'rgba(255, 206, 86, 1)',
          borderColor: 'rgba(255, 206, 86, 1)'
        },
        {
          backgroundColor: 'rgba(0, 255, 0, 1)',
          borderColor: 'rgba(0, 255, 0, 1)'
        },
        {
          backgroundColor: 'rgba(255, 0, 0, 1)',
          borderColor: 'rgba(255, 0, 0, 1)'
        },
        {
          backgroundColor: 'rgba(0, 0, 255, 1)',
          borderColor: 'rgba(0, 0, 255, 1)'
        },
        {
          backgroundColor: 'rgba(255, 128, 0, 1)',
          borderColor: 'rgba(255, 128, 0, 1)'
        },
        {
          backgroundColor: 'rgba(64, 0, 0, 1)',
          borderColor: 'rgba(64, 0, 0, 1)'
        },
        {
          backgroundColor: 'rgba(128, 64, 0, 1)',
          borderColor: 'rgba(128, 64, 0, 1)'
        }
      ]
    }
  },
  computed: {
    ...mapState('gameboard', {
      gameInfo: 'gameInfo',
      missions: 'missions',
      teamId: 'teamId',
      currentScore: 'currentScore',
      leaderboard: 'leaderboard',
      tenLatestEvent: 'tenLatestEvent',
      scoreHistoryByTeam: 'scoreHistoryByTeam'
    }),
    ...mapGetters('gameboard', {
      missionByGroup: 'missionByGroup',
      myTeamName: 'myTeamName'
    })
  },
  watch: {
    scoreHistoryByTeam: {
      immediate: true,
      handler () {
        let dateLabels = []

        let endOfGraph = (!this.gameInfo.end || this.gameInfo.end.valueOf() > Date.now()) ? new Date() : this.gameInfo.end

        for (
          let time = this.gameInfo.start.valueOf();
          time <= endOfGraph.valueOf();
          time += 3600000
        ) {
          dateLabels.push(new Date(time))
        }

        while (dateLabels.length > 20) {
          dateLabels = dateLabels.filter((e, i) => i % 2 === 0)
        }

        let displayTeams = []

        for (
          let i = 0;
          i < this.scoreHistoryByTeam.length && i < this.chartColors.length;
          i++
        ) {
          let teamScore = this.scoreHistoryByTeam[i]
          if (!teamScore) continue

          displayTeams.push({
            label: teamScore.team.name,
            backgroundColor: this.chartColors[i].backgroundColor,
            borderColor: this.chartColors[i].borderColor,
            fill: false,
            steppedLine: this.generalConfig.steppedLine,
            data: teamScore.history.map(t => {
              return {
                x: t.timestamp || this.gameInfo.start,
                y: t.currentScore
              }
            }).concat([{
              x: endOfGraph.valueOf(),
              y: teamScore.totalScore
            }])
          })
        }

        if (this.chart) {
          this.chart.data.labels = dateLabels
          this.chart.data.datasets = displayTeams
          this.chart.update()
        } else {
          this.chartConfig.data.labels = dateLabels
          this.chartConfig.data.datasets = displayTeams
        }
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
  mounted () {
    this.$nextTick(() => {
      this.chart = new Chart(this.$refs['summary-chart'].getContext('2d'), this.chartConfig)
    })
  },
  methods: {
    newDate (days) {
      return Moment().add(days, 'd').toDate()
    },
    newDateString (days) {
      return Moment().add(days, 'd').format(this.timeFormat)
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
.container {
  padding-top: 1.5rem;
}
</style>
