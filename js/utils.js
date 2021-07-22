

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
//countNegs//from GOL and Chess
function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (mat[i][j] === LIFE || mat[i][j] === SUPER_LIFE) neighborsCount++;
            // if (mat[i][j]) neighborsCount++;
        }
    }
    return neighborsCount;
}  
//from GOL
function copyMat(mat) {
    var newMat = [];
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = [];
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j];
        }
    }
    return newMat;
}
//used in pacman
function printMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
      strHTML += '<tr>';
      for (var j = 0; j < mat[0].length; j++) {
        var cell = mat[i][j];
        var className = 'cell cell' + i + '-' + j;
        strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
      }
      strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
  }
//fron GOL
  function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var className = currCell ? 'occupied' : ''
            // strHTML += '\t<td class="' + className + '">' + currCell + '</td>\n'
            strHTML += `<td data-i="${i}" data-j="${j}" onclick="cellClicked(this,${i},${j})" class="${className}">${currCell}</td>`
        }
        strHTML += '</tr>\n'
    }
    console.log(strHTML);
    var elTable = document.querySelector('.board')
    elTable.innerHTML = strHTML

}
//used in pacman
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
// from touchNums
function mixArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}


//from touch nums
var time1 = Date.now();
var myTime;
function startTimer() {//first onclick 1
    time1 = Date.now();
    myTime = setInterval(timeCycle, 1);
}
function timeCycle() {
    var time2 = Date.now();
    var msTimeDiff = time2 - time1;
    var timeDiffStr = new Date(msTimeDiff).toISOString().slice(17, -1);
    document.querySelector('.stopwatch').innerHTML = timeDiffStr;
}
function stopTimer() {
    clearInterval(myTime);
    var finishTime = document.querySelector('.stopwatch').innerHTML;
    alert('Done at: '+finishTime);
}


  //from ball game
  function renderCell3(location, value) {
	var cellSelector = '.' + getClassName(location)// Returns the class name for a specific cell//get location in coordinates//gets object location{i, j}
	var elCell = document.querySelector(cellSelector);//gets the class
	elCell.innerHTML = value;//puts the value in the class
}
//from balls and pacman//gets location as object{i, j}
  function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
  }
  
  function getEmptyArray(board) {
    var emptyArray = [];
    for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board.length; j++) {
        if ((gBoard[i][j] !== FOOD) && (gBoard[i][j] !== EMPTY)) {
          continue;
        }
        // var currCell = gBoard[i][j];
        var currCell = { i, j }
        emptyArray.push(currCell);
  
      }
    }
    return emptyArray;
  }
//from GOL//הכי טוב
  function renderCell2(pos, value) {
    var elCell = document.querySelector(`[data-i="${pos.i}"][data-j="${pos.j}"]`)
    elCell.innerText = value
}
//create board from GOL
function createBoard() {
    var board = [];
    for (var i = 0; i < 8; i++) {
        board.push([])
        for (var j = 0; j < 8; j++) {
            board[i][j] = (Math.random() > 0.5) ? LIFE : ''
        }
    }
    return board;
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

function isEmptyCell(coord) {
    if(gBoard[coord.i][coord.j] === ' ');
     return true;
}

//Another timer
//from touch nums
function timerStart() {
    gStartTime = Date.now();
    console.log(gStartTime);
    // gStartTime=Date.now(gStartTime);
    // console.log(gStartTime);


}
function timerEnd() {
    gEndTime = Date.now();
    // gEndTime=Date.now(gEndTime);
    var timePassed=gEndTime-gStartTime;
    var gElTimer = document.querySelector('.timer');
    gElTimer.innerText= timePassed/1000 +' seconds have passed';
}
//get random number from array
function getRandNumber() {
    var randomIdx = getRandomInt(0, gNums.length);
    var randomNum = gNums[randomIdx];
    gNums.splice(randomIdx, 1);
    return randomNum;
}