const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let board = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

function displayBoard() {
    console.log("  a b c d e f g h");
    console.log(" +----------------");
    for (let row = 0; row < 8; row++) {
        let rowString = (8 - row) + "|";
        for (let col = 0; col < 8; col++) {
            rowString += board[row][col] + " ";
        }
        console.log(rowString + "|");
    }
    console.log(" +----------------");
}

function isValidMove(from, to, piece) {
    const fromRow = 8 - parseInt(from[1]);
    const fromCol = from.charCodeAt(0) - 'a'.charCodeAt(0);
    const toRow = 8 - parseInt(to[1]);
    const toCol = to.charCodeAt(0) - 'a'.charCodeAt(0);
    const targetPiece = board[toRow][toCol];

    if (piece === 'P') {
        if (fromCol === toCol && targetPiece === '.' && toRow === fromRow - 1) return true;
        if (fromCol === toCol && targetPiece === '.' && fromRow === 6 && toRow === 4) return true;
        if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow - 1 && targetPiece.toLowerCase() === targetPiece) return true;
    }
    if (piece === 'p') {
        if (fromCol === toCol && targetPiece === '.' && toRow === fromRow + 1) return true;
        if (fromCol === toCol && targetPiece === '.' && fromRow === 1 && toRow === 3) return true;
        if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + 1 && targetPiece.toUpperCase() === targetPiece) return true;
    }
    if (piece === 'R' || piece === 'r') {
        if (fromRow === toRow || fromCol === toCol) {
            for (let i = 1; i < Math.abs(fromRow - toRow); i++) {
                if (board[fromRow < toRow ? fromRow + i : fromRow - i][fromCol] !== '.') return false;
            }
            return targetPiece.toUpperCase() !== piece.toUpperCase();
        }
    }
    if (piece === 'N' || piece === 'n') {
        const knightMoves = [
            [2, 1], [2, -1], [-2, 1], [-2, -1],
            [1, 2], [1, -2], [-1, 2], [-1, -2]
        ];
        for (const move of knightMoves) {
            if (fromRow + move[0] === toRow && fromCol + move[1] === toCol) {
                return targetPiece.toUpperCase() !== piece.toUpperCase();
            }
        }
    }
    if (piece === 'B' || piece === 'b') {
        if (Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) {
            const stepRow = (toRow - fromRow) / Math.abs(toRow - fromRow);
            const stepCol = (toCol - fromCol) / Math.abs(toCol - fromCol);
            for (let i = 1; i < Math.abs(fromRow - toRow); i++) {
                if (board[fromRow + i * stepRow][fromCol + i * stepCol] !== '.') return false;
            }
            return targetPiece.toUpperCase() !== piece.toUpperCase();
        }
    }
    if (piece === 'Q' || piece === 'q') {
        if (fromRow === toRow || fromCol === toCol || Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) {
            const stepRow = fromRow === toRow ? 0 : (toRow - fromRow) / Math.abs(toRow - fromRow);
            const stepCol = fromCol === toCol ? 0 : (toCol - fromCol) / Math.abs(toCol - fromCol);
            for (let i = 1; i < Math.max(Math.abs(fromRow - toRow), Math.abs(fromCol - toCol)); i++) {
                if (board[fromRow + i * stepRow][fromCol + i * stepCol] !== '.') return false;
            }
            return targetPiece.toUpperCase() !== piece.toUpperCase();
        }
    }
    if (piece === 'K' || piece === 'k') {
        if (Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1) {
            return targetPiece.toUpperCase() !== piece.toUpperCase();
        }
    }
    return false;
}

function makeMove(move) {
    const [from, to] = move.split(' ');
    if (!to) {
        console.log("Invalid move format. Please enter your move as 'from to' (e.g., e2 e4).");
        return;
    }
    const fromRow = 8 - parseInt(from[1]);
    const fromCol = from.charCodeAt(0) - 'a'.charCodeAt(0);
    const toRow = 8 - parseInt(to[1]);
    const toCol = to.charCodeAt(0) - 'a'.charCodeAt(0);
    if (fromRow < 0 || fromRow > 7 || fromCol < 0 || fromCol > 7 || 
        toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) {
        console.log("Move is out of bounds. Please enter a valid move.");
        return;
    }
    const piece = board[fromRow][fromCol];
    if (piece === '.') {
        console.log("No piece at the starting position. Please enter a valid move.");
        return;
    }
    if (!isValidMove(from, to, piece)) {
        console.log("Invalid move for the selected piece. Please enter a valid move.");
        return;
    }
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = '.';
}

function gameLoop() {
    displayBoard();
    rl.question('Enter your move (e.g., e2 e4): ', (move) => {
        makeMove(move);
        gameLoop();
    });
}

gameLoop();