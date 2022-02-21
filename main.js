// Player factory function
const Player = (symbol) => {
    let _isActive = false;

    const getSymbol = () => symbol;

    const getIsActive = () => _isActive;

    const setIsActive = () => {
        const PlAYER_ICON = document.querySelector(`#${symbol}`);
        PlAYER_ICON.classList.toggle("active");
        _isActive = !_isActive;
    }

    return {getSymbol, getIsActive, setIsActive}
}

// Gameboard module -- handles only things directly related to the gameboard
const gameBoard = (() => {
    let _board = Array(9).fill(null);

    const GAMEBOARD_ELEMENT = document.querySelector(".gameboard");

    const getBoard = () => _board;

    const setBoardElement = (idx, val) => _board[idx] = val; 

    const resetBoard = () => _board = Array(9).fill(null);

    const updateBoard = () => {
        _BOXES.forEach(box => {
            box.innerText = _board[box.id];
        })
    }

    const _render = (() => {
        for(let i = 0; i <= 8; i++) {
            const div = document.createElement("div");
            div.classList.add('box');
            div.id = i;
            div.innerText = _board[i];
            GAMEBOARD_ELEMENT.appendChild(div)
        } 
    })();  


    const _BOXES = document.querySelectorAll('.box');

    _BOXES.forEach(box => {
        box.addEventListener("click", () => {
            gameController.placeMarker(box)
        })
    })

    return {getBoard, setBoardElement, resetBoard, updateBoard}
})();

// Primary module for handling game logic
const gameController = (() => {
    const _startButton = document.querySelector("#start-btn");
    const _restartButton = document.querySelector("#restart-btn");

    const _WIN_COMBOS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    // Starting point
    const playerX = Player("X");
    const playerO = Player("O");
    let _movesLeft;
    let _game = false;

    _startButton.addEventListener("click", () => {
        if(_game) return
        if(_movesLeft <= 0) return
        playerX.setIsActive();
        _movesLeft = 9;
        _game = true;
    });

    _restartButton.addEventListener("click", () => {
        document.querySelectorAll(".box").forEach(box => {
            box.classList.remove("win");
        })

        const gameResult = document.querySelector(".game-result");
        gameResult.innerText = "PLACEHOLDER";
        gameResult.classList.remove("game-over");

        _resetPlayers();
        gameBoard.resetBoard();
        gameBoard.updateBoard();
        _movesLeft = 9;
        _game = false;
    });

    // Main function called on every box click
    const placeMarker = (clickedBox) => {
        if(!_game) return
        if(clickedBox.innerText !== "") return

        const activePlayer = playerX.getIsActive() === true ? playerX : playerO;
        const activePlayerSymbol = activePlayer.getSymbol();

        gameBoard.setBoardElement(clickedBox.id, activePlayerSymbol);
        gameBoard.updateBoard();

        const win = _checkForWin();

        if(win) return

        playerX.setIsActive();
        playerO.setIsActive();
    };

    const _checkForWin = () => {
        const board = gameBoard.getBoard();
        const activePlayer = playerX.getIsActive() === true ? playerX : playerO;
        const activePlayerSymbol = activePlayer.getSymbol();
        let winConfirmed = false;

        // Check current board values against win combos
        _WIN_COMBOS.forEach(combo => {
            if(
                board[combo[0]] === activePlayerSymbol &&
                board[combo[1]] === activePlayerSymbol &&
                board[combo[2]] === activePlayerSymbol
            ) {
                const BOXES = document.querySelectorAll(".box");
                BOXES.forEach(box => {
                    combo.forEach(idx => {
                        if(+box.id === idx) box.classList.add("win");
                    })
                })

                displayController.displayWin(activePlayerSymbol);
                _resetPlayers();
                winConfirmed = true;
                _game = false;
                _movesLeft = 0;
            }
        });

        _movesLeft--;

        if(_movesLeft === 0) {
            displayController.displayTie();
            winConfirmed = true;
            _resetPlayers();
            _game = false;
        }

        return winConfirmed
    }

    // Set both player to inactive
    const _resetPlayers = () => {
        if(playerX.getIsActive() === true) playerX.setIsActive();
        if(playerO.getIsActive() === true) playerO.setIsActive();
    }

    return {placeMarker}
})();

const displayController = (() => {
    const _gameResult = document.querySelector(".game-result");

    const displayWin = (winner) => {
        _gameResult.innerText = `Player ${winner} wins!`;
        _gameResult.classList.add("game-over");
    }

    const displayTie = () => {
        _gameResult.innerText = "It's a tie!";
        _gameResult.classList.add("game-over");
    }

    return {displayWin, displayTie}
})();


