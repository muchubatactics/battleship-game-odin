const Ship = require('./ship.js');
const helpers = require('./helper.js');

function Gameboard() {
  let board = [[], [], [], [], [], [], [], [], [], []];
  const boardHeight = 10;
  const boardWidth = 10;

  function Cell(x, y) {
    return {
      x: x,
      y: y,
      isHit: false,
      ship: null,
    };
  }

  for (let i = 0; i < boardHeight; i++) {
    for (let j = 0; j < boardWidth; j++) {
      board[i].push(Cell(j, i));
    }
  }

  function printBoard() {
    let ss = '';
    for (let i = 0; i < 10; i++) {
      let str = '';
      for (let j = 0; j < 10; j++) {
        if (this.getBoard()[i][j].ship) {
          str += 'X ';
        } else str += 'O ';
      }
      ss += str;
      ss += '\n';
    }
    console.log(ss);
  }

  function getLenAndDirection(start, end) {
    let horizontal = start.x == end.x ? false : true;
    let length = ( horizontal ? end.x - start.x : end.y - start.y ) + 1;
    return {horizontal, length};
  }

  function placeShip(start, end) {
    let {horizontal, length} = getLenAndDirection(start, end);
    let ship = Ship(length);
    if (horizontal) {
      for (let i = start.x; i <= end.x; i++) {
        if (board[start.y][i].ship) throw new Error('ship already exists');
        board[start.y][i].ship = ship;
      }
    } else {
      for (let i = start.y; i <= end.y; i++) {
        if (board[i][start.x].ship) throw new Error('ship already exists');
        board[i][start.x].ship = ship;
      }
    }
  }

  function removeShip(start, end) {
    let {horizontal, length} = getLenAndDirection(start, end);
    if (horizontal) {
      for (let i = start.x; i <= end.x; i++) {
        board[start.y][i].ship = null;
      }
    } else {
      for (let i = start.y; i <= end.y; i++) {
        board[i][start.x].ship = null;
      }
    }
  }

  function removeAllShips() {
    for (let i = 0; i < boardHeight; i++) {
      for (let j = 0; j < boardWidth; j++) {
        board[i][j].ship = null;
        board[i][j].isHit = false;
      }
    }
  }

  function receiveAttack(x,y) {
    board[y][x].isHit = true;
    if(board[y][x].ship) {
      board[y][x].ship.hit();
      return true;
    }
    return false;
  }

  function getBoard() {
    return board;
  }

  function allShipsSunk() {
    for (let i = 0; i < boardHeight; i++) {
      for (let j = 0; j < boardWidth; j++) {
        if (board[i][j].ship) {
          if (!board[i][j].ship.sunk) return false;
        }
      }
    }
    return true;
  }

  function validPlacement(start, end) {
    if (start.x > 9 || start.y > 9 || end.x > 9 || end.y > 9) return false;
    if (start.x < 0 || start.y < 0 || end.x < 0 || end.y < 0) return false;
    let {horizontal, length} = getLenAndDirection(start, end);
    if (horizontal) {
      for (let i = start.x - 1; i <= end.x + 1; i++) {
        if (i < 0) continue;
        if (i > 9) continue;
        if (board[start.y][i].ship) return false;

        if (start.y - 1 >= 0) {
          if (board[start.y - 1][i].ship) return false;
        }
        if (start.y + 1 <= 9) {
          if (board[start.y + 1][i].ship) return false;
        }
      }
    } else {
      for (let i = start.y - 1; i <= end.y + 1; i++) {
        if (i < 0) continue;
        if (i > 9) continue;
        if (board[i][start.x].ship) return false;

        if (start.x - 1 >= 0) {
          if (board[i][start.x - 1].ship) return false;
        }
        if (start.x + 1 <= 9) {
          if (board[i][start.x + 1].ship) return false;
        }
      }
    }
    return true;
  }

  function getShipFromNum(num) {
    let a = helpers.numToXY(num);
    return board[a.y][a.x].ship;
  }

  return {
    getLenAndDirection, placeShip, getBoard, receiveAttack,
    allShipsSunk, validPlacement, removeShip, printBoard,
    removeAllShips, getShipFromNum,
  }
};

module.exports = Gameboard;