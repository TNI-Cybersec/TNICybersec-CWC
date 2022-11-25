<template>
  <div class="page-container full-content" v-if="missionIndex >= 0">
    <h1 class="mb-4">Edit Mission</h1>
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
        <input id="name" type="text" class="form-control" v-model="name" >
      </div>
      <div class="col-12">
        <label for="description">Description</label>
        <input id="description" type="text" class="form-control" v-model="description" >
      </div>
      <div class="col-12">
        <label for="group">Group</label>
        <input id="group" type="text" class="form-control" v-model="group" >
      </div>
      <div class="col-12">
        <label for="order">Order Value (for sorting)</label>
        <input id="order" type="number" class="form-control" v-model="order" >
      </div>
      <div class="col-12">
        <label for="text">Text</label>
        <textarea id="text" class="form-control" v-model="text"  />
      </div>
      <div class="col-12">
        <label for="type">Type</label>
        <select id="type" v-model="type" class="form-control">
          <option value="jeopardy">Jeopardy</option>
          <option value="king_of_the_hill">King of the Hill</option>
        </select>
      </div>
      <div class="col-12">
        <label for="point">Point</label>
        <input id="point" type="number" class="form-control" v-model="point">
      </div>
      <template v-if="type === 'jeopardy'">
        <div class="col-12">
          <label for="flag">Flag</label>
          <input id="flag" type="text" class="form-control" v-model="flag">
        </div>
        <div class="col-12">
          <label for="parent">Parent</label>
          <select id="parent" v-model="parent" class="form-control">
            <option value="">== None ==</option>
            <option v-for="mission in $store.state.admin.missions.filter(m => m.type === 'jeopardy' && m.documentId !== $route.params.missionId)"
                    :key="`parent-option-${mission.documentId}`"
                    :value="mission.documentId">
              {{ mission.name }}
            </option>
          </select>
        </div>
      </template>
      <div class="col-12">
        <label for="first_blood_bonus">FirstBloodBonus</label>
        <input id="first_blood_bonus" type="number" class="form-control" v-model="firstBloodBonus" />
      </div>
      <template v-if="type === 'king_of_the_hill'">
        <div class="col-12">
          <label for="increasing_points">IncreasingPoints</label>
          <input id="increasing_points" type="number" class="form-control" v-model="increasingPoints" />
        </div>
        <div class="col-12">
          <label for="unique_capture_points">UniqueCapturePoints</label>
          <input id="unique_capture_points" type="number" class="form-control" v-model="uniqueCapturePoints" />
        </div>
        <div class="col-12">
          <label for="unique_capture_increasing_points">UniqueCaptureIncreasingPoints</label>
          <input id="unique_capture_increasing_points" type="number" class="form-control" v-model="uniqueCaptureIncreasingPoints" />
        </div>
        <div class="col-12">
          <label for="hold_streak_increasing_points">HoldStreakIncreasingPoints</label>
          <input id="hold_streak_increasing_points" type="number" class="form-control" v-model="holdStreakIncreasingPoints" />
        </div>
        <div class="col-12">
          <label for="host">(Env. Config) Host</label>
          <input id="host" type="text" class="form-control" v-model="host" />
        </div>
        <div class="col-12">
          <label for="port">(Env. Config) Port</label>
          <input id="port" type="number" class="form-control" v-model="port" />
        </div>
        <div class="col-12">
          <label for="host_time">(Env. Config) HostTime</label>
          <select id="host_time" v-model="hostTime" class="form-control">
            <option :value="false">Use time from tracking server</option>
            <option :value="true">Use time from victim machine</option>
          </select>
        </div>
        <div class="col-12">
          <label for="interval">(Env. Config) Interval</label>
          <input id="interval" type="number" class="form-control" v-model="interval" />
        </div>
        <div class="col-12">
          <label for="initial_delay">(Env. Config) InitialDelay</label>
          <input id="initial_delay" type="number" class="form-control" v-model="initialDelay" />
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
import { mapActions } from 'vuex'
import RequireAuthentication from '@/mixins/RequireAuthentication'

export default {
  mixins: [RequireAuthentication],
  name: 'EditMission',
  data () {
    return {
      saving: false
    }
  },
  computed: {
    missionIndex () {
      let missionId = this.$route.params.missionId
      return this.$store.state.admin.missions.findIndex(e => e.documentId === missionId)
    },
    disabled: {
      get () {
        return !!this.$store.state.admin.missions[this.missionIndex].disabled
      },
      set (value) {
        this.$store.state.admin.missions[this.missionIndex].disabled = !!value
      }
    },
    name: {
      get () {
        return this.$store.state.admin.missions[this.missionIndex].name
      },
      set (value) {
        this.$store.state.admin.missions[this.missionIndex].name = value
      }
    },
    description: {
      get () {
        return this.$store.state.admin.missions[this.missionIndex].description
      },
      set (value) {
        this.$store.state.admin.missions[this.missionIndex].description = value
      }
    },
    group: {
      get () {
        return this.$store.state.admin.missions[this.missionIndex].group
      },
      set (value) {
        this.$store.state.admin.missions[this.missionIndex].group = value
      }
    },
    order: {
      get () {
        return this.$store.state.admin.missions[this.missionIndex].order
      },
      set (value) {
        this.$store.state.admin.missions[this.missionIndex].order = parseInt(value)
      }
    },
    text: {
      get () {
        return this.$store.state.admin.missions[this.missionIndex].text
      },
      set (value) {
        this.$store.state.admin.missions[this.missionIndex].text = value
      }
    },
    type: {
      get () {
        return this.$store.state.admin.missions[this.missionIndex].type
      },
      set (value) {
        this.$store.state.admin.missions[this.missionIndex].type = value
      }
    },
    flag: {
      get () {
        return this.$store.state.admin.missions[this.missionIndex].flag
      },
      set (value) {
        this.$store.state.admin.missions[this.missionIndex].flag = value
      }
    },
    point: {
      get () {
        return this.$store.state.admin.missions[this.missionIndex].point
      },
      set (value) {
        this.$store.state.admin.missions[this.missionIndex].point = parseInt(value)
      }
    },
    firstBloodBonus: {
      get () {
        return this.$store.state.admin.missions[this.missionIndex].firstBloodBonus
      },
      set (value) {
        this.$store.state.admin.missions[this.missionIndex].firstBloodBonus = parseInt(value)
      }
    },
    host: {
      get () {
        if (!this.$store.state.admin.missions[this.missionIndex].config) return ''
        return this.$store.state.admin.missions[this.missionIndex].config.host
      },
      set (value) {
        if (!this.$store.state.admin.missions[this.missionIndex].config) {
          this.$store.state.admin.missions[this.missionIndex].config = {}
        }
        this.$store.state.admin.missions[this.missionIndex].config.host = value
      }
    },
    port: {
      get () {
        if (!this.$store.state.admin.missions[this.missionIndex].config) return ''
        return this.$store.state.admin.missions[this.missionIndex].config.port
      },
      set (value) {
        if (!this.$store.state.admin.missions[this.missionIndex].config) {
          this.$store.state.admin.missions[this.missionIndex].config = {}
        }
        this.$store.state.admin.missions[this.missionIndex].config.port = parseInt(value)
      }
    },
    hostTime: {
      get () {
        if (!this.$store.state.admin.missions[this.missionIndex].config) return ''
        return this.$store.state.admin.missions[this.missionIndex].config.hostTime
      },
      set (value) {
        if (!this.$store.state.admin.missions[this.missionIndex].config) {
          this.$store.state.admin.missions[this.missionIndex].config = {}
        }
        this.$store.state.admin.missions[this.missionIndex].config.hostTime = !!value
      }
    },
    interval: {
      get () {
        if (!this.$store.state.admin.missions[this.missionIndex].config) return ''
        return this.$store.state.admin.missions[this.missionIndex].config.interval
      },
      set (value) {
        if (!this.$store.state.admin.missions[this.missionIndex].config) {
          this.$store.state.admin.missions[this.missionIndex].config = {}
        }
        this.$store.state.admin.missions[this.missionIndex].config.interval = parseInt(value)
      }
    },
    initialDelay: {
      get () {
        if (!this.$store.state.admin.missions[this.missionIndex].config) return ''
        return this.$store.state.admin.missions[this.missionIndex].config.initialDelay
      },
      set (value) {
        if (!this.$store.state.admin.missions[this.missionIndex].config) {
          this.$store.state.admin.missions[this.missionIndex].config = {}
        }
        this.$store.state.admin.missions[this.missionIndex].config.initialDelay = parseInt(value)
      }
    },
    increasingPoints: {
      get () {
        return this.$store.state.admin.missions[this.missionIndex].increasingPoints
      },
      set (value) {
        this.$store.state.admin.missions[this.missionIndex].increasingPoints = parseInt(value)
      }
    },
    uniqueCapturePoints: {
      get () {
        return this.$store.state.admin.missions[this.missionIndex].uniqueCapturePoints
      },
      set (value) {
        this.$store.state.admin.missions[this.missionIndex].uniqueCapturePoints = parseInt(value)
      }
    },
    uniqueCaptureIncreasingPoints: {
      get () {
        return this.$store.state.admin.missions[this.missionIndex].uniqueCaptureIncreasingPoints
      },
      set (value) {
        this.$store.state.admin.missions[this.missionIndex].uniqueCaptureIncreasingPoints = parseInt(value)
      }
    },
    holdStreakIncreasingPoints: {
      get () {
        return this.$store.state.admin.missions[this.missionIndex].holdStreakIncreasingPoints
      },
      set (value) {
        this.$store.state.admin.missions[this.missionIndex].holdStreakIncreasingPoints = parseInt(value)
      }
    },
    holdStreakComeBackStart: {
      get () {
        return this.$store.state.admin.missions[this.missionIndex].holdStreakComeBackStart
      },
      set (value) {
        this.$store.state.admin.missions[this.missionIndex].holdStreakComeBackStart = parseInt(value)
      }
    },
    parent: {
      get () {
        return this.$store.state.admin.missions[this.missionIndex].parent
      },
      set (value) {
        this.$store.state.admin.missions[this.missionIndex].parent = value
      }
    }
  },
  async created () {
    if (!this.$store.state.admin.missionsLoaded) {
      await this.load()
    }
  },
  methods: {
    ...mapActions('admin', {
      load: 'loadMissions',
      reset: 'resetMission'
    }),
    async save () {
      this.saving = true
      await this.$store.dispatch('admin/saveMission', this.$route.params.missionId)
      await this.$router.push('.')
      this.saving = false
    },
    async cancel () {
      await this.reset(this.$route.params.missionId)
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
