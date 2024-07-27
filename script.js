function createBoard(side) {
  const state = Array(side ** 2).fill(null);

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function placeToken(player, position) {
    console.log(state[position]);
    if (state[position] !== null) return false;
    state[position] = player.token;
    return true;
  }

  function checkWin(player) {
    return winningCombinations.some((combination) =>
      combination.every((position) => state[position] === player.token)
    );
  }

  function checkDraw() {
    return state.every((position) => position);
  }

  function getState() {
    return state;
  }

  return { placeToken, checkWin, checkDraw, getState };
}

function createPlayer(name, token) {
  return { name, token }
}

const board = createBoard(3);

const player1 = createPlayer('Player1', 'X');
const player2 = createPlayer('Player2', 'O');

let actualPlayer = player2;

while (true) {
  actualPlayer = (actualPlayer === player2) ? player1 : player2;

  let position;

  do {
    position = prompt(`${actualPlayer.name} move:`);
  } while (! board.placeToken(actualPlayer, position));
 
  if (board.checkWin(actualPlayer)) {
    console.log(`${actualPlayer.name} wins!`);
    break;
  }

  if (board.checkDraw()) {
    console.log('Draw');
    break;
  }

  const state = board.getState();

  console.log(state.slice(0, 3));
  console.log(state.slice(3, 6));
  console.log(state.slice(6));
  console.log('---');
}

