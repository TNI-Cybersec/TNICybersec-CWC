const inquirer = require('inquirer')

module.exports = {
    registered: [],
    registerEntry (entry) {
        if (typeof entry.menu === 'function') {
            this.registered.push(entry)
        }
    },
    async selectMenu () {
        let menus = []
        let actionSources = {}

        for (let i = 0; i < this.registered.length; i++) {
            if (typeof this.registered[i].menu === 'function') {
                let returnValue = this.registered[i].menu()

                if (returnValue instanceof Promise) {
                    returnValue = await returnValue
                }

                if (Array.isArray(returnValue)) {
                    menus = menus.concat(returnValue)
                }

                for (let j = 0; j < returnValue.length; j++) {
                    actionSources[returnValue[j].value] = this.registered[i]
                }
            }
        }

        actionSources.exit = process
        menus.push({
            name: 'Exit program',
            value: 'exit'
        })

        console.log()
        let selection = await inquirer.prompt({
            type: 'list',
            name: 'selectionMenu',
            message: 'Select an option:',
            choices: menus
        })

        let action = actionSources[selection.selectionMenu][selection.selectionMenu]()
        if (action instanceof Promise) action = await action
    }
}