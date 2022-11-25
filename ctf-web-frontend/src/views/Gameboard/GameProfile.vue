<template>
  <div class="page-container full-content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-12">
          <div class="alert alert-primary text-center" role="alert">
            <h2>Hi, {{ myTeamName }}</h2>
            You have <b>{{ currentScore }} points</b>.
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-3">
          <div class="card" v-if="false">
            <div class="card-header">
              Linux for Dummies
            </div>
            <div class="card-body">
              Level 1
              <div class="progress">
                <div class="progress-bar bg-success" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
              </div><br>
              Level 2
              <div class="progress">
                <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 75%"></div>
              </div><br>
              Level 3
              <div class="progress">
                <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 75%"></div>
              </div>
            </div>
          </div><br>
          <div class="card" v-if="false">
            <div class="card-header">
              Web for Dummies
            </div>
            <div class="card-body">
              Level 1
              <div class="progress">
                <div class="progress-bar bg-success" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
              </div><br>
              Level 2
              <div class="progress">
                <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 75%"></div>
              </div><br>
              Level 3
              <div class="progress">
                <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 75%"></div>
              </div>
            </div>
          </div><br>
          <div class="card" v-if="false">
            <div class="card-header">
              Network for Dummies
            </div>
            <div class="card-body">
              Level 1
              <div class="progress">
                <div class="progress-bar bg-success" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
              </div><br>
              Level 2
              <div class="progress">
                <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 75%"></div>
              </div><br>
              Level 3
              <div class="progress">
                <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 75%"></div>
              </div>
            </div>
          </div><br>
          <div class="card" v-if="false">
            <div class="card-header">
              Misc.
            </div>
            <div class="card-body">
              Level 1
              <div class="progress">
                <div class="progress-bar bg-success" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
              </div>
            </div>
          </div><br>
        </div>

        <div class="col-lg-6">
          <div class="card">
            <div class="card-header">
              <b>Your Timeline</b>
            </div>
            <div class="card-body">
              <canvas ref="summary-chart" width="400" height="180"></canvas>
            </div>
          </div><br>
          <div class="card">
            <div class="card-header">
              <b>Your Latest Actions</b>
            </div>
            <div class="card-body">
              <table class="table table-striped table-bordered">
                <thead>
                <tr>
                  <td>Type</td>
                  <td>Details</td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in teamTenLatestEvent" :key="item.id">
                  <td>{{ item.objectType }}</td>
                  <td>{{ item.eventType }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <br>
        </div>

        <div class="col-lg-3">
          <div class="card" v-if="false">
            <div class="card-header">
              The Fools
            </div>
            <div class="card-body">
              ช่วงเวลาที่ถือครอง
              <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: 15%; background: transparent;" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
                <div class="progress-bar bg-success" role="progressbar" style="width: 30%" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
                <div class="progress-bar bg-info" role="progressbar" style="width: 20%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
          </div><br>
          <div class="card" v-if="false">
            <div class="card-header">
              GGEZ Hosting
            </div>
            <div class="card-body">
              ช่วงเวลาที่ถือครอง
              <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: 15%; background: transparent;" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
                <div class="progress-bar bg-success" role="progressbar" style="width: 30%" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
                <div class="progress-bar bg-info" role="progressbar" style="width: 20%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
          </div><br>
          <div class="card" v-if="false">
            <div class="card-header">
              MineKrub
            </div>
            <div class="card-body">
              ช่วงเวลาที่ถือครอง
              <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: 15%; background: transparent;" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
                <div class="progress-bar bg-success" role="progressbar" style="width: 30%" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
                <div class="progress-bar bg-info" role="progressbar" style="width: 20%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
          </div><br>
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
  name: 'GameProfile',
  data () {
    return {
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
      }
    }
  },
  computed: {
    ...mapState('gameboard', {
      gameInfo: 'gameInfo',
      missions: 'missions',
      teamId: 'teamId',
      currentScore: 'currentScore',
      teamTenLatestEvent: 'teamTenLatestEvent',
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

        let teamScore = this.scoreHistoryByTeam.find(e => e.team.documentId === this.teamId)

        let displayTeams = []

        if (teamScore) {
          displayTeams.push({
            label: teamScore.team.name,
            backgroundColor: 'rgba(255, 99, 132, 1)',
            borderColor: 'rgba(255, 99, 132, 1)',
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
    }
  }
}
</script>

<style scoped>
.container-fluid {
  padding-top: 1.5rem;
}
</style>
