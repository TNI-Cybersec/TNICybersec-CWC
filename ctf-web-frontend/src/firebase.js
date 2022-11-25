import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/messaging'
import 'firebase/functions'

firebase.initializeApp({
  apiKey: 'AIzaSyBpC_h1QFxUbkZPh0rfawJ_3bNn0OLO2l0',
  authDomain: 'tni-cwc.firebaseapp.com',
  databaseURL: 'https://tni-cwc.firebaseio.com',
  projectId: 'tni-cwc',
  storageBucket: 'tni-cwc.appspot.com',
  messagingSenderId: '422027819489',
  appId: '1:422027819489:web:40d10271bbb99ba698faa0'
})

export default firebase
