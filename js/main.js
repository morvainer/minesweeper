'use strict';

var SIZE = 4;
var EMPTY = ' ';
var MINE = '💣';
var FLAG = '🚩';
var gBoard;
var gTimeStart;
var gTimeEnd;
var gTimeInterval;
var gTime = 0;
var gMouseClick;
// var gBoard = buildBoard();
// renderBoard(gBoard);



function initGame() {
    gBoard = buildBoard();
    renderBoard(gBoard);
    randMine();
    randMine();
    storeMineCount(gBoard);


}

function mouseClick(event, elCell, i, j) {
    gMouseClick = event.button;

    console.log(gMouseClick);

    document.addEventListener('contextmenu', function (event) {
        gMouseClick = 2;
        // cellClicked(elCell, i, j);
        // alert("You've tried to open context menu"); 
        event.preventDefault();
    }, false);
    // console.log('mouse click event function');
    // if (gMouseClick === 2) {
    //     flag(elCell, i, j);
    // }
    if(gBoard[i][j].isMarked){
        removeFlag(elCell, i, j);
    }else if((gMouseClick === 2)&&(!gBoard[i][j].isShown)){
        cellMarked(elCell, i, j);
    }

}
function getClassName(location) {//gets a location in an object {i,j}
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;//returns cell class as a string
}

function cellMarked(elCell, i, j) {
    // alert('put a flag here');
    if(gTime===0){
        startTimer();
    }
    elCell.style.background = 'lightblue';
    elCell.innerText = FLAG;
    gBoard[i][j].isMarked = true;
    // console.log('isMarked in cell',i,j,' is:',  gBoard[i][j].isMarked);
    gTime=10;
}

function removeFlag(elCell, i, j){
    // console.log('remove flag');
    elCell.style.background = 'white';
    elCell.innerText = ' ';
    gBoard[i][j].isMarked = false;

}


function buildBoard() {
    // debugger;
    // Create the Matrix
    var board = createMat(SIZE, SIZE)


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

            // Add created cell to The game board
            board[i][j] = cell;// every cell has an object called cell
        }
    }


    console.log(board);
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

    // console.log('strHTML is:');
    console.log(strHTML);
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}


function placeMinesManually() {
    elCell1 = document.querySelector('.cell-0-0');
    elCell1.innerText = MINE_IMG;
}

function cellClicked(elCell, i, j) {
    console.log('the mouse click is', gMouseClick);
    if (gMouseClick === 0) {

        // gTime = 0;

        if (gTime === 0) {
            startTimer();
        } else if ((gTime === 0) && (gBoard[i][j].isMine)) {
            stopTimer();
        } else if (gBoard[i][j].isMine) {
            stopTimer();
        }
        elCell.style.background = 'grey';
        renderCell({ i, j }, gBoard[i][j].minesAroundCount);
        gBoard[i][j].isShown = true;
        // console.log('isShown is:', gBoard[i][j].isShown );
        // console.log('time is:', gTime);
        // console.log('gTimeInterval is:', gTimeInterval);
        gTime = 10;

    } else if (gMouseClick === 2) {
        alert('rightClick')
        console.log('right click');
    }



}

// function  gets 1 cell and the board check all the cell's nieghbors--returns how many neighbors
function setMinesNegsCount(cellI, cellJ, mat) {
    // debugger;
    var mineCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue; //don't bypass the board
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue; //don't bypass the board
            if (i === cellI && j === cellJ) continue;// don't count the cell itself
            if (mat[i][j].isMine) mineCount++;

        }
    }

    if (gBoard[cellI][cellJ].isMine) {
        gBoard[cellI][cellJ].minesAroundCount = MINE; // if the cell is a mine don't put a number-put MINE.

    } else {
        gBoard[cellI][cellJ].minesAroundCount = mineCount;
    }

    // if(!gBoard[cellI][cellJ].isMine){
    // renderCell({ i: cellI, j: cellJ }, mineCount)// מדפיס על התא את מספר הפצצות
    // }// אפשר להוסיף פה בהמשך אם המספר אפס שהתא יהיה ריק

    return mineCount;
}



function renderCell(pos, value) {//gets object
    var elCell = document.querySelector(`[data-i="${pos.i}"][data-j="${pos.j}"]`);
    elCell.innerText = value;
}

function storeMineCount(mat) {
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat.length; j++) {
            setMinesNegsCount(i, j, mat);
        }
    }

}

function randMine() {
    var idxI = getRandomInt(0, gBoard.length);
    var idxJ = getRandomInt(0, gBoard.length);
    gBoard[idxI][idxJ].isMine = true;

}

function startTimer() {//first onclick 1
    // gTimeInterval=null;
    gTimeStart = Date.now();
    gTimeInterval = setInterval(timeCycle, 1);
    console.log('gTimeInterval start is:', gTimeInterval);
}

function timeCycle() {
    gTimeEnd = Date.now();
    var msTimeDiff = gTimeEnd - gTimeStart;
    var timeDiffStr = new Date(msTimeDiff).toISOString().slice(17, -1);
    document.querySelector('.stopwatch').innerHTML = timeDiffStr;
}

function stopTimer() {
    console.log('gTimeInterval end is:', gTimeInterval);
    clearInterval(gTimeInterval);
    // gTimeEnd = Date.now();
    var msTimeDiff = gTimeEnd - gTimeStart;
    var timeDiffStr = new Date(msTimeDiff).toISOString().slice(17, -1);
    // var timeDiffStr = new Date(msTimeDiff).toISOString().slice(17, -1);
    // var finishTime = document.querySelector('.timer').innerHTML;
    var finishTime = document.querySelector('.stopwatch');
    finishTime.innerHTML = timeDiffStr;

}




