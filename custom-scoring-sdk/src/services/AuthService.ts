import Firebase from '../utilities/Firebase'
import LocalStorage from './LocalStorage'
const User = require('firebase').User

export default class AuthService {
    static currentUser = null

    static async initializeAuthentication () {
        let loadedUser = LocalStorage.get('currentUser')
        if (loadedUser) {
            this.currentUser = new User(loadedUser, loadedUser.stsTokenManager, loadedUser)
            await Firebase.auth().updateCurrentUser(this.currentUser)
        }
    }

    static async signInWithEmailAndPassword (email, password) {
        await Firebase.auth().signInWithEmailAndPassword(email, password)
        this.currentUser = Firebase.auth().currentUser.toJSON()
        LocalStorage.set('currentUser', this.currentUser)
    }

    static async signOut () {
        await Firebase.auth().signOut()
        this.currentUser = null
        LocalStorage.set('currentUser', null)
    }
}
