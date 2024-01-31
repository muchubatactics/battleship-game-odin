const Ship = require('./ship.js');

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
        if (board[i][start.y].ship) throw new Error('ship already exists');
        board[i][start.y].ship = ship;
      }
    }
  }

  function receiveAttack(x,y) {
    board[y][x].isHit = true;
    if(board[y][x].ship) board[y][x].ship.hit();
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

  return {
    getLenAndDirection, placeShip, getBoard, receiveAttack,
    allShipsSunk,
  }
};

module.exports = Gameboard;