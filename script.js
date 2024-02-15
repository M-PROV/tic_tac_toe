//Gameboard object to manage the state of the game board
const GameBoard = (() => {
    let board = ['', '', '', '', '', '', '', '', '']; //Initial empty board

    //Method to get current game board
    const getBoard = () => board;

    //Method to reset the game board
    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
    };

    //Method to check if a cell is empty
    const isCellEmpty = (index) => board[index] === '';

    //Method to place a mark (X or O) on the board
    const placeMark = (index, mark) => {
        if(isCellEmpty(index)) {
            board[index] = mark;
            return true; //Mark successfully placed
        } else {
            return false; //Cell is not empty
        }
    };

    //Method to check for a winning condition
    const checkForWin = () => {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], //Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], //Columns
            [0, 4, 8], [2, 4, 6] //Diagonals
        ];

        for(let combination of winningCombinations) {
            const [a, b, c] = combination;
            if(board[a] && board[a] === board[b] && board[a] ==board[c]) {
                return board[a]; //Return winning mark (X or O)
            }
        }

        if (board.every(cell => cell !== '')) {
            return 'tie'; //Return tie
        }

        return null; // Game is still ongoing
    };

    return {getBoard, resetBoard, isCellEmpty, placeMark, checkForWin};
})();

//Player factory to generate player objects
const Player = (name, mark) => {
    return {name, mark};
};

//Game object to control the flow of the game
const Game = (() => {
    let currentPlayer; //Current player
    let winner = null; //Winner of the game (null if game is ongoing)

    //Method to start game
    const startGame = (player1, player2) => {
        currentPlayer = player1; //Player 1 starts game
        winner = null;
    };

    //Method to switch players
    const switchPlayer = () => {
        currentPlayer = (currentPlayer === player1) ? player2 : player1;
    };

    //Method to make a move on the game board
    const makeMove = (index) => {
        if(!winner && GameBoard.isCellEmpty(index)) {
            GameBoard.placeMark(index, currentPlayer.mark);
            winner = GameBoard.checkForWin(); //Check for winner after move
            if (winner && winner !== 'tie') {
                winner = currentPlayer;
            }
            switchPlayer(); //Switch players
        }
    };

    //Method to get current player's name
    const getCurrentPlayerName = () => currentPlayer.name;

    //Method to get the winner of the game
    const getWinner = () => winner;

    return {startGame, makeMove, getCurrentPlayerName, getWinner};
})();

const player1 = Player('Player 1', 'X');
const player2 = Player('Player 2', 'O');

//Start the game
Game.startGame(player1, player2);

//Function to render the game board on the webpage
const renderBoard = () => {
    const gameBoardElement = document.getElementById('game-board');
    gameBoardElement.innerHTML = ''; //Clear previous board

    //Loop through each cell of the game board
    for (let i = 0; i < 9; i++) {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = i; // sett data-index attribute for later reference
        cellElement.textContent = GameBoard.getBoard()[i]; //Display mark (X or O)

        //Event listener for player move
        cellElement.addEventListener('click', () => {
            if (!Game.getWinner() && GameBoard.isCellEmpty(i)) {
                Game.makeMove(i); //Make player move
                renderBoard(); //Render updated board
                updateStatus(); //Update game status
            }
        });

        gameBoardElement.appendChild(cellElement);
    }
};

//Function to update the game status message
const updateStatus = () => {
    const statusElement = document.getElementById('status-message');
    const winner = Game.getWinner();

    if(winner) {
        if(winner === 'tie') {
            statusElement.textContent = "It's a tie!";
        } else {
            statusElement.textContent = `${winner.name} wins!`;
        }
    } else {
        statusElement.textContent = `${Game.getCurrentPlayerName()}'s turn`;
    }
};

//Function to restart the game
const restartGame = () => {
    GameBoard.resetBoard(); //Reset game board
    Game.startGame(player1, player2); //Start new game
    renderBoard(); // Render initial board
    updateStatus(); //Update game status
};

//Event listener for the restart button
const restartBtn = document.getElementById('restart-btn');
restartBtn.addEventListener('click', restartGame);

//Initial rendering of the game board
renderBoard();
updateStatus();