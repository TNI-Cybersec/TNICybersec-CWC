<template>
  <div class="page-container">
    <form class="form-signin" @submit.prevent="login">
      <h1 class="h3 mb-3 font-weight-normal">Sign in to TNI-CWC</h1>
      <label for="inputEmail" class="sr-only">Email address</label>
      <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus  v-model="email">
      <label for="inputPassword" class="sr-only">Password</label>
      <input type="password" id="inputPassword" class="form-control" placeholder="Password" required v-model="password">
      <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
      <p id="forget-password"><router-link to="/forget-password">forget password ?</router-link></p>
      <p id="register-link">don't have an account ? <a href="javascript:void(0)" @click="redirectToRegister">create an account</a></p>
    </form>
  </div>
</template>

<script>
import RequireGuest from '@/mixins/RequireGuest.js'
import firebase from '@/firebase.js'

export default {
  mixins: [RequireGuest],
  name: 'Login',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async login () {
      await firebase.auth().signInWithEmailAndPassword(this.email, this.password)
      this.$router.push(this.$route.query.next || '/')
    },
    redirectToRegister () {
      this.$router.push({
        name: 'register',
        query: this.$route.query
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
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.form-signin #forget-password {
  margin-top: 10px;
}
</style>
