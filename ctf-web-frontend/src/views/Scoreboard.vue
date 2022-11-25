<template>
  <div class="page-container">
    <section class="jumbotron text-center">
      <div class="container">
        <h1 class="jumbotron-heading">{{ eventName }}</h1>
      </div>
    </section>
    <div class="container pt-2">
      <h1 class="mb-4">Scoreboard</h1>
      <div class="table-responsive">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th>No. #</th>
            <th>Team Name</th>
            <th>Final Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(team, index) in scoreboard" :key="`admin-leaderboard-${index+1}`" :class="{ 'my-team': team.teamId === myTeam }">
            <td>{{ index + 1 }}</td>
            <td>{{ teams[team.teamId] || '' }}</td>
            <td>{{ team.score || 0 }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  </div>
</template>

<script>
import FromDatabase from '@/firebase-utilities/FromDatabase.js'

export default {
  name: 'Scoreboard',
  data () {
    return {
      eventName: '',
      scoreboard: [],
      teams: {},
      myTeam: ''
    }
  },
  async created () {
    let eventId = this.$route.params.eventId

    this.eventName = await FromDatabase.getEventName(eventId)

    let myTeamSnapshot = await FromDatabase.getMyTeam(eventId)
    this.myTeam = myTeamSnapshot.val() || ''

    let teamNameSnapshot = await FromDatabase.getTeamNameRef(eventId).once('value')
    this.teams = teamNameSnapshot.val() || {}

    let scoreSnapshot = await FromDatabase.getScoreboardRef(eventId).once('value')
    let scoreboard = []

    scoreSnapshot.forEach(team => {
      scoreboard.push({
        teamId: team.key,
        score: team.val()
      })
    })

    for (let teamId in this.teams) {
      if (this.teams.hasOwnProperty(teamId) && !scoreboard.find(e => e.teamId === teamId)) {
        scoreboard.push({
          teamId: teamId,
          score: 0
        })
      }
    }

    scoreboard.sort((a, b) => b.score - a.score)

    this.scoreboard = scoreboard
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

  .my-team {
    color: red;
  }
</style>
