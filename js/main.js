'use strict';

var EMPTY = ' ';
var MINE = '💣';
var FLAG = '🚩';
var LIFE = '❤️';
var NORMAL = '😀';
var LOSE = '🤯';
var WIN = '😎';
var gBoard;
var gTimeStart;
var gTimeEnd;
var gTimeInterval;
var gTime = 0;
var gMouseClick;
var gLives = 1;
var gCountMineFlag = 0
var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gFlagLimit = gLevel.MINES - gLives;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}



function initGame() {
    changeSmiley(NORMAL);
    gGame.isOn = true;
    gBoard = buildBoard();
    renderBoard(gBoard);
    putMinesOnBoard();
    storeMineCount(gBoard);
    UpdateNumOfLives(gLives);
    changeSmiley(NORMAL);

}

// changes the level of the game
function gameLevel(btn) {
    var elModal = document.querySelector('.modal');
    var elCentered = document.querySelector('.centered');
    if (btn.classList.contains('beginner')) {
        changeSmiley(NORMAL);
        gLevel.SIZE = 4;
        gLevel.MINES = 2;
        gLives = 1;
        gFlagLimit = gLevel.MINES - gLives;
        UpdateNumOfLives(gLives);
        play();
        elCentered.style.left = '52%';
        elModal.style.display = 'none';
    }
    if (btn.classList.contains('medium')) {
        changeSmiley(NORMAL);
        gLevel.SIZE = 8;
        gLevel.MINES = 12;
        gLives = 3;
        gFlagLimit = gLevel.MINES - gLives;
        UpdateNumOfLives(gLives);
        play();
        elCentered.style.left = '47%';
        elModal.style.display = 'none';
    }
    if (btn.classList.contains('expert')) {
        changeSmiley(NORMAL);
        gLevel.SIZE = 12;
        gLevel.MINES = 30;
        gLives = 3;
        gFlagLimit = gLevel.MINES - gLives;
        UpdateNumOfLives(gLives);
        play();
        elCentered.style.left = '41%';
        elModal.style.display = 'none';

    }

}
// This function is for playing the game again
function play() {
    var elStopWatch = document.querySelector('.stopwatch');
    if (gTimeInterval) {
        clearInterval(gTimeInterval);
        elStopWatch.innerText = '00:00';
    }
    gTime = 0;
    gTimeInterval = null;
    changeSmiley(NORMAL);
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'none';
    gBoard = buildBoard();
    renderBoard(gBoard);
    putMinesOnBoard();
    storeMineCount(gBoard);
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.isOn = true;
    gCountMineFlag = 0;


}
//restart function on smiley
function restartGame() {
    changeSmiley(NORMAL);
    if ((gLevel.SIZE === 8) || (gLevel.SIZE === 12)) {
        gLives = 3;
        UpdateNumOfLives(gLives);
    } else {
        gLives = 1;
        UpdateNumOfLives(gLives);
    }
    play();
}
// changes the smiley icon in dom
function changeSmiley(smiley) {
    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerText = smiley;

}
// checks if game is over and if ist a win or lose and presents it
function checkGameOver(i, j) {
    var boardSize = gLevel.SIZE ** 2;
    var elModal = document.querySelector('.modal')
    if ((gBoard[i][j].isMine) && (!gBoard[i][j].isMarked)) {

        gGame.isOn = false;
        changeSmiley(LOSE);
        elModal.innerText = "GAME OVER";
        elModal.style.display = 'block';
        stopTimer();
    }
    if ((gGame.shownCount + gCountMineFlag === boardSize) && (gCountMineFlag >= gFlagLimit)) {// if flags are only on mines and all nums are shown
        gGame.isOn = false;
        changeSmiley(WIN);
        elModal.innerText = "YOU WON";
        elModal.style.display = 'block';
        stopTimer();
    }

}




// updates the number of lives on the screen
function UpdateNumOfLives(numOfLives) {
    var elnumLives = document.querySelector('.num-lives');
    elnumLives.innerText = numOfLives;
    elnumLives.innerText += LIFE;

}


// mouse right click execution
function mouseClick(event, elCell, i, j) {
    gMouseClick = event.button;
    document.addEventListener('contextmenu', function (event) {
        gMouseClick = 2;
        event.preventDefault();
    }, false);
    if (gBoard[i][j].isMarked) {
        removeFlag(elCell, i, j);
    } else if ((gMouseClick === 2) && (!gBoard[i][j].isShown)) {
        cellMarked(elCell, i, j);
    }

}
function getClassName(location) {//gets a location in an object {i,j}
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;//returns cell class as a string
}


//counts cells marked with a flag
function cellMarked(elCell, i, j) {
    if (gTime === 0) {
        startTimer();
    }
    elCell.style.background = 'lightblue';
    elCell.innerText = FLAG;
    gBoard[i][j].isMarked = true;
    gGame.markedCount++;
    if (gBoard[i][j].isMine) {
        gCountMineFlag = gCountMineFlag + 1;
    }

    gTime = 10;
    checkGameOver(i, j);
}
//remove flag on mouse right click
function removeFlag(elCell, i, j) {
    elCell.style.background = 'antiquewhite';
    elCell.innerText = ' ';
    gBoard[i][j].isMarked = false;
    if (gBoard[i][j].isMine) {
        gCountMineFlag = gCountMineFlag - 1;
    }
    gGame.markedCount = gGame.markedCount - 1;
}


function buildBoard() {
    var board = createMat(gLevel.SIZE,gLevel.SIZE)
    // Puts object is all cells
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            //creates an object
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };

            board[i][j] = cell;// every cell has an object called cell
        }
    }
    return board;
}


// Render the board to an HTML table
function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];

            var cellClass = getClassName({ i: i, j: j })

            strHTML += `\t<td onmousedown="mouseClick(event, this,  ${i} , ${j})" id="${cellClass}" data-i="${i}" data-j="${j}" 
            class="cell ${cellClass}" onclick="cellClicked(this , ${i} , ${j})" >\n`;
            strHTML += ' ';


            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}


function cellClicked(elCell, i, j) {

    if (gMouseClick === 0) {

        if ((gTime === 0) && (gBoard[i][j].isMine)) {//if its the first click it's a mine
            removeMines(gBoard);
            putMinesOnBoard();
            storeMineCount(gBoard);
        } else if (gTime === 0) {
            startTimer();
        }

        elCell.style.background = 'grey';
        renderCell({ i, j }, gBoard[i][j].minesAroundCount);
        expandShown(gBoard, elCell, i, j);
        gBoard[i][j].isShown = true;
        gGame.shownCount = gGame.shownCount + 1;

        if ((gBoard[i][j].isMine) && (gLives === 0)) {// if it's a mine and no lives left
            showAllMines();
            checkGameOver(i, j);
            return;
        } else if (gBoard[i][j].isMine) { //if it's a mine
            gLives = gLives - 1;
            UpdateNumOfLives(gLives);
            return;
        }

    } else if (gMouseClick === 2) {
        return;
    }
    checkGameOver(i, j);
    gTime = 10;
}
// shows all the mines when game over
function showAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                renderCell({ i, j }, gBoard[i][j].minesAroundCount);
                var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
                elCell.style.background = 'grey';
            }
        }
    }

}

function expandShown(board, elCell, cellI, cellJ) {

    if (board[cellI][cellJ].minesAroundCount !== 0) return;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue; //don't bypass the board
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue; //don't bypass the board
            if (board[i][j].isShown) continue;
            renderCell({ i, j }, board[i][j].minesAroundCount);//show the number on the board
            var elCellInput = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
            elCellInput.style.background = 'grey';//make the cell grey
            board[i][j].isShown = true;
            gGame.shownCount = gGame.shownCount + 1;
        }
    }

}

// function  gets 1 cell and the board check all the cell's nieghbors--returns how many neighbors
function setMinesNegsCount(cellI, cellJ, board) {
    // debugger;
    var mineCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue; //don't bypass the board
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue; //don't bypass the board
            if (i === cellI && j === cellJ) continue;// don't count the cell itself
            if (board[i][j].isMine) mineCount++;
        }
    }
    if (gBoard[cellI][cellJ].isMine) {
        gBoard[cellI][cellJ].minesAroundCount = MINE; // if the cell is a mine don't put a number-put MINE.

    } else {
        gBoard[cellI][cellJ].minesAroundCount = mineCount;
    }

    return mineCount;
}



function renderCell(pos, value) {//gets object
    var elCell = document.querySelector(`[data-i="${pos.i}"][data-j="${pos.j}"]`);
    elCell.innerText = value;
}
//stores how many Mine negs every cell has
function storeMineCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            setMinesNegsCount(i, j, board);
        }
    }

}

function randMine() {
    var idxI = getRandomInt(0, gBoard.length);
    var idxJ = getRandomInt(0, gBoard.length);
    gBoard[idxI][idxJ].isMine = true;
    gBoard[idxI][idxJ].minesAroundCount = MINE;

}

function putMinesOnBoard() {
    for (var i = 0; i < gLevel.MINES; i++) {
        randMine();
    }
}

function removeMines(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine) {
                board[i][j].isMine = false;
                board[i][j].minesAroundCount = 0;

            }
        }
    }



}

function startTimer() {//first onclick 1
    gTimeStart = Date.now();
    gTimeInterval = setInterval(timeCycle, 1);
}
// The ongoing timer
function timeCycle() {
    gTimeEnd = Date.now();
    var msTimeDiff = gTimeEnd - gTimeStart;
    gGame.secsPassed = msTimeDiff;
    var timeDiffStr = new Date(msTimeDiff).toISOString().slice(17, -1);
    document.querySelector('.stopwatch').innerHTML = timeDiffStr;
}

function stopTimer() {
    clearInterval(gTimeInterval);
    var msTimeDiff = gTimeEnd - gTimeStart;
    var timeDiffStr = new Date(msTimeDiff).toISOString().slice(17, -1);
    var finishTime = document.querySelector('.stopwatch');
    finishTime.innerHTML = timeDiffStr;

}




