function createBoard() {
  const state = Array(9).fill(null);

  function placeToken(player, position) {
    if (state[position]) throw new Error();
    state[position] = player;
  }

  function checkWin(player) {
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

    winningCombinations.some((combination) =>
      combination.every((position) => state[position] === player)
    );
  }

  function checkDraw() {
    return state.every((position) => position);
  }

  return { placeToken, checkWin };
}
