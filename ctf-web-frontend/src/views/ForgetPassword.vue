A<template>
  <div class="page-container">
    <form class="form-signin" @submit.prevent="submit">
      <h1 class="h3 mb-3 font-weight-normal">Forget Password</h1>
      <label for="inputEmail" class="sr-only">Email address</label>
      <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus  v-model="email">
      <button class="btn btn-lg btn-primary btn-block" type="submit">Reset Password</button>
      <p id="know-password">know your password ? <a href="javascript:void(0)" @click="redirectToLogin">Login</a></p>
    </form>
  </div>
</template>

<script>
import RequireGuest from '@/mixins/RequireGuest.js'
import firebase from '@/firebase.js'

export default {
  mixins: [RequireGuest],
  name: 'ForgetPassword',
  data () {
    return {
      email: ''
    }
  },
  methods: {
    async submit () {
      await firebase.auth().sendPasswordResetEmail(this.email)
      alert('Please wait for email')
      this.$router.push('/')
    },
    async redirectToLogin () {
      this.$router.push({
        name: 'login',
        query: {
          next: '/'
        }
      })
    }
  }
}
</script>

<style scoped>
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: 0 auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: 10px;
}
.form-signin #know-password {
  margin-top: 10px;
}
</style>
