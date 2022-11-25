const firebase = require('firebase/app')
require('firebase/auth')
require('firebase/database')
require('firebase/firestore')

firebase.initializeApp({
    apiKey: "AIzaSyBpC_h1QFxUbkZPh0rfawJ_3bNn0OLO2l0",
    authDomain: "tni-cwc.firebaseapp.com",
    databaseURL: "https://tni-cwc.firebaseio.com",
    projectId: "tni-cwc",
    storageBucket: "tni-cwc.appspot.com",
    messagingSenderId: "422027819489",
    appId: "1:422027819489:web:fe4afd53fe4bf08498faa0"
})

export default firebase
