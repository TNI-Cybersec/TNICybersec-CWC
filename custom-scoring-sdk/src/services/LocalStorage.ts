import SdkConfiguration from "../interfaces/SdkConfiguration"

const fs = require('fs')

export default class LocalStorage {
    static STATE_FILE = 'state.json'
    static localStorage = null

    static async initializeLocalStorage (config: SdkConfiguration) {
        this.STATE_FILE = config.programPersistentFilePath
        if (fs.existsSync(this.STATE_FILE)) {
            this.localStorage = JSON.parse(fs.readFileSync(this.STATE_FILE) || '{}')
        } else {
            this.localStorage = {}
        }
        
    }

    static get (key: string): any {
        return this.localStorage[key]
    }

    static set (key: string, value: any) {
        this.localStorage[key] = value
        this.saveData()
    }

    static toJSON () {
        return JSON.stringify(this.localStorage)
    }

    static saveData () {
        fs.writeFileSync(this.STATE_FILE, this.toJSON())
    }
}