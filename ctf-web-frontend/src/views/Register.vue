<template>
  <div class="page-container">
    <form class="form-signin" @submit.prevent="register">
      <h1 class="h3 mb-3 font-weight-normal">Create an account</h1>
      <label for="inputEmail" class="sr-only">Email address</label>
      <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus  v-model="email">
      <label for="inputDisplayName" class="sr-only">Display Name</label>
      <input type="text" id="inputDisplayName" class="form-control" placeholder="Display Name" required autofocus  v-model="displayName">
      <label for="inputPassword" class="sr-only">Password</label>
      <input type="password" id="inputPassword" class="form-control" placeholder="Password" required v-model="password">
      <label for="inputConfirmPassword" class="sr-only">Confirm Password</label>
      <input type="password" id="inputConfirmPassword" class="form-control" placeholder="Confirm Password" required v-model="confirmPassword">
      <button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>
      <p id="login-link">already have an account ? <a href="javascript:void(0)" @click="redirectToLogin">sign in</a></p>
    </form>
  </div>
</template>

<script>
import RequireGuest from '@/mixins/RequireGuest.js'
import firebase from '@/firebase.js'
import FromDatabase from '@/firebase-utilities/FromDatabase'

export default {
  mixins: [RequireGuest],
  name: 'Register',
  data () {
    return {
      email: '',
      displayName: '',
      password: '',
      confirmPassword: ''
    }
  },
  methods: {
    async register () {
      if (this.password !== this.confirmPassword) {
        alert('passwords not match')
        return
      }

      await firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
      await FromDatabase.updateUserProfile({
        displayName: this.displayName
      })
      this.$router.push(this.$route.query.next || '/')
    },
    redirectToLogin () {
      this.$router.push({
        name: 'login',
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
.form-signin input#inputEmail {
  margin-bottom: 10px;
}
.form-signin input#inputDisplayName {
  margin-bottom: 10px;
}
.form-signin input#inputPassword {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input#inputConfirmPassword {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.form-signin #login-link {
  margin-top: 10px;
}
</style>
