'use strict';

let lastSequence, currentSign, patterns;
const field = Array.from(document.querySelectorAll('#gamefield td span'));
const cells = [
  field[4],
  field[1],
  field[2],
  field[5],
  field[8],
  field[7],
  field[6],
  field[3],
  field[0],
];
setPatterns();

function setSequences() {
  let sequence = cells.concat([]);

  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i].innerHTML === '\u25EF') {
      sequence[i] = 'O';
    }
    if (sequence[i].innerHTML === '\u2573') {
      sequence[i] = 'X';
    }
  }

  let sequences = [
    sequence,
    sequence.concat([]),
    sequence.concat([]),
    sequence.concat([]),
  ];
  sequences[1].push(...sequences[1].splice(1, 2));
  sequences[2].push(...sequences[2].splice(1, 4));
  sequences[3].push(...sequences[3].splice(1, 6));
  sequences.push(sequences[0].concat([]).reverse());
  sequences[sequences.length - 1].unshift(sequences[0][0], sequences[0][1]);
  sequences[sequences.length - 1].splice(
    sequences[sequences.length - 1].length - 2
  );
  sequences.push(sequences[1].concat([]).reverse());
  sequences[sequences.length - 1].unshift(sequences[1][0], sequences[1][1]);
  sequences[sequences.length - 1].splice(
    sequences[sequences.length - 1].length - 2
  );
  sequences.push(sequences[2].concat([]).reverse());
  sequences[sequences.length - 1].unshift(sequences[2][0], sequences[2][1]);
  sequences[sequences.length - 1].splice(
    sequences[sequences.length - 1].length - 2
  );
  sequences.push(sequences[3].concat([]).reverse());
  sequences[sequences.length - 1].unshift(sequences[3][0], sequences[3][1]);
  sequences[sequences.length - 1].splice(
    sequences[sequences.length - 1].length - 2
  );

  return sequences;
}

function cashSequences(func) {
  let cash = new Map();
  let currentI, currentKey;

  return function (sequences, set) {
    if (!set) {
      for (let i = 0; i < sequences.length; i++) {
        let key = sequences[i].concat([]);
        for (let j = 0; j < key.length; j++) {
          if (key[j] !== 'O' && key[j] !== 'X') {
            key[j] = 'C';
          }
        }
        if (cash.has(key.join(''))) {
          currentKey = key.join('');
          currentI = i;
          switch (i) {
            case '0':
              break;
            case '1':
              sequences[i].splice(
                1,
                0,
                ...sequences[i].splice(sequences.length - 3)
              );
              break;
            case '2':
              sequences[i].splice(
                1,
                0,
                ...sequences[i].splice(sequences.length - 5)
              );
              break;
            case '3':
              sequences[i].splice(
                1,
                0,
                ...sequences[i].splice(sequences.length - 7)
              );
              break;
            case '4':
              sequences[i].splice(
                2,
                0,
                ...sequences[i].splice(sequences.length - 8).reverse()
              );
              break;
            case '5':
              sequences[i].splice(
                2,
                0,
                ...sequences[i].splice(sequences.length - 8).reverse()
              );
              sequences[i].splice(
                1,
                0,
                ...sequences[i].splice(sequences.length - 3)
              );
              break;
            case '6':
              sequences[i].splice(
                2,
                0,
                ...sequences[i].splice(sequences.length - 8).reverse()
              );
              sequences[i].splice(
                1,
                0,
                ...sequences[i].splice(sequences.length - 5)
              );
              break;
            case '7':
              sequences[i].splice(
                2,
                0,
                ...sequences[i].splice(sequences.length - 8).reverse()
              );
              sequences[i].splice(
                1,
                0,
                ...sequences[i].splice(sequences.length - 7)
              );
              break;
          }
          let sequence = cash.get(key.join(''));
          for (let j = 0; j < sequences[i].length; j++) {
            if (sequence[j] === 'N') sequences[i][j] = 'N';
          }
          return func(sequences[i]);
        }
      }
      currentKey = null;
      currentI = null;
      return func(sequences[0]);
    }

    if (!currentKey) {
      let key = sequences.concat([]);

      for (let i = 0; i < sequences.length; i++) {
        if (sequences[i].parentElement.classList.contains('prelast')) {
          sequences[i] = 'N';
          key[i] = 'C';
          continue;
        }
        if (sequences[i].parentElement.classList.contains('last')) {
          key[i] = 'C';
          continue;
        }
        if (sequences[i].innerHTML === '\u25EF') {
          sequences[i] = 'O';
          key[i] = 'O';
          continue;
        }
        if (sequences[i].innerHTML === '\u2573') {
          sequences[i] = 'X';
          key[i] = 'X';
          continue;
        }
        key[i] = 'C';
      }

      if (cash.has(key.join(''))) {
        let cashSeq = cash.get(key.join(''));
        for (let j = 0; j < sequences.length; j++) {
          if (cashSeq[j] === 'N') sequences[j] = 'N';
        }
      }
      cash.set(key.join(''), sequences);
      return;
    }

    switch (currentI) {
      case '0':
        break;
      case '1':
        sequences.splice(1, 0, ...sequences.splice(sequences.length - 3));
        break;
      case '2':
        sequences.splice(1, 0, ...sequences.splice(sequences.length - 5));
        break;
      case '3':
        sequences.splice(1, 0, ...sequences.splice(sequences.length - 7));
        break;
      case '4':
        sequences.splice(
          2,
          0,
          ...sequences.splice(sequences.length - 8).reverse()
        );
        break;
      case '5':
        sequences.splice(
          2,
          0,
          ...sequences.splice(sequences.length - 8).reverse()
        );
        sequences.splice(1, 0, ...sequences.splice(sequences.length - 3));
        break;
      case '6':
        sequences.splice(
          2,
          0,
          ...sequences.splice(sequences.length - 8).reverse()
        );
        sequences.splice(1, 0, ...sequences.splice(sequences.length - 5));
        break;
      case '7':
        sequences.splice(
          2,
          0,
          ...sequences.splice(sequences.length - 8).reverse()
        );
        sequences.splice(1, 0, ...sequences.splice(sequences.length - 7));
        break;
    }

    for (let i = 0; i < sequences.length; i++) {
      if (sequences[i].parentElement.classList.contains('prelast')) {
        sequences[i] = 'N';
        continue;
      }
      if (sequences[i].parentElement.classList.contains('last')) {
        continue;
      }
      if (sequences[i].innerHTML === '\u25EF') {
        sequences[i] = 'O';
        continue;
      }
      if (sequences[i].innerHTML === '\u2573') {
        sequences[i] = 'X';
        continue;
      }
    }

    let cashSeq = cash.get(currentKey);
    for (let j = 0; j < sequences.length; j++) {
      if (cashSeq[j] === 'N') sequences[j] = 'N';
    }

    cash.set(currentKey, sequences);
    currentI = null;
    currentKey = null;
  };
}
cashSequence = cashSequences(cashSequence);

function cashSequence(sequence) {
  return sequence;
}

function randomiseMove() {}

function nextMove() {
  enableCells(false);
  let sequences = setSequences();
  let sequence = cashSequence(sequences, false);
  randomiseMove(sequence);
}

function randomiseMove(sequence) {
  let noMoves = sequence.filter((cell) => (cell === 'N' ? true : false));
  let enabledMoves = sequence.filter((cell) =>
    typeof cell === 'object' ? true : false
  );
  if (enabledMoves.length > 0) {
    let move = Math.floor(Math.random() * enabledMoves.length);
    enabledMoves[move].innerHTML = current();
    document.querySelector('.prelast')?.classList.remove('prelast');
    document.querySelector('.last')?.classList.add('prelast');
    document.querySelector('.prelast')?.classList.remove('last');
    enabledMoves[move].parentElement.classList.add('last');
    let win = checkWin();
    if (win) {
      endGame(win);
      return;
    }
    enableCells(true);
  }

  if (
    (enabledMoves.length === 1 && noMoves.length === 0) ||
    enabledMoves.length === 0
  ) {
    endGame(null);
    return;
  }

  if (enabledMoves.length === 0 && noMoves.length > 0) {
    resign();
    return;
  }
}

function current() {
  if (currentSign === '\u25EF') return '\u2573';
  if (currentSign === '\u2573') return '\u25EF';
}

function resign() {
  document.querySelector('#gamefield caption').innerHTML =
    'You won! Another game?';
  enableCells(false);
}

function enableCells(yes) {
  if (yes) {
    cells.forEach((cell) => {
      if (cell.innerHTML === '') {
        cell.parentElement.addEventListener('click', playerMove, true);
      }
    });
    return;
  }

  if (!yes) {
    cells.forEach((cell) => {
      cell.parentElement.removeEventListener('click', playerMove, true);
    });
    return;
  }
}
enableCells(true);

function playerMove(event) {
  event.target.querySelector('span').innerHTML = currentSign;
  document.querySelector('.prelast')?.classList.remove('prelast');
  document.querySelector('.last')?.classList.add('prelast');
  document.querySelector('.prelast')?.classList.remove('last');
  event.target.classList.add('last');
  let win = checkWin();
  if (win) {
    endGame(win);
    return;
  }
  nextMove();
}

function endGame(winners) {
  enableCells(false);
  let state;
  if (winners === null) {
    state = 'draw';
    document.querySelector('#gamefield caption').innerHTML =
      'Draw. Another game?';
    createResult(state);
    return;
  }

  if (winners[0].innerHTML === currentSign) {
    state = 'win';
    document.querySelector('#gamefield caption').innerHTML =
      'You won. Another game?';
    winners.forEach((cell) => cell.parentElement.classList.add('loser'));
  } else {
    state = 'lose';
    document.querySelector('#gamefield caption').innerHTML =
      'You lost. Another game?';
    winners.forEach((cell) => cell.parentElement.classList.add('winner'));
  }

  createResult(state);
  cashLoserMove();
}

function setGameStart() {
  let button = document.querySelector('#newgame');
  setCurrentSign();

  button.addEventListener('click', () => {
    cells.forEach((cell) => (cell.innerHTML = ''));
    cells.forEach((cell) => cell.parentElement.classList.remove('winner'));
    cells.forEach((cell) => cell.parentElement.classList.remove('loser'));
    setCurrentSign();
    enableCells(true);
  });
}
setGameStart();

function setCurrentSign() {
  let current = Math.floor(Math.random() * 2);

  if (current === 0) {
    currentSign = '\u25EF';
    nextMove();
  }
  if (current === 1) {
    currentSign = '\u2573';
  }
  document.querySelector(
    '#gamefield caption'
  ).innerHTML = `You're playing <span>${currentSign}</span>`;
}

function setPatterns() {
  patterns = [];
  patterns.push([cells[8], cells[0], cells[4]]);
  patterns.push([cells[2], cells[0], cells[6]]);
  patterns.push(
    Array.from(document.querySelectorAll('#gamefield tr:nth-child(1) td span'))
  );
  patterns.push(
    Array.from(document.querySelectorAll('#gamefield tr:nth-child(2) td span'))
  );
  patterns.push(
    Array.from(document.querySelectorAll('#gamefield tr:nth-child(3) td span'))
  );
  patterns.push(
    Array.from(document.querySelectorAll('#gamefield tr td:nth-child(1) span'))
  );
  patterns.push(
    Array.from(document.querySelectorAll('#gamefield tr td:nth-child(2) span'))
  );
  patterns.push(
    Array.from(document.querySelectorAll('#gamefield tr td:nth-child(3) span'))
  );
}

function checkWin() {
  for (let i = 0; i < patterns.length; i++) {
    if (patterns[i][0].innerHTML !== '') {
      if (
        patterns[i][0].innerHTML === patterns[i][1].innerHTML &&
        patterns[i][0].innerHTML === patterns[i][2].innerHTML
      ) {
        return patterns[i];
      }
    }
  }
  return null;
}

function cashLoserMove() {
  cashSequence(cells.concat(), true);
}

function createResults(func) {
  const table = document.querySelector('#results tbody');
  let num = 0;
  let winSum = 0;

  return function (state) {
    if (state === 'win') winSum++;
    table.innerHTML += `<tr class="${state}"><td>${++num}</td><td>${state}</td><td>${
      Math.round((winSum / num) * 100) + '%'
    }</td></tr>`;
    func();
  };
}
createResult = createResults(createResult);

function createResult(state) {
  return;
}
