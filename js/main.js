'use strict';

var EMPTY = ' ';
var MINE = '💣';
var FLAG = '🚩';
var LIFE = '❤️';
var NORMAL = '😀';
var LOSE = '🤯';
var WIN = '😎';
var LIGHTBULBOFF_IMG =
    '<img  class="light-bulb-img" src="img/lightBulbOff.png" />';
var LIGHTBULBON_IMG =
    '<img class="light-bulb-img" src="img/lightBulbOn.png" />';
var gBoard;
var gTimeStart;
var gTimeEnd;
var gTimeInterval;
var gTime = 0;
var gMouseClick;
var gLives = 1;
var gCountMineFlag = 0;
var gHint = false;
var gHintCount = 3;
var gCountSafeClicks = 3;
var gCountShownSafeCells = 0;
var gLevel = {
    SIZE: 4,
    MINES: 2,
};
var gFlagLimit = gLevel.MINES - gLives;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
};

function initGame() {
    play();
}

// changes the level of the game
function gameLevel(btn) {
    var elModal = document.querySelector('.modal');
    var elCentered = document.querySelector('.centered');
    if (btn.classList.contains('beginner')) {
        changeSmiley(NORMAL);
        gLevel.SIZE = 4;
        gLevel.MINES = 2;
        gFlagLimit = gLevel.MINES - gLives;
        elCentered.style.marginLeft = '43%';
        elModal.style.display = 'none';
        play();
    }
    if (btn.classList.contains('medium')) {
        changeSmiley(NORMAL);
        gLevel.MINES = 12;
        elCentered.style.marginLeft = '36%';
        elModal.style.display = 'none';
        gLevel.SIZE = 8;
        play();
    }
    if (btn.classList.contains('expert')) {
        changeSmiley(NORMAL);
        gLevel.MINES = 30;
        elCentered.style.marginLeft = '35.5%';
        elModal.style.display = 'none';
        gLevel.SIZE = 12;
        play();
    }
}
function play() {
    var elStopWatch = document.querySelector('.stopwatch');
    if (gTimeInterval) {
        clearInterval(gTimeInterval);
        elStopWatch.innerText = '00:00';
    }
    if (gLevel.SIZE === 8 || gLevel.SIZE === 12) {
        gLives = 3;
        UpdateNumOfLives(gLives);
    } else {
        gLives = 1;
        UpdateNumOfLives(gLives);
    }
    gTime = 0;
    gTimeInterval = null;
    gFlagLimit = gLevel.MINES - gLives;
    changeSmiley(NORMAL);
    UpdateNumOfLives(gLives);
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
    restartGetAHint();
    gCountSafeClicks = 3;
    renderInitalSafeClick()
    gCountShownSafeCells = 0
}
//restart function on smiley
function restartGame() {
    changeSmiley(NORMAL);
    if (gLevel.SIZE === 8 || gLevel.SIZE === 12) {
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

function restartGetAHint() {
    gHintCount = 3;
    var elLightBulb1 = document.querySelector('.light-bulb1');
    var elLightBulb2 = document.querySelector('.light-bulb2');
    var elLightBulb3 = document.querySelector('.light-bulb3');
    elLightBulb1.innerHTML = LIGHTBULBOFF_IMG;
    elLightBulb2.innerHTML = LIGHTBULBOFF_IMG;
    elLightBulb3.innerHTML = LIGHTBULBOFF_IMG;
}

function getAHint(lightBulb) {
    if (gHintCount === 0) return;
    lightBulb.innerHTML = LIGHTBULBON_IMG;
    gHint = true;
    gHintCount--;
}

function safeClick(btn) {
    if (gCountSafeClicks === 0) {
        return;
    }
    var safeCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if ((!gBoard[i][j].isMine) && (!gBoard[i][j].isShown)) {
                safeCells.push({ i, j }); //pushes the cell object to the new array
            }
        }
    }
    var randCell = getRandomInt(0, safeCells.length);
    var idxI = safeCells[randCell].i;
    var idxJ = safeCells[randCell].j;
    var elCell = document.querySelector(`[data-i="${idxI}"][data-j="${idxJ}"]`);
    elCell.style.backgroundColor = 'lightblue';
    gCountSafeClicks--;
    var elNumOfClicks = document.querySelector('.numberof-clicks');
    elNumOfClicks.innerText = gCountSafeClicks;
    setTimeout(function () {
        unMarkRandCell(idxI, idxJ)
    }, 3000);

}
//Umarks cell after safeClick
function unMarkRandCell(i, j) {
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
    elCell.style.backgroundColor = 'antiquewhite';
}

function renderInitalSafeClick() {
    var elNumOfClicks = document.querySelector('.numberof-clicks');
    elNumOfClicks.innerText = gCountSafeClicks;
}

//exposes the cells in hint
function exposeCells(board, elCell, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue; //don't bypass the board
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue; //don't bypass the board
            if (board[i][j].isShown) continue;
            if (board[i][j].isMarked) continue;
            renderCell({ i, j }, board[i][j].minesAroundCount); //show the number on the board
            var elCellInput = document.querySelector(
                `[data-i="${i}"][data-j="${j}"]`
            );
            elCellInput.style.background = 'grey'; //make the cell grey
        }
    }
}
//closes the cells after exposing them in hint
function closeCells(board, elCell, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue; //don't bypass the board
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue; //don't bypass the board
            if (board[i][j].isShown) continue;
            if (board[i][j].isMarked) continue;
            renderCell({ i, j }, ' '); //hide the number on the board
            var elCellInput = document.querySelector(
                `[data-i="${i}"][data-j="${j}"]`
            );
            elCellInput.style.background = 'antiquewhite'; //make the cell grey
        }
    }
    gHint = false;
}

// checks if game is over and if it's a win or lose and presents it
function checkGameOver(i, j) {
    var elModal = document.querySelector('.modal');
    if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
        gGame.isOn = false;
        changeSmiley(LOSE);
        elModal.innerText = 'GAME OVER';
        elModal.style.display = 'block';
        stopTimer();
    }
    if (((gCountMineFlag - gLives) === gFlagLimit) && (checkAllShownSafeCells())) {

        gGame.isOn = false;
        changeSmiley(WIN);
        elModal.innerText = 'YOU WON';
        elModal.style.display = 'block';
        stopTimer();
    }
}


// checks if all cells that are not mines are shown
function checkAllShownSafeCells() {
    var countShownSafeCells = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isMine) {
                if (gBoard[i][j].isShown)
                    countShownSafeCells++;

            }
        }
    }

    return (countShownSafeCells === (gBoard.length ** 2) - gLevel.MINES);

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
    document.addEventListener(
        'contextmenu',
        function (event) {
            gMouseClick = 2;
            event.preventDefault();
        },
        false
    );
    if (gBoard[i][j].isMarked) {
        removeFlag(elCell, i, j);
    } else if (gMouseClick === 2 && !gBoard[i][j].isShown) {
        cellMarked(elCell, i, j);
    }
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
    var board = createMat(gLevel.SIZE, gLevel.SIZE);
    // Puts object is all cells
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            //creates an object
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            };

            board[i][j] = cell; // every cell has an object called cell
        }
    }
    return board;
}

function cellClicked(elCell, i, j) {

    if (gMouseClick === 0) {
        if (gTime === 0 && gBoard[i][j].isMine) {
            //if its the first click and it's a mine
            removeMines(gBoard);
            putMinesOnBoard();
            storeMineCount(gBoard);
            startTimer();
        } else if (gTime === 0) {
            //if its the first click
            startTimer();
        }
        if (!gHint) {
            gBoard[i][j].isShown = true;// turn isShown on this cell to true
            gGame.shownCount = gGame.shownCount + 1;// add to the shownCount of the game
            elCell.style.background = 'grey';// turn cell grey
            renderCell({ i, j }, gBoard[i][j].minesAroundCount);// show th number
            expandShown(gBoard, elCell, i, j);// if the number is 0- show the negs
            setTimeout(function () {
                elCell.style.background = 'grey';// turn cell grey again incase safeCLick
            }, 3000);



            if (!gBoard[i][j].isMine) {

                gCountShownSafeCells++;
                checkGameOver(i, j);

            } else if (gBoard[i][j].isMine && gLives === 0) {// if the cell is a mine and no lives are left

                showAllMines();
                checkGameOver(i, j);
                return;
            } else if (gBoard[i][j].isMine) {// if the cell is a mine and there are still lives

                gLives = gLives - 1;//---------
                UpdateNumOfLives(gLives);
                if ((gCountMineFlag - gLives) === gFlagLimit) {
                    checkGameOver(i, j);
                }
                return;
            }
        } else {

            exposeCells(gBoard, elCell, i, j);
            setTimeout(function () {
                closeCells(gBoard, elCell, i, j);
            }, 1000);

        }
    } else if (gMouseClick === 2) {
        return;
    }

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
            renderCell({ i, j }, board[i][j].minesAroundCount); //show the number on the board
            var elCellInput = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
            elCellInput.style.background = 'grey'; //make the cell grey
            board[i][j].isShown = true;
            gGame.shownCount = gGame.shownCount + 1;
            expandShown(gBoard, elCell, i, j);
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
            if (i === cellI && j === cellJ) continue; // don't count the cell itself
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

//stores how many Mine negs every cell has
function storeMineCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            setMinesNegsCount(i, j, board);
        }
    }
}

function randMine() {
    var mineArray = getEmptyArray(gBoard);
    var idx = getRandomInt(0, mineArray.length);
    var idxI = mineArray[idx].i
    var idxJ = mineArray[idx].j
    gBoard[idxI][idxJ].isMine = true;
    gBoard[idxI][idxJ].minesAroundCount = MINE;
}


function putMinesOnBoard() {
    for (var i = 0; i < gLevel.MINES; i++) {
        randMine();
    }
}
//removes the mines if the first click is a mine
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





