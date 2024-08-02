const menu = (function () {
  const element = document.querySelector("#menu");

  function updateContent(title, firstButton, secondButton) {
    element.querySelector("h1").innerHTML = title;
    element.querySelector("#one-player").textContent = firstButton;
    element.querySelector("#two-players").textContent = secondButton;
  }

  return { element, updateContent };
})();

const board = (function () {
  const element = document.querySelector("#board");
  const tokenColorClasses = {
    X: "text-red",
    O: "text-blue",
  };

  function update(state) {
    [...element.children].forEach((cell, index) => {
      if (state[index] && cell.textContent === "") {
        cell.classList.remove("clickable");
        cell.classList.add(tokenColorClasses[state[index]]);
        cell.textContent = state[index];
        cell.replaceWith(cell.cloneNode(true));
      }
    });
  }

  function reset() {
    [...element.children].forEach((cell) => {
      cell.classList.remove("text-red", "text-blue");
      cell.classList.add("clickable");
      cell.textContent = "";
    });
  }

  function lock() {
    [...element.children].forEach((cell) => {
      cell.replaceWith(cell.cloneNode(true));
    });
  }

  return { element, update, reset, lock };
})();

const uiHandler = (function () {
  function swapContent(oldContent, newContent, delayedExit = null) {
    newContent.classList.remove("fade-out", "animation-delay");
    oldContent.classList.remove("fade-in", "animation-delay");

    if (delayedExit) oldContent.classList.add("animation-delay");
    oldContent.classList.add("fade-out");

    oldContent.addEventListener(
      "animationend",
      () => {
        oldContent.classList.add("display-none");
        newContent.classList.remove("display-none");
        newContent.classList.add("fade-in");
      },
      { once: true }
    );
  }

  return { swapContent };
})();

document.querySelector("#one-player").addEventListener("click", (event) => {
  board.reset();
  uiHandler.swapContent(menu.element, board.element);

  const gameData = createGameData();

  const playerX = createPlayer("X");
  const playerO = createPlayer("O");

  const button = event.currentTarget;

  const [humanPlayer, aiPlayer] =
    button.dataset.played % 2 === 0
      ? [playerX, createAi(playerO)]
      : [playerO, createAi(playerX)];

  if (aiPlayer.token === playerX.token) {
    const aiMove = aiPlayer.selectMove(gameData, humanPlayer.token);

    gameData.placeToken(aiPlayer.token, aiMove);
    board.update(gameData.getState());
  }

  [...board.element.children].forEach((cell, position) => {
    cell.addEventListener(
      "click",
      () => {
        gameData.placeToken(humanPlayer.token, position);

        board.update(gameData.getState());

        if (gameData.checkWin(humanPlayer.token)) {
          menu.updateContent(
            `<span class="${
              humanPlayer.token === "X" ? "text-red" : "text-blue"
            }">${humanPlayer.token}</span> <span class="text-yellow">wins!`,
            "Play again",
            "2 Players"
          );

          board.lock();
          button.dataset.played = Number(button.dataset.played) + 1;

          uiHandler.swapContent(board.element, menu.element, true);
          return;
        }

        if (gameData.checkDraw()) {
          menu.updateContent(
            '<span class="text-yellow">Draw!</span>',
            "Play again",
            "2 Players"
          );

          button.dataset.played = Number(button.dataset.played) + 1;

          uiHandler.swapContent(board.element, menu.element, true);
          return;
        }

        //make ai move

        const aiMove = aiPlayer.selectMove(gameData, humanPlayer.token);

        gameData.placeToken(aiPlayer.token, aiMove);
        board.update(gameData.getState());

        if (gameData.checkWin(aiPlayer.token)) {
          menu.updateContent(
            `<span class="${
              aiPlayer.token === "X" ? "text-red" : "text-blue"
            }">${aiPlayer.token}</span> <span class="text-yellow">wins!`,
            "Play again",
            "2 Players"
          );

          board.lock();
          button.dataset.played = Number(button.dataset.played) + 1;

          uiHandler.swapContent(board.element, menu.element, true);
          return;
        }

        if (gameData.checkDraw()) {
          menu.updateContent(
            '<span class="text-yellow">Draw!</span>',
            "Play again",
            "2 Players"
          );



          button.dataset.played = Number(button.dataset.played) + 1;

          uiHandler.swapContent(board.element, menu.element, true);
          return;
        }

      },
      { once: true }
    );
  });
});

document.querySelector("#two-players").addEventListener("click", () => {
  board.reset();
  uiHandler.swapContent(menu.element, board.element);

  const gameData = createGameData();

  const playerX = createPlayer("X");
  const playerO = createPlayer("O");

  let actualPlayer = playerX;

  [...board.element.children].forEach((cell, position) => {
    cell.addEventListener(
      "click",
      () => {
        gameData.placeToken(actualPlayer.token, position);

        board.update(gameData.getState());

        if (gameData.checkWin(actualPlayer.token)) {
          menu.updateContent(
            `<span class="${
              actualPlayer.token === "X" ? "text-red" : "text-blue"
            }">${actualPlayer.token}</span> <span class="text-yellow">wins!`,
            "1 Player",
            "Play again"
          );

          board.lock();

          uiHandler.swapContent(board.element, menu.element, true);
          return;
        }

        if (gameData.checkDraw()) {
          menu.updateContent(
            '<span class="text-yellow">Draw!</span>',
            "1 Player",
            "Play again"
          );

          uiHandler.swapContent(board.element, menu.element, true);
          return;
        }

        actualPlayer = actualPlayer === playerX ? playerO : playerX;
      },
      { once: true }
    );
  });
});

function createGameData() {
  const state = Array(9).fill(null);

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

  function placeToken(token, position) {
    state[position] = token;
  }

  function removeToken(position) {
    state[position] = null;
  }

  function checkWin(token) {
    return winningCombinations.some((combination) =>
      combination.every((position) => state[position] === token)
    );
  }

  function checkDraw() {
    return !state.includes(null);
  }

  function evaluate(token, opponentToken) {
    if (checkWin(token)) return 10;
    if (checkWin(opponentToken)) return -10;
    if (checkDraw()) return 0;
    return null;
  }

  function getState() {
    return state;
  }

  return { placeToken, removeToken, checkWin, checkDraw, evaluate, getState };
}

//  Players data

function createPlayer(token) {
  return { token };
}

function createAi(player) {
  const { token } = player;

  function getEmptyCells(gameState) {
    return gameState
      .map((cell, index) => (cell === null ? index : null))
      .filter((index) => index !== null);
  }

  function selectMove(gameData, opponentToken) {
    const data = {...gameData};
    let bestScore = -Infinity;
    let move = null;

    getEmptyCells(data.getState()).forEach((cell) => {
      data.placeToken(token, cell);
      const score = minimax(data, 0, opponentToken);
      if (score > bestScore) {
        bestScore = score;
        move = cell;
      }
      data.removeToken(cell);
    });

    return move;
  }

  function minimax(gameData, depth, opponentToken, isMaximizing = false) {
    const data = {...gameData};
    const score = data.evaluate(token, opponentToken);

    if (score !== null || depth === 1) return score;

    if (isMaximizing) {
      let bestScore = -Infinity;

      getEmptyCells(data.getState()).forEach((cell) => {
        data.placeToken(token, cell);
        const score = minimax(data, depth + 1, opponentToken, false);
        bestScore = Math.max(score, bestScore);
        data.removeToken(cell);
      });

      return bestScore - depth;
    } else {
      let bestScore = Infinity;

      getEmptyCells(data.getState()).forEach((cell) => {
        data.placeToken(opponentToken, cell);
        const score = minimax(data, depth + 1, opponentToken, true);
        bestScore = Math.min(score, bestScore);
        data.removeToken(cell);
      });

      return bestScore - depth;
    }
  }

  return { token, selectMove };
}
