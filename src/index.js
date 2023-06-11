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

  // for (let i = rows - 1; i >= 0; i--) {
  //   board[i] = Array(cols).fill(cell());
  // } //This works the same way as below

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
  console.log(movesLeftOnEachCol); //[6,6,6,6,6,6,6]
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
  //Display on the console for now
  const display = (board) => {
    // console.table(board.map((row) => row.map((col) => col)));
    console.table(board.map((row) => row.map((col) => col.getValue())));
  };
  return { display };
})();

const gameController = (() => {
  const board = gameBoard;
  const ui = uiController;
  const ai = aiPlayer;

  let aiMode = 0;
  let player0 = player("x", false);
  let player1 = player("o", true);
  let currentPlayer = player0;
  let gameEnded = false;

  const switchCurrent = () =>
    currentPlayer === player0
      ? (currentPlayer = player1)
      : (currentPlayer = player0);

  const display = () => {
    ui.display(board.grid.get());
  };

  const setPlayers = (num) => {
    player0 = player("x", false);
    if (num === 1) {
      player1 = player("o", true);
      return;
    }
    player1 = player("o", false);
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
    }
  };

  // const checkWin = () =>

  const aiPlayRound = () => {
    const aiMove = ai.move(aiMode);
    playRound(aiMove, currentPlayer.getMark());
    if (currentPlayer.isBot()) {
      console.log("Invalid move, AI play again!");
      aiPlayRound();
    }
    return;
  };

  const playRound = (col) => {
    if (gameEnded) return;
    if (board.move.isTie()) {
      gameEnded = true;
      return;
    }
    if (board.checkCol.check(col)) {
      board.grid.set(col, currentPlayer.getMark());
      board.checkCol.minus(col);
      display();
      //check win here
      switchCurrent();
      if (currentPlayer.isBot()) aiPlayRound();
      return;
    }
    console.log("Invalid move, Human play again!");
  };
  display();

  const reset = () => {
    gameEnded = false;
    board.grid.reset();
    board.checkCol.reset();
    board.move.reset();
    display();
  };
  return { setPlayers, setAiMode, setHumanMark, playRound, reset };
})();

//Call game
(() => {
  const game = gameController;
  game.setPlayers(1);
  game.setHumanMark("x"); //'o' if human want to switch
  game.setAiMode(0);
  // game.playRound();
  const p = (col) => {
    game.playRound(col);
  };
  p(1);
  p(1);
  p(1);
  p(1);
  p(1);
  p(1);
  p(1);
  p(1);
  p(1);
})();
