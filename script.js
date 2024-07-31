// Game logic & data

function createGame(side) {
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

//  Players data

function createPlayer(name, token) {
  return { name, token };
}

function createUIHandler() {
  const info = document.querySelector('#info');
  const board = document.querySelector('#board');
}

function createBoardHandler(game) {
  function updateState() {

  }
}

function swapContent(oldContent, newContent) {
  newContent.classList.remove('fade-out');
  oldContent.classList.remove('fade-in');
  oldContent.classList.add('fade-out');

  oldContent.addEventListener('animationend', () => {
    oldContent.style.display = 'none';
    newContent.style.display = 'grid';
    newContent.classList.add('fade-in');
  }, { once: true });
}

document.querySelector('#two-players').addEventListener('click', () => {
  // Animation - swap content
  
  const info = document.querySelector('#info');
  const board = document.querySelector('#board');

  swapContent(info, board);

  // Init variables - 1 time per game

  const game = createGame(3);

  const player1 = createPlayer("Player 1", "X");
  const player2 = createPlayer("Player 2", "O");

  let actualPlayer = player1;

  // Add listeners to every board element - 1 time per game

  [...board.children].forEach((cell, position, cells) => {
    cell.classList.add('clickable');

    cell.addEventListener('click', () => {
      game.placeToken(actualPlayer, position);
      cell.classList.remove('clickable');

      // display game state on board

      const state = game.getState();
      cells.forEach((cell, index) => {
        cell.textContent = state[index];
        cell.style.color = state[index] === 'X' ? 'var(--color-red)' : 'var(--color-blue)';
      });

      if (game.checkWin(actualPlayer)) {
        // Update info content - on win

        info.querySelector('h1').innerHTML = 
          `<span class="${
            (actualPlayer.token === 'X') ? 'red' : 'blue'
          }">${actualPlayer.name}</span> <span class="yellow">wins!`;
        info.querySelector('#two-players').textContent = 'Play again';

        // Animation - swap content

        swapContent(board, info);

        // exit execution environment

        return;
      }
  
      if (game.checkDraw()) {
        // Update info content - on draw

        info.querySelector('h1').innerHTML = '<span class="blue">Draw!</span>';
        info.querySelector('#two-players').textContent = 'Play again';

        // Animation - swap content

        swapContent(board, info);

        // exit execution environment

        return;
      }

      // change turn

      actualPlayer = (actualPlayer === player1) ? player2 : player1;

    }, { once: true });
  });
});

