import { Chess } from './chess.js'

// Gets current lichess game
export function getCurrentGame(moves) {
    const chess = new Chess()

    for (let i=0; i < moves.length; i++) {
        chess.move({from: moves[i].substring(0,2), to: moves[i].substring(2,4)})
    }

    return chess
}

// Returns the chess.move for en passant, or null if none avaliable
export function hasEnPassant(game) {
    const moves = game.moves({ verbose: true })
    for (let i=0; i < moves.length; i++) {
        if (moves[i].flags.includes('e')) { return moves[i] }
    }
    return null
}