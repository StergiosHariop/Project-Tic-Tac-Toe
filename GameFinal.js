/* Game */

const startGame = (() => { 

    var gameBoard;
    let humanPlayer = 'X';
    let aiPlayer = 'O';

    /* Winning combination Array */
    
    const winning_combo = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,4,8],
        [2,4,6],
        [0,3,6],
        [1,4,7],
        [2,5,8]
    ];
           
    const $cells = Array.from($('.cell'));
          
    /* On click function for human/Ai play */

    const turnClick = (cell) => {
        if(cell.target.innerText === ''){
            turn(cell.target.id, humanPlayer);  
            if(!checkWin(gameBoard,humanPlayer) && !checkTie()){
                turn(bestSpot(), aiPlayer)
            }  
        }
    };

    /* passing parameters to the Turn function,
    checking if there is a winner  */
       
    const turn = (cellId, player) => {
    
        gameBoard[cellId] = player;   
        document.getElementById(cellId).innerText = player;
        let gameWon = checkWin(gameBoard,player);
            if(gameWon){
                    gameOver(gameWon);
            }    
    };
    
    /* Winner check function */

    const checkWin = (board,player) => {
        let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);  
        let gameWon = null;

        for(let [index,win] of winning_combo.entries()){
            if(win.every(mark => plays.indexOf(mark) > -1)){
                gameWon = {
                    index: index, 
                    player: player
                };
                break;
            }
        }
        return gameWon;
    };

    /* Draw check function*/

    const checkTie = () => {
        if(emptyCells().length === 0){
            $cells.forEach((cell) => {
                cell.removeEventListener('click', turnClick);
            });
            declareWinner('Draw!');
            return true;
        }
        return false;
    };

    /* Functions that display who won */
            
    const gameOver = (gameWon) => {
        $cells.forEach((cell) => {
            cell.removeEventListener('click', turnClick);
        });
        declareWinner(gameWon.player === humanPlayer ? "You Win!" : "AI Wins!");
    };
                 
    const declareWinner = (who) => {
        document.querySelector('.endgame').style.display = 'block';
        document.querySelector('.endgame').innerText =  who;
    };
    
    /* AI functions(checking empty cells and the MiniMax function for
       the best possible move) */
            
    const emptyCells = () => {
        return gameBoard.filter(s => typeof s === 'number');
    };
                    
    const bestSpot = () => {
        return minimax(gameBoard, aiPlayer).index;
    };
            
     /* The MiniMax Function */  
     
    const minimax = (newBoard, player) => {
        var availSpots = emptyCells();
            
        if (checkWin(newBoard, humanPlayer)) {
            return {score: -10};
        } else if (checkWin(newBoard, aiPlayer)) {
            return {score: 10};
        } else if (availSpots.length === 0) {
            return {score: 0};
        }

        var moves = [];
        for (var i in availSpots) {
            var move = {};
            move.index = newBoard[availSpots[i]];
            newBoard[availSpots[i]] = player;
            
            if (player == aiPlayer) {
                var result = minimax(newBoard, humanPlayer);
                move.score = result.score;
            } else {
                var result = minimax(newBoard, aiPlayer);
                move.score = result.score;
            }
            newBoard[availSpots[i]] = move.index;  
            moves.push(move);
        }
            
        var bestMove;
        if(player === aiPlayer) {
            var bestScore = -10000;
            for(var i in moves) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
         } else {
            var bestScore = 10000;
            for(var i in moves) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    };
    
    /*Game Start function looping through all the cells and adding
      event listeners */

    const startGame = () => {
        $cells.forEach((cell) => {
            document.querySelector('.endgame').style.display = 'none'; 
            gameBoard = Array.from(Array(9).keys());
            cell.innerText = '';
            cell.addEventListener('click', turnClick);
        });
    };
            
    startGame();      

    /* New Game button */
            
    const restartButton = $('.restartBtn');
    restartButton.on('click', startGame);
    
})();

    
    
    
    