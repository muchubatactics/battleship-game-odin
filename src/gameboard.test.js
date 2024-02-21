const Gameboard = require('./gameboard.js');

test('get length and orientation', () => {
  let gb = Gameboard();
  let start = {x:1, y:1}, end = {x:1, y:3};
  expect(gb.getLenAndDirection(start, end)).toEqual({horizontal: false, length: 3});
  end = {x:2, y:1};
  expect(gb.getLenAndDirection(start, end)).toEqual({horizontal: true, length: 2});
});

test('place Ship', () => {
  let gb = Gameboard();
  let start = {x:1, y:1}, end = {x:1, y:3};
  gb.placeShip(start, end);
  expect(gb.getBoard()[1][1].ship).toBeTruthy();
  expect(gb.getBoard()[2][1].ship).toBeTruthy();
  expect(gb.getBoard()[3][1].ship).toBeTruthy();
  expect(gb.getBoard()[4][1].ship).toBeFalsy();
});

test('Recieve Attack', () => {
  let gb = Gameboard();
  let start = {x:1, y:1}, end = {x:1, y:3};
  gb.placeShip(start, end);
  gb.receiveAttack(1,1);
  gb.receiveAttack(1,2);
  expect(gb.getBoard()[1][1].ship.hits).toBe(2);
  expect(gb.getBoard()[1][1].isHit).toBe(true);
  expect(gb.getBoard()[2][1].isHit).toBe(true);
  expect(gb.getBoard()[1][2].isHit).toBe(false);
});

test('board Coordinates', () => {
  let gb = Gameboard();
  expect(gb.getBoard()[0][0].x).toBe(0);
  expect(gb.getBoard()[0][0].y).toBe(0);
  expect(gb.getBoard()[1][3].x).toBe(3);
  expect(gb.getBoard()[1][3].y).toBe(1);
  expect(gb.getBoard()[7][4].x).toBe(4);
  expect(gb.getBoard()[7][4].y).toBe(7);
});

test('all ships sunk test', () => {
  let gb = Gameboard();
  gb.placeShip({x:1, y:1}, {x:1, y:4});
  gb.placeShip({x:0, y:0}, {x:2, y:0});
  expect(gb.allShipsSunk()).toBe(false);
  gb.receiveAttack(0,0);
  gb.receiveAttack(1,0);
  gb.receiveAttack(2,0);
  gb.receiveAttack(1,1);
  gb.receiveAttack(1,2);
  gb.receiveAttack(1,3);
  expect(gb.allShipsSunk()).toBe(false);
  gb.receiveAttack(1,4);
  expect(gb.allShipsSunk()).toBe(true);
});

test('valid Placement', () => {
  let gb = Gameboard();
  gb.placeShip({x:1, y:1}, {x:1, y:4});
  gb.placeShip({x:3, y:0}, {x:5, y:0});

  expect(gb.validPlacement({x:2, y:0}, {x:2, y:3})).toBe(false);
  expect(gb.validPlacement({x:1, y:2}, {x:3, y:2})).toBe(false);
  expect(gb.validPlacement({x:3, y:2}, {x:5, y:2})).toBe(true);

});