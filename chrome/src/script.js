var API_KEY = ""

// https://gist.github.com/ornicar/a097406810939cf7be1df8ea30e94f3e
const readStream = processLine => response => {
    const stream = response.body.getReader();
    const matcher = /\r?\n/;
    const decoder = new TextDecoder();
    let buf = '';

    const loop = () =>
    stream.read().then(({ done, value }) => {
        if (done) {
        if (buf.length > 0) processLine(JSON.parse(buf));
        } else {
        const chunk = decoder.decode(value, {
            stream: true
        });
        buf += chunk;

        const parts = buf.split(matcher);
        buf = parts.pop();
        for (const i of parts.filter(p => p)) processLine(JSON.parse(i));
        return loop();
        }
    });

    return loop();
}

chrome.storage.sync.get(['API_KEY'], (result) => {
    API_KEY = result.API_KEY

    function main() {
        // Actual shit starts here
        const gameId = window.location.href.split('/')[3] 
        const boardStream = fetch('https://lichess.org/api/board/game/stream/' + gameId, {
            headers: {
                Authorization: "Bearer " + API_KEY,
                Accept: "application/x-ndjson"
            }
        })

        boardStream.then(readStream(game => {
            let moves
            if (game.type == "gameFull") { moves = game.state.moves.split(' ') } 
            else if (game.type == "gameState") { moves = game.moves.split(' ') } 

            chrome.runtime.sendMessage(moves) // Sends to background process because browser can't import the chess library for whatever reason 
        }))
    }

    chrome.storage.onChanged.addListener((changes, areaName) => {
        API_KEY = changes.API_KEY.newValue
        main()
    })

    main()
})