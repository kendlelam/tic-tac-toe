const playerFactory = (name, symbol) => {
    return {name, symbol};
};

const cellFactory = () => {
    let filled = false;
    let content = "";

    const fill = (symbol) => {
        content = symbol;
        filled = true;
    }

    const getContent = () => content;
    const isFilled = () => filled;

    return {getContent, isFilled, fill};
};

const gameBoard = (() => {
    const gameArray = [];
    let rows = 3;
    let cols = 3;

    for (let i = 0; i < rows; i++){
        gameArray[i] = [];
        for (let j = 0; j < cols; j++) {
            gameArray[i].push(cellFactory());
        }
    }
    
    const fillCell = (row, column, symbol) =>{
        gameArray[row][column].fill(symbol);
    };

    const isWin = (row, col) => {
        return colMatch(col) || rowMatch(row) || diagonalMatch();
    
    };

    const isFull = () => {
        for (let i = 0; i < rows; i++){
            for (let j = 0; j < cols; j++) {
                if (!gameArray[i][j].isFilled()){
                    return false;
                }
            }
        }
        return true;
    }

    const colMatch = (col) => {
        console.log(col);
        const first = gameArray[0][col].getContent();
        for (let i = 1; i < rows; i++) {
            if (gameArray[i][col].getContent() != first) {
                return false;
            }
        }
        return true;
    };

    const rowMatch = (row) => {
        const first = gameArray[row][0].getContent();
        for (let i = 1; i < cols; i++) {
            if (gameArray[row][i].getContent() != first) {
                return false;
            }
        }
        return true;
    };

    const diagonalMatch = () => {
        let match = true;
        let first = gameArray[0][0].getContent();
        if (first === "") {
            match = false;
        }
        for (let i = 1; i < rows; i++) {
            if (gameArray[i][i].getContent() != first || !gameArray[i][i].isFilled){
                match = false;
                break;
            }
        }
        if (match) {
            return true;
        }
        first = gameArray[0][cols-1].getContent();
        if (first === "") {
            return false;
        }
        for (let i = 1; i < rows; i++) {
            if (gameArray[i][cols-1-i].getContent() != first || !gameArray[i][cols-1-i].isFilled){
                return false;
            }
        }
        return true;
    };

    const getBoard = () => gameArray;

    const reset = () => {
        for (let i = 0; i < rows; i++){
            gameArray[i] = [];
            for (let j = 0; j < cols; j++) {
                gameArray[i].push(cellFactory());
            }
        }
    }

    return {fillCell, getBoard, isWin, isFull, reset};
})();




const GameController = (() => {
    const player1 = playerFactory("Player 1", "X");
    const player2 = playerFactory("Player 2", "O");

    const players = [player1, player2];
    let active = players[0];
    let gameOver = false;
    let winner = null;

    const playRound = (row, column) => {
        if (!gameBoard.getBoard()[row][column].isFilled() && !gameOver){
            gameBoard.fillCell(row, column, active.symbol);
            if (gameBoard.isWin(row,column)) {
                winner = active;
                gameOver = true;
            }
            if (gameBoard.isFull() && !gameOver){
                gameOver = true;
            }

            switchActive();
        }
        
    }
    const reset = ()=>{
        active = players[0];
        gameOver = false;
        winner = null;
        gameBoard.reset();
    }

    const switchActive = () => {
        active = active === players[0] ? players[1] : players[0];
    }

    const getWinner = ()=> winner;
    const isOver = ()=> gameOver;
    return {playRound, reset, getWinner, isOver};

    

})();


const ScreenController = (() => {

    const container = document.querySelector(".container");
    const resetButton = document.querySelector(".reset-button");
    const message = document.querySelector(".winner");

    const updateScreen = () =>{
        container.innerHTML = '';
        gameBoard.getBoard().forEach((e, row)=>{
            for (let col = 0; col < e.length; col++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = row;
                cell.dataset.column = col;
                cell.textContent = e[col].getContent();
                container.appendChild(cell);
            }
        })
        if (GameController.isOver()){
            if (GameController.getWinner()){
                message.textContent = `${GameController.getWinner().name} wins!`;
            } else {
                message.textContent = "Tie!";
            }
            
        }
    }

    function clickHandlerBoard(e) {
        if (e.target.dataset.row && e.target.dataset.column){
            GameController.playRound(e.target.dataset.row, e.target.dataset.column);
            updateScreen();
        }    
    }

    function resetBoard(e) {
        GameController.reset();
        message.textContent = '';
        updateScreen();
    }
    
    container.addEventListener("click", clickHandlerBoard);
    resetButton.addEventListener("click", resetBoard);
    updateScreen();
    
})();
