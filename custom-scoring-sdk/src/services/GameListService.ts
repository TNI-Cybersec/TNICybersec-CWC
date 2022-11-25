import GameService from './GameService'
import firebase from '../utilities/Firebase'
import AuthService from './AuthService'
import GameListItem from '../models/GameListItem'

export default class GameListService {
    static async listGames (): Promise<Array<GameListItem>> {
        let snapshot = await firebase.firestore().collection('events').where(`admins.${this.getCurrentUserId()}`, '==', 'owner').get()
        let list = []

        snapshot.forEach(gameListItem => {
            const { name } = gameListItem.data()
            list.push(new GameListItem(gameListItem.id, name))
        })

        return list
    }

    static getGameControlInstance (game: string|GameListItem) {
        if (game instanceof GameListItem) {
            game = game.getId()
        }

        if (typeof game === 'string') {
            return new GameService(game)
        } else {
            throw new TypeError('Invalid game id')
        }
    }

    private static getCurrentUserId () {
        return AuthService.currentUser.uid
    }
}
