function checkKey(API_KEY) {
    fetch('https://lichess.org/api/account', {
        headers: {
            Authorization: "Bearer " + API_KEY,
            Accept: "application/x-ndjson"
        }
    }).then(r => {
        if (r.status !== 200) {
            document.getElementById('checkbox-switch').disabled = true
            document.getElementById('span-switch').style.cursor = "not-allowed"
            document.getElementById('span-switch').style.title = "Invalid API Key"
        } else {
            document.getElementById('checkbox-switch').disabled = false
            document.getElementById('span-switch').style.cursor = "pointer"
            document.getElementById('span-switch').style.title = null
        }
    })
}

// API Key
chrome.storage.sync.get(['API_KEY'], (result) => {
    if (result.API_KEY == null) {
        document.getElementById('api-key').value = ""
    } else {
        document.getElementById('api-key').value = result.API_KEY
    }

    checkKey(result.API_KEY)
})

document.getElementById('api-key').addEventListener('change', (key) => {
    chrome.storage.sync.set({API_KEY: key.target.value})
    checkKey(key.target.value)
})


// Toggles
chrome.storage.sync.get(['toggle'], (result) => {
    if (result.toggle == true) {
        document.getElementById('checkbox-switch').checked = true
    } else {
        document.getElementById('checkbox-switch').checked = false
    }
})

document.getElementById('checkbox-switch').addEventListener('change', (e) => {
    chrome.storage.sync.set({toggle: e.target.checked})
})