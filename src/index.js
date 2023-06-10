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
  const setMark = (m) => (mark = m);
  const isBot = () => bot;
  return {
    getMark,
    setMark,
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

  //horizontal
  for (let i = rows - 1; i >= 0; i--) {
    for (let j = 6; j > -1; j--) {}
  }

  //vertical

  //cross up

  //cross down

  const getBoard = () => board;

  const setBoard = (r, c, mark) => {
    board[r][c].setValue(mark);
  };

  const reset = () =>
    (board = board.map((row) => row.map((col) => (col = cell()))));
  return { getBoard, setBoard, reset };
})();

const uiController = (() => {
  const display = (board) => {
    console.table(board.map((r) => r.map((c) => c.getValue())));
  };
  return { display };
})();

const gameController = (() => {
  const board = gameBoard;
  const ui = uiController;
  const ai = aiPlayer;

  let player0;
  let player1;
  let aiMode = 0;
  let currentPlayer = player0;
  let moves = 42;
  let gameEnd = false;

  const isEnd = () => gameEnd;
  const resetEnd = () => (gameEnd = true);
  const isTie = () => moves === 0;
  const minusMoves = () => moves--;
  const resetMoves = () => (moves = 42);

  const display = () => {
    ui.display(board.getBoard());
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
      return;
    }
    player0 = player("x", true);
    player1 = player("o", false);
  };

  const playRound = () => {};
  display();

  const reset = () => {
    board.reset();
    resetMoves();
    resetEnd();
    ui.display();
  };
  return { setPlayers, setAiMode, setHumanMark, playRound, isEnd, reset };
})();

//this is a shorthand to play game in console when develop
const p = (n) => {
  const game = gameController;
  game.playRound(n);
};

//Call game
(() => {
  const game = gameController;
  game.setPlayers(1);
  game.setHumanMark("x"); //'o' if human want to switch
  game.setAiMode(0);
  // game.playRound();
})();
