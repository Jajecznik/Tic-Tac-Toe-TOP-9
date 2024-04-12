const textInfo = document.querySelector('.text-info');
const gameFields = document.querySelectorAll('.game-card');
const newGameBtn = document.querySelector('.new-game');

const gameboard = (() => {
    let gameboard = ['', '', '', '', '', '', '', '', ''];
    let gameOver = false;
    let turnCounter = 0;
    const winningPatterns = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
    [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

    const getGameOver = () => gameOver;
    const setGameOver = (value) => gameOver = value;
    const getTurnCounter = () => turnCounter;
    const setTurnCounter = () => turnCounter += 1;
    const clearGameboard = () => {
        gameboard = ['', '', '', '', '', '', '', '', '',];
        gameOver = false;
        turnCounter = 0;
    };
    const renderGameboard = () => {
        for (let i = 0; i < gameboard.length; i++) {
            gameFields[i].innerText = gameboard[i];
        }
    };
    const isPositionEmpty = (index) => gameboard[index] === '';
    const insertSymbol = (index, symbol) => {
        gameboard[index] = symbol;
    };
    const checkEndGame = (symbol) => {
        return winningPatterns.some(pattern => {
            return pattern.every(index => gameboard[index] === symbol);
        });
    };

    return { getGameOver, setGameOver, getTurnCounter, setTurnCounter, clearGameboard, renderGameboard, isPositionEmpty, insertSymbol, checkEndGame };
})();

newGameBtn.addEventListener('click', () => {
    gameboard.clearGameboard();
    gameboard.renderGameboard();
    textInfo.innerText = "Player X turn";
    playGame();
});

document.addEventListener("DOMContentLoaded", playGame);

function makePlayer(playerSymbol, playerTurn) {
    let symbol = playerSymbol;
    let turn = playerTurn;

    const getTurn = () => turn;
    const setTurn = (value) => turn = value;
    const getSymbol = () => symbol;
    const makeMove = (index, symbol) => gameboard.insertSymbol(index, symbol);

    return { getTurn, setTurn, getSymbol, makeMove };
}

function playGame() {
    const playerX = makePlayer('X', true);
    const playerO = makePlayer('O', false);

    gameFields.forEach(field => {
        field.addEventListener('click', () => {
            const clickedPosition = field.dataset.id;

            if (gameboard.getGameOver() || gameboard.getTurnCounter() >= 9 || !gameboard.isPositionEmpty(clickedPosition)) {
                return;
            }

            const currentPlayer = playerX.getTurn() ? playerX : playerO;
            currentPlayer.makeMove(clickedPosition, currentPlayer.getSymbol());
            gameboard.renderGameboard();
            gameboard.setTurnCounter();

            if (gameboard.checkEndGame(currentPlayer.getSymbol())) {
                gameboard.setGameOver(true);
                textInfo.innerText = `Player ${currentPlayer.getSymbol()} won the game!`;
            } else if (gameboard.getTurnCounter() == 9) {
                gameboard.setGameOver(true);
                textInfo.innerText = "Draw!";
            } else {
                playerX.setTurn(!playerX.getTurn());
                playerO.setTurn(!playerO.getTurn());

                let currentPlayer = playerX.getTurn() ? playerX : playerO;
                textInfo.innerText = `Player ${currentPlayer.getSymbol()} turn`;
            }
        });
    });
}