'use strict';

let checkWinner = checkWin();
let getCurrent = setCurrentSign();
let createResult = createResults();

function getCells() {
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
  return cells;
}

function setCurrentSign() {
  let currentSign;
  let current = Math.floor(Math.random() * 2);

  currentSign = current === 0 ? '\u25EF' : '\u2573';

  document.querySelector(
    '#gamefield caption'
  ).innerHTML = `You're playing <span>${currentSign}</span>`;

  return function () {
    return currentSign || 'not set';
  };
}

function setGameStart() {
  if (getCurrent() === '\u25EF') nextMove();
  clearCash();

  let button = document.querySelector('#newgame');
  let cells = getCells();

  button.addEventListener('click', () => {
    cells.forEach((cell) => (cell.innerHTML = ''));
    cells.forEach((cell) => cell.parentElement.classList.remove('winner'));
    cells.forEach((cell) => cell.parentElement.classList.remove('loser'));
    getCurrent = setCurrentSign();
    if (getCurrent() === '\u25EF') nextMove();
    enableCells(true);
  });
}
setGameStart();

function getKey() {
  let player = getCurrent();
  let key = getCells().map((cell) => {
    if (cell.innerHTML !== player) {
      return 1;
    }
    return 0;
  });
  return key;
}

function setKey() {
  let winner = document.querySelector('.last span').innerHTML;
  let key = getCells().map((cell) => {
    if (cell.innerHTML !== winner) {
      return 1;
    }
    return cell.parentElement.classList.contains('last') ? 1 : 0;
  });
  return key;
}

function setSeq() {
  let winner = document.querySelector('.last span').innerHTML;
  let loser = document.querySelector('.prelast span').innerHTML;
  let seq = getCells().map((cell) => {
    if (cell.innerHTML === loser) {
      return cell.parentElement.classList.contains('last') ? 1 : 0;
    }
    if (cell.innerHTML === winner) {
      return cell.parentElement.classList.contains('last') ? 1 : 0;
    }
    return 1;
  });
  return seq;
}

function setNewSeq(key, seq) {
  let prevSeq = localStorage.getItem(key).split(',');
  let newSeq = [];
  for (let i = 0; i < prevSeq.length; i++) {
    if (prevSeq[i] === '0') {
      newSeq.push(0);
      continue;
    }
    if (seq[i].innerHTML !== '') {
      newSeq.push(seq[i].parentElement.classList.contains('last') ? 1 : 0);
      continue;
    }
    newSeq.push(1);
  }

  return newSeq;
}

function setCash() {
  let key = setKey();
  let curr = getSeq(key);

  if (curr) {
    key = curr[0];
    let seq = setNewSeq(key, curr[1]);
    localStorage.setItem(key, seq);
    return;
  }

  let seq = setSeq();
  localStorage.setItem(key, seq);
}

function getSeq(theKey) {
  let key = [].concat(theKey);
  let seq = getCells();

  if (localStorage.getItem(key)) return [key, seq];

  seq.push(...seq.splice(2).reverse());
  key.push(...key.splice(2).reverse());
  if (localStorage.getItem(key)) return [key, seq];

  seq.push(...seq.splice(1, 2));
  key.push(...key.splice(1, 2));
  if (localStorage.getItem(key)) return [key, seq];

  seq.push(...seq.splice(2).reverse());
  key.push(...key.splice(2).reverse());
  if (localStorage.getItem(key)) return [key, seq];

  seq.push(...seq.splice(1, 4));
  key.push(...key.splice(1, 4));
  if (localStorage.getItem(key)) return [key, seq];

  seq.push(...seq.splice(2).reverse());
  key.push(...key.splice(2).reverse());
  if (localStorage.getItem(key)) return [key, seq];

  seq.push(...seq.splice(1, 6));
  key.push(...key.splice(1, 6));
  if (localStorage.getItem(key)) return [key, seq];

  seq.push(...seq.splice(2).reverse());
  key.push(...key.splice(2).reverse());
  if (localStorage.getItem(key)) return [key, seq];

  return null;
}

function nextMove() {
  let seq = getMove();

  if (seq.length > 0) {
    let move = Math.floor(Math.random() * seq.length);
    let currentSign = getCurrent();
    seq[move].innerHTML = currentSign === '\u25EF' ? '\u2573' : '\u25EF';
    document.querySelector('.prelast')?.classList.remove('prelast');
    document.querySelector('.last')?.classList.add('prelast');
    document.querySelector('.prelast')?.classList.remove('last');
    seq[move].parentElement.classList.add('last');
    let win = checkWinner();
    if (win) {
      endGame(win);
      return;
    }
  }

  if (seq.length === 0) {
    resign();
    return;
  }

  enableCells(true);
}

function getMove() {
  let key = getKey();
  let seq = getSeq(key);
  if (seq) {
    key = seq[0];
    seq = seq[1];
    let cash = localStorage.getItem(key).split(',');

    for (let i = 0; i < seq.length; i++) {
      if (cash[i] === '0') {
        seq[i] = 0;
        continue;
      }
      if (seq[i].innerHTML !== '') {
        seq[i] = 0;
        continue;
      }
    }
  } else {
    seq = getCells();

    for (let i = 0; i < seq.length; i++) {
      if (seq[i].innerHTML !== '') {
        seq[i] = 0;
      }
    }
  }

  seq = seq.filter((cell) => cell !== 0);

  return seq;
}

function enableCells(yes) {
  if (yes) {
    getCells().forEach((cell) => {
      if (cell.innerHTML === '') {
        cell.parentElement.addEventListener('click', playerMove, true);
      }
    });
    return;
  }

  if (!yes) {
    getCells().forEach((cell) => {
      cell.parentElement.removeEventListener('click', playerMove, true);
    });
    return;
  }
}
enableCells(true);

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

  if (winners === 'resign') {
    state = 'win';
    document.querySelector('#gamefield caption').innerHTML =
      'You won! Another game?';
    createResult(state);
    setCash();
    return;
  }

  if (winners[0].innerHTML === getCurrent()) {
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

  setCash();
}

function createResults() {
  const table = document.querySelector('#results tbody');
  let num = 0;
  let winSum = 0;

  return function (state) {
    if (state === 'win') winSum++;
    table.innerHTML += `<tr class="${state}"><td>${++num}</td><td>${state}</td><td>${
      Math.round((winSum / num) * 100) + '%'
    }</td></tr>`;
  };
}

function checkWin() {
  let patterns = [];
  let cells = getCells();
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

  return function () {
    let field = [].concat(cells);
    field = field.filter((cell) => cell.innerHTML === '');

    if (field.length < 1) {
      endGame(null);
    }

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
  };
}

function resign() {
  let field = getCells();
  field = field.filter((cell) => cell.innerHTML === '');

  if (field.length < 1) {
    endGame(null);
    return;
  }

  endGame('resign');
}

function playerMove(event) {
  enableCells(false);
  event.target.querySelector('span').innerHTML = getCurrent();
  document.querySelector('.prelast')?.classList.remove('prelast');
  document.querySelector('.last')?.classList.add('prelast');
  document.querySelector('.prelast')?.classList.remove('last');
  event.target.classList.add('last');
  let win = checkWinner();
  if (win) {
    endGame(win);
    return;
  }
  nextMove();
}

function clearCash() {
  let button = document.querySelector('#newsession');
  let table = document.querySelector('#results tbody');

  button.addEventListener('click', () => {
    localStorage.clear();
    table.innerHTML = '';
    createResult = createResults();
  });
}
