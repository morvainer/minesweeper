

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
 

//create a new empty matrix
function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}


// Render the board to an HTML table
function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];

            var cellClass = getClassName({ i: i, j: j });

            strHTML += `\t<td onmousedown="mouseClick(event, this,  ${i} , ${j})" id="${cellClass}" data-i="${i}" data-j="${j}" 
            class="cell cell ${cellClass}" onclick="cellClicked(this , ${i} , ${j})" >\n`;
            strHTML += ' ';

            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}




function renderCell(pos, value) {
    //gets object
    var elCell = document.querySelector(`[data-i="${pos.i}"][data-j="${pos.j}"]`);
    elCell.innerText = value;
}

function getEmptyArray(board) {
    var emptyArray = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (!gBoard[i][j].isMine) {
                var currCell = { i, j }
                emptyArray.push(currCell);
            }
        }
    }
    return emptyArray;
}

function startTimer() {
    //first onclick 1
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


function getClassName(location) {
    //gets a location in an object {i,j}
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass; //returns cell class as a string
}