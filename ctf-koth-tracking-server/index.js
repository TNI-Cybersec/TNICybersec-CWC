(async function () {
    const GameSelector = await require('./GameSelector')
    const EndpointTracker = require('./EndpointTracker')
    const MainMenu = require('./MainMenu')

    console.log('=== CTF Tracker for King of the Hill mission ===')
    if (GameSelector.isLoggedIn()) {
        console.log('Logged in as: ' + GameSelector.getEmail())

        if (GameSelector.getGameId()) {
            console.log('Booting tracker...')
            await EndpointTracker.boot()
        }
    }

    if (process.argv.includes('--daemon')) {
        if (!GameSelector.isLoggedIn()) {
            console.error('[ERROR] Could not start tracking daemon without authentication')
        }

        if (!GameSelector.getGameId()) {
            console.error('[ERROR] Could not start tracking daemon without selected game')
        }
    } else {
        MainMenu.registerEntry(EndpointTracker)
        MainMenu.registerEntry(GameSelector)
    
        while (true) await MainMenu.selectMenu()
    }
})()