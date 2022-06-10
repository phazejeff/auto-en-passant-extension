import { hasEnPassant, getCurrentGame } from './util.js'

let API_KEY = ""
let toggle = false

chrome.storage.sync.get(['API_KEY'], (result) => {
    API_KEY = result.API_KEY
})

chrome.storage.sync.get(['toggle'], (result) => {
    toggle = result.toggle
})

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (changes.API_KEY) {API_KEY = changes.API_KEY.newValue}
    if (changes.toggle) {toggle = changes.toggle.newValue}
})

// Gets the moves from script.js and checks for the funny
chrome.runtime.onMessage.addListener((moves, sender) => {
    console.log(toggle)
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

chrome.webNavigation.onCompleted.addListener((details) => {
    if (details.frameId == 0) {
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            files: ['src/script.js']
        })
    }
})
