<template>
  <div class="page-container full-content">
    <h1 class="mb-4">Create Mission</h1>
    <div class="row form">
      <div class="col-12">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="disabled" v-model="mission.disabled">
          <label class="form-check-label" for="disabled">
            Disabled
          </label>
        </div>
      </div>
      <div class="col-12">
        <label for="name">Name</label>
        <input id="name" type="text" class="form-control" v-model="mission.name" >
      </div>
      <div class="col-12">
        <label for="description">Description</label>
        <input id="description" type="text" class="form-control" v-model="mission.description" >
      </div>
      <div class="col-12">
        <label for="group">Group</label>
        <input id="group" type="text" class="form-control" v-model="mission.group" >
      </div>
      <div class="col-12">
        <label for="order">Order Value (for sorting)</label>
        <input id="order" type="number" class="form-control" @input="mission.order = parseInt($event.target.value)" :value="mission.order" >
      </div>
      <div class="col-12">
        <label for="text">Text</label>
        <textarea id="text" class="form-control" v-model="mission.text"  />
      </div>
      <div class="col-12">
        <label for="type">Type</label>
        <select id="type" v-model="mission.type" class="form-control">
          <option value="jeopardy">Jeopardy</option>
          <option value="king_of_the_hill">King of the Hill</option>
        </select>
      </div>
      <div class="col-12">
        <label for="point">Point</label>
        <input id="point" type="number" class="form-control" @input="mission.point = parseInt($event.target.value)" :value="mission.point">
      </div>
      <template v-if="mission.type === 'jeopardy'">
        <div class="col-12">
          <label for="flag">Flag</label>
          <input id="flag" type="text" class="form-control" v-model="mission.flag">
        </div>
        <div class="col-12">
          <label for="parent">Parent</label>
          <select id="parent" v-model="mission.parent" class="form-control">
            <option value="">== None ==</option>
            <option v-for="existingMission in $store.state.admin.missions.filter(m => m.type === 'jeopardy')"
                    :key="`parent-option-${existingMission.documentId}`"
                    :value="existingMission.documentId">
              {{ existingMission.name }}
            </option>
          </select>
        </div>
      </template>
      <div class="col-12">
        <label for="first_blood_bonus">FirstBloodBonus</label>
        <input id="first_blood_bonus" type="number" class="form-control" @input="mission.firstBloodBonus = parseInt($event.target.value)" :value="mission.firstBloodBonus" />
      </div>
      <template v-if="mission.type === 'king_of_the_hill'">
        <div class="col-12">
          <label for="increasing_points">IncreasingPoints</label>
          <input id="increasing_points" type="number" class="form-control" @input="mission.increasingPoints = parseInt($event.target.value)" :value="mission.increasingPoints" />
        </div>
        <div class="col-12">
          <label for="unique_capture_points">UniqueCapturePoints</label>
          <input id="unique_capture_points" type="number" class="form-control" @input="mission.uniqueCapturePoints = parseInt($event.target.value)" :value="mission.uniqueCapturePoints" />
        </div>
        <div class="col-12">
          <label for="unique_capture_increasing_points">UniqueCaptureIncreasingPoints</label>
          <input id="unique_capture_increasing_points" type="number" class="form-control" @input="mission.uniqueCaptureIncreasingPoints = parseInt($event.target.value)" :value="mission.uniqueCaptureIncreasingPoints" />
        </div>
        <div class="col-12">
          <label for="hold_streak_increasing_points">HoldStreakIncreasingPoints</label>
          <input id="hold_streak_increasing_points" type="number" class="form-control" @input="mission.holdStreakIncreasingPoints = parseInt($event.target.value)" :value="mission.holdStreakIncreasingPoints" />
        </div>
        <div class="col-12">
          <label for="hold_streak_come_back_start">HoldStreakComeBackStart</label>
          <input id="hold_streak_come_back_start" type="number" class="form-control" @input="mission.holdStreakComeBackStart = parseInt($event.target.value)" :value="mission.holdStreakComeBackStart" />
        </div>
        <div class="col-12">
          <label for="host">(Env. Config) Host</label>
          <input id="host" type="text" class="form-control" v-model="mission.host" />
        </div>
        <div class="col-12">
          <label for="port">(Env. Config) Port</label>
          <input id="port" type="number" class="form-control" @input="mission.port = parseInt($event.target.value)" :value="mission.port" />
        </div>
        <div class="col-12">
          <label for="host_time">(Env. Config) HostTime</label>
          <select id="host_time" v-model="mission.hostTime" class="form-control">
            <option :value="false">Use time from tracking server</option>
            <option :value="true">Use time from victim machine</option>
          </select>
        </div>
        <div class="col-12">
          <label for="interval">(Env. Config) Interval</label>
          <input id="interval" type="number" class="form-control" @input="mission.interval = parseInt($event.target.value)" :value="mission.interval" />
        </div>
        <div class="col-12">
          <label for="initial_delay">(Env. Config) InitialDelay</label>
          <input id="initial_delay" type="number" class="form-control" @input="mission.initialDelay = parseInt($event.target.value)" :value="mission.initialDelay" />
        </div>
      </template>
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
  name: 'CreateMission',
  data () {
    return {
      saving: false,
      mission: {
        disabled: false,
        name: '',
        description: '',
        group: '',
        order: 0,
        text: '',
        type: 'jeopardy',
        flag: '',
        point: 0,
        parent: '',
        firstBloodBonus: 0,
        increasingPoints: 0,
        uniqueCapturePoints: 0,
        uniqueCaptureIncreasingPoints: 0,
        holdStreakIncreasingPoints: 0,
        holdStreakComeBackStart: 0,
        config: {
          host: '',
          port: 52799,
          hostTime: false,
          interval: 600000,
          initialDelay: 600000
        }
      }
    }
  },
  methods: {
    async save () {
      this.saving = true
      await this.$store.dispatch('admin/addMission', this.mission)
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
