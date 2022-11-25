<template>
  <div class="page-container full-content">
    <section class="jumbotron text-center">
      <div class="container">
        <h1 class="jumbotron-heading">My Account</h1>
      </div>
    </section>
    <div class="container mt-3 mb-3">
      <h4 class="mb-4">Edit Profile</h4>
      <div class="row form">
        <div class="col-12">
          <label for="name">Display Name</label>
          <input id="name" type="text" class="form-control" v-model="displayName">
        </div>
        <div class="col-12 mt-2">
          <a class="btn btn-primary" href="javascript:void(0)" @click="updateProfile">Save</a>
          <p class="m-0" v-if="profileUpdating">Saving...</p>
        </div>
      </div>
    </div>
    <div class="container mt-3 mb-3">
      <h4 class="mb-4">Change Password</h4>
      <div class="row form">
        <div class="col-12">
          <label for="current-password">Current Password</label>
          <input id="current-password" type="password" class="form-control" v-model="currentPassword">
        </div>
        <div class="col-12">
          <label for="new-password">New Password</label>
          <input id="new-password" type="password" class="form-control" v-model="newPassword">
        </div>
        <div class="col-12">
          <label for="confirm-password">Confirm New Password</label>
          <input id="confirm-password" type="password" class="form-control" v-model="confirmPassword">
        </div>
        <div class="col-12 mt-2">
          <a class="btn btn-primary" href="javascript:void(0)" @click="updatePassword">Change Password</a>
          <p class="m-0" v-if="passwordUpdating">Changing...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RequireAuthentication from '@/mixins/RequireAuthentication.js'
import Firebase from '@/firebase'
import FromDatabase from '@/firebase-utilities/FromDatabase'

export default {
  mixins: [RequireAuthentication],
  name: 'Profile',
  data () {
    return {
      displayName: '',
      profileUpdating: false,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      passwordUpdating: false
    }
  },
  created () {
    this.displayName = this.$store.state.auth.currentUser.displayName
  },
  methods: {
    async updateProfile () {
      if (!this.displayName) return

      this.profileUpdating = true
      await FromDatabase.updateUserProfile({
        displayName: this.displayName
      })
      this.profileUpdating = false
    },
    async updatePassword () {
      if (!this.currentPassword) return
      if (!this.newPassword) return
      if (this.newPassword !== this.confirmPassword) return

      const user = this.$store.state.auth.currentUser
      const userEmail = this.$store.state.auth.currentUser.email

      const credential = Firebase.auth.EmailAuthProvider.credential(userEmail, this.currentPassword)

      this.passwordUpdating = true
      await user.reauthenticateWithCredential(credential)
      await user.updatePassword(this.newPassword)
      this.passwordUpdating = false
    }
  }
}
</script>

<style scoped>

</style>
