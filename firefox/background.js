

let API_KEY = ""
let toggle = false

browser.storage.sync.get(['API_KEY'], (result) => {
    API_KEY = result.API_KEY
})

browser.storage.sync.get(['toggle'], (result) => {
    toggle = result.toggle
})

browser.storage.onChanged.addListener((changes, areaName) => {
    if (changes.API_KEY) {API_KEY = changes.API_KEY.newValue}
    if (changes.toggle) {toggle = changes.toggle.newValue}
})

// Gets the moves from script.js and checks for the funny
browser.runtime.onMessage.addListener((moves, sender) => {
    if (moves !== null && toggle) {
        const game = getCurrentGame(moves)
        const move = hasEnPassant(game)
        if (move !== null) {
            fetch('https://lichess.org/api/board/game/' + sender.url.split('/')[3] + '/move/' + move.from + move.to, {
                method: "post",
                headers: {
                    "Authorization": "Bearer " + API_KEY 
                }
            })
        }
    }
    
})

browser.webNavigation.onCompleted.addListener((details) => {
    if (details.frameId == 0) {
        browser.tabs.executeScript({
            file: 'src/script.js'
        })
    }
})
