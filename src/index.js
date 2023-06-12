import "./style.css";

const cell = () => {
  let value = "";

  const getValue = () => value;

  const setValue = (v) => {
    value = v;
  };
  return {
    getValue,
    setValue,
  };
};

const player = (mark, bot) => {
  const getMark = () => mark;
  const isBot = () => bot;
  return {
    getMark,
    isBot,
  };
};

const aiPlayer = (() => {
  //make moves base on difficulty
  const mode0 = () => {
    //mode0 aiPlayer just make random moves between 0-6
    return Math.floor(Math.random() * 7);
  };
  const mode1 = () => {};
  const mode2 = () => {};
  const mode3 = () => {};
  const mode4 = () => {};

  const arr = [mode0, mode1, mode2, mode3, mode4];
  const move = (mode) => {
    return arr[mode]();
  };

  return { move };
})();

const gameBoard = (() => {
  const rows = 6;
  const cols = 7;
  let board = [];

  for (let i = rows - 1; i >= 0; i--) {
    board[i] = [];
    for (let j = cols - 1; j >= 0; j--) {
      board[i][j] = cell();
    }
  }
  let winsCombination = [];

  //horizontal (24 combinations)
  for (let i = rows - 1; i >= 0; i--) {
    for (let j = cols - 1; j > 2; j--) {
      winsCombination.push([
        [i, j],
        [i, j - 1],
        [i, j - 2],
        [i, j - 3],
      ]);
    }
  }

  //vertical (21 combinations)
  for (let i = rows - 1; i > 2; i--) {
    for (let j = cols - 1; j >= 0; j--) {
      winsCombination.push([
        [i, j],
        [i - 1, j],
        [i - 2, j],
        [i - 3, j],
      ]);
    }
  }

  //cross up (12 combinations)
  for (let i = rows - 1; i > 2; i--) {
    for (let j = cols - 1; j > 2; j--) {
      winsCombination.push([
        [i, j],
        [i - 1, j - 1],
        [i - 2, j - 2],
        [i - 3, j - 3],
      ]);
    }
  }

  //cross down (12 combinations)
  for (let i = 0; i < 3; i++) {
    for (let j = cols - 1; j > 2; j--) {
      winsCombination.push([
        [i, j],
        [i + 1, j - 1],
        [i + 2, j - 2],
        [i + 3, j - 3],
      ]);
    }
  }
  // console.dir(winsCombination); //69

  const getWinsCombination = () => winsCombination;

  let movesLeft = 42;
  const minusMoves = () => movesLeft--;
  const resetMoves = () => (movesLeft = 42);
  const isTie = () => movesLeft === 0;

  const move = {
    isTie,
    minus: minusMoves,
    reset: resetMoves,
  };

  //Use movesLeftOnEachCol so that I don't have to loop through every position of a column to check whether that column is full
  let movesLeftOnEachCol = [];
  for (let i = cols - 1; i >= 0; i--) {
    movesLeftOnEachCol.push(rows);
  }
  // console.log(movesLeftOnEachCol); //[6,6,6,6,6,6,6]
  const canMakeMoveOnCol = (col) => movesLeftOnEachCol[col] > 0; //if a specific col has moves left = 0, then return false (means can't make move on that col)
  const minusMovesLeftOnACol = (col) => movesLeftOnEachCol[col]--; //if move is valid then moves left on that col decrease
  const getMovesLeftOnCol = (col) => movesLeftOnEachCol[col]; //Use this to drop token of place mark,example if moves left on a specific col is 6 then wee place mark on board[6-1][col] (rows index)
  const resetMovesLeftOnEachCol = () => {
    movesLeftOnEachCol = [];
    for (let i = cols - 1; i >= 0; i--) {
      movesLeftOnEachCol.push(rows);
    }
  };

  const checkCol = {
    check: canMakeMoveOnCol,
    minus: minusMovesLeftOnACol,
    get: getMovesLeftOnCol,
    reset: resetMovesLeftOnEachCol,
  }; //this object is a mini module to export

  const getBoard = () => board;
  const setBoard = (c, mark) => {
    let lowestEmpty = getMovesLeftOnCol(c) - 1;
    board[lowestEmpty][c].setValue(mark);
  };
  const resetBoard = () => {
    board = [];
    for (let i = rows - 1; i >= 0; i--) {
      board[i] = [];
      for (let j = cols - 1; j >= 0; j--) {
        board[i][j] = cell();
      }
    }
  };
  const grid = {
    get: getBoard,
    set: setBoard,
    reset: resetBoard,
  };

  return { move, grid, checkCol, getWinsCombination };
})();

const uiController = (() => {
  const boardDiv = document.getElementById("game-board");
  const notes = document.getElementById("notes");
  const colBtn = document.querySelectorAll("[data-col]");
  const winner = document.getElementById("winner");
  const resetBtn = document.getElementById("reset");
  const vsAiBtn = document.getElementById("vsAi");
  const vsHuBtn = document.getElementById("vsHu");
  const xBtn = document.getElementById("mark-x");
  const oBtn = document.getElementById("mark-o");
  const showGameMode = document.getElementById("show-game-mode");
  const showHumanMark = document.getElementById("show-human-mark");

  const d = "disabled";

  const display = (row, col, mark) => {
    const div = document.createElement("div");
    boardDiv.appendChild(div);
    div.className = "center";
    div.innerHTML = mark.toUpperCase();
    div.style.gridRowStart = row;
    div.style.gridColumnStart = col + 1;
    if (mark === "x") div.style.backgroundColor = "lightpink";
    if (mark === "o") div.style.backgroundColor = "lightblue";
  };

  const reset = () => {
    boardDiv.innerHTML = "";
    notes.textContent = "Game restart.";
    winner.textContent = "";
    gameController.reset();
  };

  const showPlayerTurn = (player) =>
    (notes.textContent = `It is player ${player
      .getMark()
      .toUpperCase()}'s turn.`);

  const invalid = (player) =>
    (notes.textContent = `Invalid move, ${player
      .getMark()
      .toUpperCase()} play again!`);

  const showWinner = (player) =>
    (winner.textContent = `Player ${player.getMark().toUpperCase()}!`);

  const tie = () => (notes.textContent = "Tie Game!");

  const xDisable = (boolean) => {
    if (boolean) {
      xBtn.setAttribute(d, true);
      oBtn.removeAttribute(d);
      showHumanMark.textContent = `Human is X`;
    } else {
      oBtn.setAttribute(d, true);
      xBtn.removeAttribute(d);
      showHumanMark.textContent = `Human is O`;
    }
  };

  const aiDisable = (boolean) => {
    if (boolean) {
      vsAiBtn.setAttribute(d, true);
      vsHuBtn.removeAttribute(d);
      showGameMode.textContent = "Human vs AI";
    } else {
      vsHuBtn.setAttribute(d, true);
      vsAiBtn.removeAttribute(d);
      showGameMode.textContent = "Human vs Human";
    }
  };
  const init = () => {
    gameController.setPlayers(1);
    gameController.setHumanMark("x"); //'o' if human want to switch
    gameController.setAiMode(0);
    xDisable(true);
    aiDisable(true);
  };

  colBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      gameController.playRound(Number(btn.dataset.col));
    });
  });

  vsAiBtn.addEventListener("click", () => {
    gameController.setPlayers(1);
    gameController.setHumanMark("x"); //'o' if human want to switch
    reset();
    aiDisable(true);
    xDisable(true);
  });

  vsHuBtn.addEventListener("click", () => {
    gameController.setPlayers(2);
    reset();
    aiDisable(false);
    xBtn.setAttribute(d, true);
    oBtn.setAttribute(d, true);
    showHumanMark.textContent = "";
  });

  xBtn.addEventListener("click", () => {
    gameController.setHumanMark("x"); //'o' if human want to switch
    gameController.setPlayers(1);
    reset();
    aiDisable(true);
    xDisable(true);
  });

  oBtn.addEventListener("click", () => {
    gameController.setPlayers(1);
    gameController.setHumanMark("o");
    reset();
    aiDisable(true);
    xDisable(false);
  });

  //play with keyboard
  window.addEventListener("keyup", (e) => {
    const arr = ["1", "2", "3", "4", "5", "6", "7"];
    if (arr.includes(e.key)) gameController.playRound(arr.indexOf(e.key));
    if (e.key === "Enter") reset();
  });

  resetBtn.addEventListener("click", reset);
  return {
    tie,
    display,
    init,
    reset,
    invalid,
    turn: showPlayerTurn,
    winner: showWinner,
  };
})();

//use var for hoisting
var gameController = (() => {
  const board = gameBoard;
  const ui = uiController;
  const ai = aiPlayer;

  let aiMode = 0;
  let player0 = player("x", false);
  let player1 = player("o", true);
  let currentPlayer = player0;
  let gameEnded = false;

  const winCases = board.getWinsCombination();

  const switchCurrent = () =>
    currentPlayer === player0
      ? (currentPlayer = player1)
      : (currentPlayer = player0);

  const setPlayers = (num) => {
    player0 = player("x", false);
    if (num === 1) {
      player1 = player("o", true);
      return;
    }
    player1 = player("o", false);
    currentPlayer = player0;
  };

  const setAiMode = (num) => {
    aiMode = num;
  };

  const setHumanMark = (mark = "x") => {
    if (mark === "x") {
      player0 = player("x", false);
      player1 = player("o", true);
      currentPlayer = player0;
      return;
    }
    if ((mark = "o")) {
      player0 = player("x", true);
      player1 = player("o", false);
      currentPlayer = player0;
      aiPlayRound();
    }
  };

  const checkWin = (player) => {
    // console.log(board.getWinsCombination());
    for (let winCase of winCases) {
      let flag = winCase.every(
        (el) => board.grid.get()[el[0]][el[1]].getValue() === player.getMark()
      );
      if (flag) {
        gameEnded = true;
        // console.log(`${player.getMark()} is the winner!`);
        ui.winner(currentPlayer);
        return;
      }
    }
  };

  const aiPlayRound = () => {
    const aiMove = ai.move(aiMode);
    playRound(aiMove);
    if (currentPlayer.isBot()) {
      // console.log("Invalid move, AI play again!");
      ui.invalid(currentPlayer);
      aiPlayRound();
    }
    if (board.move.isTie()) {
      gameEnded = true;
      ui.tie();
      return;
    }
    return;
  };

  const playRound = (col) => {
    if (gameEnded) return;
    if (board.move.isTie()) {
      gameEnded = true;
      ui.tie();
      return;
    }
    if (board.checkCol.check(col)) {
      board.grid.set(col, currentPlayer.getMark());
      let row = board.checkCol.get(col); //because we use this row number to style grid row start so we use the plain number instead of index number (which will have to minus 1)
      board.checkCol.minus(col);
      board.move.minus();
      ui.display(row, col, currentPlayer.getMark()); //we use index column number so the ui.display() method above should +1 to the col number
      checkWin(currentPlayer);
      switchCurrent();
      ui.turn(currentPlayer);
      if (currentPlayer.isBot() && !gameEnded) {
        if (board.move.isTie()) {
          gameEnded = true;
          ui.tie();
          return;
        }
        aiPlayRound();
      }
      return;
    }
    // console.log("Invalid move, Human play again!");
    ui.invalid(currentPlayer);
  };

  const reset = () => {
    gameEnded = false;
    currentPlayer = player0;
    board.grid.reset();
    board.checkCol.reset();
    board.move.reset();
    if (currentPlayer.isBot()) aiPlayRound();
    // ui.reset();
  };
  return { setPlayers, setAiMode, setHumanMark, aiPlayRound, playRound, reset };
})();

//Call game
window.addEventListener("DOMContentLoaded", () => {
  uiController.init();
});
