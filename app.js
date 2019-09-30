console.log('connected');

var board = {};		// creating a dictionary in javascript

var score = 0;
scoreDiv = document.querySelector('#score');
console.log(score);

// function vars
var tileKey;
var creatBoard;
var updateBoard;
var getEmptyTiles;
var addOneTile;
var combineNumbers;
var getNumbersInRow;
var getNumbersInColumn;
var setNumbersInRow;
var setNumbersInColumn;
var combineRowLeft;
var combineColumnUp;
var combineColumnDown;
var combineDirection;
var combineRowRight;
var didBoardChange;


// created functions
// Written out functions

tileKey = function(column, row) {			// puts the tile class on every box in the grid system
	return 'tile' + column + '-' + row;
}


creatBoard = function(){
	var boardDiv = document.querySelector('#board');	// query the board div from html

	for (var row = 0; row < 4; row++ ) {				// loop to create 4 rows and you nest the next loop
		var rowDiv = document.createElement('div');
		rowDiv.classList.add('row');
		boardDiv.appendChild(rowDiv);

		for (var column = 0; column < 4; column++ ) {	// this loop creates each individual box or column
			var tileDiv = document.createElement('div');
			tileDiv.classList.add('tile');
			tileDiv.id = tileKey(column, row);
			rowDiv.appendChild(tileDiv);
		}
	}
};


updateBoard = function() {
	for (var row = 0; row < 4; row++ ) {
		for (var column = 0; column < 4; column++ ) {
			key = tileKey(column, row);
			var tileDiv = document.querySelector('#' + key);
			var retrieved = board[key];
			tileDiv.className = 'tile';
			if(retrieved){
				tileDiv.innerHTML = retrieved;
				tileDiv.classList.add('tile-' + retrieved);
				
			} else{
				tileDiv.innerHTML = ''
			}
			
		}
	}
	scoreDiv.innerHTML = score;
};

getEmptyTiles = function(){
	var empty = [];
	for (var row = 0; row < 4; row++ ) {
		for (var column = 0; column < 4; column++ ) {
			var key = tileKey(column, row);
			var value = board[key];
			if( !value){
				empty.push(key)
			}
		}
	}
	return empty;
}


addOneTile = function() {
	var emptyTiles = getEmptyTiles();
	var randomIndex = Math.floor(Math.random() * emptyTiles.length);
	var randomEmptyTile = emptyTiles[randomIndex];

	board[randomEmptyTile] = Math.random() < 0.9 ? 2 : 4;
};


combineNumbers = function( numbers ){
	var newNumbers = [];
	
	while( numbers.length > 0){
		if (numbers.length == 1){
			newNumbers.push(numbers[0])
			numbers.splice(0, 1);
		} else if( numbers[0] == numbers[1]){
			sum = numbers[0] + numbers[1]
			newNumbers.push(sum);
			score += sum;
			console.log(score);
			numbers.splice(0, 2);
		}else{
			newNumbers.push(numbers[0]);
			numbers.splice(0, 1);
		}
	}

	while(newNumbers.length < 4){
		newNumbers.push(undefined);
	}

	return newNumbers;
}


getNumbersInRow = function(row) {
	var nums = []
	for(var col = 0; col < 4; col++){
		var key = tileKey(col, row);
		var value = board[key];
		if (value){
			nums.push(value);
		}
	}
	return nums;
}

getNumbersInColumn = function(col) {
	var nums = []
	for(var row = 0; row < 4; row++){
		var key = tileKey(col, row);
		var value = board[key];
		if (value){
			nums.push(value);
		}
	}
	return nums;
}


setNumbersInRow = function(row, nums){
	for(var col = 0; col < 4; col++){
		var key = tileKey(col, row);
		board[key] = nums[col];
	}
};

setNumbersInColumn = function(col, nums){
	for(var row = 0; row < 4; row++){
		var key = tileKey(col, row);
		board[key] = nums[row];
	}
};


combineRowLeft = function( row ){
	var nums = getNumbersInRow(row);
	var newNums = combineNumbers(nums);
	setNumbersInRow(row, newNums);
}


combineColumnUp = function( col ){
	var nums = getNumbersInColumn(col);
	var newNums = combineNumbers(nums);
	setNumbersInColumn(col, newNums);
}


combineRowRight = function(row){
	var nums = getNumbersInRow(row);
	nums = nums.reverse();
	var newNums = combineNumbers(nums);
	newNums = newNums.reverse();
	setNumbersInRow(row, newNums);
};


combineColumnDown = function(col){
	var nums = getNumbersInColumn(col);
	nums = nums.reverse();
	var newNums = combineNumbers(nums);
	newNums = newNums.reverse();
	setNumbersInColumn(col, newNums);
};


combineDirection = function (direction) {
	// makes real copy of board not a pointer to the board;
	var oldBoard = Object.assign({}, board);

	for (var n = 0; n < 4; n += 1) {
	    if (direction == "left") {
	      combineRowLeft(n);
	    } else if (direction == "right") {
	      combineRowRight(n);
	    } else if (direction == "up") {
	      combineColumnUp(n);
	    } else if (direction == "down") {
	      combineColumnDown(n);
	    }
  }

  	if( didBoardChange(oldBoard)){
		addOneTile();
  		updateBoard();
  	}
};

didBoardChange = function(oldBoard){
	for( var row = 0; row < 4; row++){
		for( var column = 0; column <4; column++){
			var key = tileKey(column, row);
			if (board[key] != oldBoard[key]){
				return true;
			}
		}
	}
	return false;
}


document.onkeydown = function (e) {
  // console.log("key pressed", e);
  if (e.which == 37) {
    combineDirection("left");
  } else if (e.which == 39) {
    combineDirection("right");
  } else if (e.which == 40) {
    combineDirection("down");
  } else if (e.which == 38) {
    combineDirection("up");
  }
};


// High score work
var button = document.querySelector('#get-score');
button.onclick = function(){
	getHighScores();
}


var getHighScores = function (){
	fetch('https://highscoreapi.herokuapp.com/scores').then(function( response ){
		response.json().then(function( scores ){		// this is the data that comes back.. in this situation its a list of scores.
			console.log('Data from scores: ', scores);
			var list = document.querySelector('#high-scores');
			list.innerHTML = '';
			scores.forEach(function(score){
			var item = document.createElement('li');
			item.innerHTML = score.name + ': ' + score.score;
			list.appendChild(item);
			});
		})
	})

};

var submitButton = document.querySelector('#submit-score')
submitButton.onclick = function (){
	submitScore();
}

var submitScore = function(){
	var initials = prompt('Enter your inititals');
	fetch('https://highscoreapi.herokuapp.com/scores', {
		method: 'POST',
		body: JSON.stringify({
			score: score,
			name: initials
		}),
		headers: {
			'content-type': 'application/json'
		}
	});
}


var startNewGame = function(){
	board = {};
	score = 0;
	addOneTile();
	addOneTile();
	updateBoard();
}

var newGameButton = document.querySelector('#new-game');
newGameButton.onclick = function(){
	startNewGame();

}

creatBoard();
startNewGame();


