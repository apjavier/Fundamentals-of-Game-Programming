
// constants
const colors = ["red", "white"];

// globals
var turn = 0;

var board = [
  [0, 0, 0, 0, 0, 0, 0], //bottom row, player 0
  [0, 0, 0, 0, 0, 0, 0]  //top row, player 1
]

function displayTurn() {
  displayMessage("It is <div class ='piece " + colors[turn] +"'></div>'s turn");

  document.getElementById('scoreDisplay-0').innerHTML ="  Red: " + board[0][6] + " points";
  document.getElementById('scoreDisplay-1').innerHTML ="White: " + board[1][6] + " points";
}

function displayMessage(message) {
  document.getElementById('ui').innerHTML = message;
}

function startup() {
  turn = 0;
  removePieces(document.getElementById('score-0'));
  removePieces(document.getElementById('score-1'));

    for(var i = 0; i < 12; i++){
      var hole = document.getElementById("hole-" + i);
      removePieces(hole);

      for(var p = 0; p < 4; p++){
        var piece = document.createElement('div');
        piece.classList.add("piece");
        hole.appendChild(piece);
      }
    }

    for(var i = 0; i < 2; i++){
      for(var j = 0; j < 6; j++){
        board[i][j] = 4;
      }
      board[i][6] = 0;
    }
    displayTurn();
}

function removePieces(hole){
  //remove all pieces from this hole
  while (hole.firstChild) {
    hole.removeChild(hole.firstChild);
  }
}

function movePieces(holeIndex) {
  //index for data manipulation
  var startIndex = holeIndex;
  //variable to handle row changes
  var temp = turn;

  //if player clicked on the wrong hole
  if(turn === 0 && holeIndex > 5){
    displayMessage("Invalid Move - You can only move pieces from your row");
    setTimeout(displayTurn, 2000);
    return;
  }
  else if(turn === 1 && holeIndex < 6){
    displayMessage("Invalid Move - You can only move pieces from your row");
    setTimeout(displayTurn, 2000);
    return;
  }

  //chose top row reduce index
  if(holeIndex > 5)
  {
    startIndex -= 6;
  }

  //if no pieces are in the hole clicked on
  if(board[turn][startIndex] === 0){
    displayMessage("Invalid Move - There are no pieces in that hole");
    setTimeout(displayTurn, 2000);
    return;
  }
  else{
    var hole = document.getElementById("hole-" + holeIndex);
    removePieces(hole);

    //grab all the pieces
    var pickup = board[turn][startIndex];
    //take pieces out of data board
    board[turn][startIndex] = 0;

    //while we still have pieces to move
    while(pickup > 0){
      //move to the next hole
      startIndex++;
      holeIndex++;
      var piece = document.createElement('div');
      piece.classList.add("piece");

      //if not dropping a piece in score hole
      if(startIndex < 6){
        document.getElementById("hole-" + holeIndex).appendChild(piece);
        board[temp][startIndex] += 1;
        pickup--;
      }
      //if dropping a piece in or skipping a score hole, startIndex = 6
      else{
        //only place in a score hole if it is that players turn
        if((turn === 0) && (holeIndex === 6)){
          board[0][6] += 1;
          startIndex = -1;
          holeIndex = 5;
          document.getElementById("score-" + turn).appendChild(piece);
          pickup--;

          //take another turn
          if(pickup === 0){
            displayTurn();
            checkForGameOver();
            return;
          }
        }
        else if(turn === 1 && holeIndex === 12){
          board[1][6] += 1;
          startIndex = -1;
          holeIndex = -1;
          document.getElementById("score-" + turn).appendChild(piece);
          pickup--;

          //take another turn
          if(pickup === 0){
            displayTurn();
            checkForGameOver();
            return;
          }
        }
        //you are moveing over the score hole for the other player
        else if(turn === 0 && holeIndex === 12){
          startIndex = 0;
          holeIndex = 0;
          board[0][0] += 1;
          document.getElementById("hole-0").appendChild(piece);
          pickup--;
        }
        else if(turn === 1 && holeIndex === 6){
          startIndex = 0;
          holeIndex = 6;
          board[1][0] += 1;
          document.getElementById("hole-6").appendChild(piece);
          pickup--;
        }
        //switch to the other row for data board
        temp = (temp + 1) % 2;
      }

    }
  }
  checkForStealPieces(startIndex, temp, holeIndex);
  checkForGameOver();

  turn = (turn + 1) % 2;
  displayTurn();
}

function checkForStealPieces(startIndex, temp, holeIndex){
  //if last dropped piece is in an empty hole and across from a non empty hole, steal those pieces
  if(board[temp][startIndex] === 1){
    var steal = 0;
    var stealHole = undefined;
    switch(holeIndex){
      case 0:
        if(board[1][5] !== 0){
          stealHole = document.getElementById("hole-11");
          steal = board[1][5];
          board[1][5] = 0;
        }
        break;
      case 1:
        if(board[1][4] !== 0){
          stealHole = document.getElementById("hole-10");
          steal = board[1][4];
          board[1][4] = 0;
        }
        break;
      case 2:
        if(board[1][3] !== 0){
          stealHole = document.getElementById("hole-9");
          steal = board[1][3];
          board[1][3] = 0;
        }
        break;
      case 3:
        if(board[1][2] !== 0){
          stealHole = document.getElementById("hole-8");
          steal = board[1][2];
          board[1][2] = 0;
        }
        break;
      case 4:
        if(board[1][1] !== 0){
          stealHole = document.getElementById("hole-7");
          steal = board[1][1];
          board[1][1] = 0;
        }
        break;
      case 5:
        if(board[1][0] !== 0){
          stealHole = document.getElementById("hole-6");
          steal = board[1][0];
          board[1][0] = 0;
        }
        break;
      case 6:
        if(board[0][5] !== 0){
          stealHole = document.getElementById("hole-5");
          steal = board[0][5];
          board[0][5] = 0;
        }
        break;
      case 7:
        if(board[0][4] !== 0){
          stealHole = document.getElementById("hole-4");
          steal = board[0][4];
          board[0][4] = 0;
        }
        break;
      case 8:
        if(board[0][3] !== 0){
          stealHole = document.getElementById("hole-3");
          steal = board[0][3];
          board[0][3] = 0;
        }
        break;
      case 9:
        if(board[0][2] !== 0){
          stealHole = document.getElementById("hole-2");
          steal = board[0][2];
          board[0][2] = 0;
        }
        break;
      case 10:
        if(board[0][1] !== 0){
          stealHole = document.getElementById("hole-1");
          steal = board[0][1];
          board[0][1] = 0;
        }
        break;
      case 11:
        if(board[0][0] !== 0){
          stealHole = document.getElementById("hole-0");
          steal = board[0][0];
          board[0][0] = 0;
        }
        break;
      default:
        break;
      }

      if(steal !== 0){
        board[turn][6] += steal;

        removePieces(stealHole);
        for(steal; steal > 0; steal--){
          var piece = document.createElement('div');
          piece.classList.add("piece");
          document.getElementById("score-" + turn).appendChild(piece);
        }
      }
    }
}

function checkForGameOver(){
  var flag0 = false;
  var flag1 = false;
  var temp = (turn + 1) % 2;

  //check if player0 has an empty board
  for(var i = 0; i < 6; i++){
    if(board[0][i] === 0){
      flag0 = true;
    }
    else{
      //player0's board is not empty
      flag0 = false;
      break;
    }
  }

  //check if player1 has an empty board
  for(var i = 0; i < 6; i++){
    if(board[1][i] === 0){
      flag1 = true;
    }
    else{
      //player1's board is not empty
      flag1 = false;
      break;
    }
  }

  if(temp === 0 && flag0 || temp === 1 && flag1 || turn === 0 && flag0 || turn === 1 && flag1){
      //player0 has no moves, go through player1's holes and move them all to score
      if(flag0){
        for(var s = 0; s < 6; s++){
          if(board[1][s] !== 0){
            var pickup = board[1][s];
            board[1][6] += pickup;
            board[1][s] = 0;

            removePieces(document.getElementById("hole-" + (s + 6)));

            for(var p = pickup; p > 0; p--){
              var piece = document.createElement('div');
              piece.classList.add("piece");
              document.getElementById("score-1").appendChild(piece);
            }
          }
        }
      }
      //player1 has no moves, go through player0's holes and move them all to score
      else if(flag1){
        for(var s = 0; s < 6; s++){
          if(board[0][s] !== 0){
            var pickup = board[temp][s];
            board[0][6] += pickup;
            board[0][s] = 0;

            removePieces(document.getElementById("hole-" + s));

            for(var p = pickup; p > 0; p--){
              var piece = document.createElement('div');
              piece.classList.add("piece");
              document.getElementById("score-0").appendChild(piece);
            }
          }
        }
      }
      //player 0 Win
      if(board[0][6] > board[1][6]){
        alert("Congratulations Red Player! You Win! With " + board[0][6] + " points");
      }
      //player 1 Win
      else if(board[0][6] < board[1][6]){
        alert("Congratulations White Player! You Win! With " + board[1][6] + " points");
      }
      //Tie
      else{
        alert("Amazing! It's a Tie! At " + board[1][6] + " points");
      }
      displayGameOver();
  }
}
function displayGameOver(){
  alert("If you would like to play again, press the button");
}

// click listeners for holes
for(var i = 0; i < 12; i++){
  const hole = i;
  document.getElementById('hole-' + hole)
    .addEventListener('click', function(event) {
      event.preventDefault();
      movePieces(hole);
    });
}

var button = document.getElementById('btn');

  button.addEventListener('click', function(event) {
  event.preventDefault();
  button.value = "Reset";
  startup();
});
