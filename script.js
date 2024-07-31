const menu = (function () {
  const element = document.querySelector('#menu');

  function updateContent(titleContent, buttonContent) {
    element.querySelector("h1").innerHTML = titleContent;
    element.querySelector("#two-players").textContent = buttonContent;
  }

  return { element, updateContent };
})();

const board = (function () {
  const element = document.querySelector('#board');

  function update(state) {
    [...element.children].forEach((cell, index) => {
      if (state[index]) {
        cell.textContent = state[index];
        cell.classList.add(state[index] === "X" ? "text-red" : "text-blue");
      }
    });
  }

  function reset() {
    [...element.children].forEach((cell) => {
      cell.classList.remove('text-red', 'text-blue');
      cell.classList.add('clickable');
      cell.textContent = '';
      cell.replaceWith(cell.cloneNode(true));
    });
  }

  return { element, update, reset };
})();

const uiHandler = (function () {
  function swapContent(oldContent, newContent) {
    newContent.classList.remove("fade-out");
    oldContent.classList.remove("fade-in");
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

  return { swapContent }
})();


document.querySelector("#two-players").addEventListener("click", () => {
  board.reset();
  // Animation - swap content
  uiHandler.swapContent(menu.element, board.element);

  // Init variables - 1 time per game

  const gameData = createGameData();

  const player1 = createPlayer("Player 1", "X");
  const player2 = createPlayer("Player 2", "O");

  let actualPlayer = player1;

  // Add listeners to every board element - 1 time per game

  [...board.element.children].forEach((cell, position) => {

    cell.addEventListener(
      'click',
      () => {
        gameData.placeToken(actualPlayer, position);
        cell.classList.remove("clickable");

        // display game state on board

        board.update(gameData.getState());

        if (gameData.checkWin(actualPlayer)) {
          // Update menu content - on win

          menu.updateContent(
            `<span class="${
              actualPlayer.token === 'X' ? 'text-red' : 'text-blue'
            }">${actualPlayer.name}</span> <span class="text-yellow">wins!`,
            'Play again'
          );

          // Animation - swap content

          uiHandler.swapContent(board.element, menu.element);

          // exit execution environment

          return;
        }

        if (gameData.checkDraw()) {
          // Update info content - on draw

          menu.updateContent(
            '<span class="text-blue">Draw!</span>',
            'Play again'
          );

          // Animation - swap content

          uiHandler.swapContent(board.element, menu.element);

          // exit execution environment

          return;
        }

        // change turn

        actualPlayer = actualPlayer === player1 ? player2 : player1;
      },
      { once: true }
    );
  });
});


// Game Data

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

  function placeToken(player, position) {
    state[position] = player.token;
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

//  Players data

function createPlayer(name, token) {
  return { name, token };
}



