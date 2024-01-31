const Ship = require('./ship.js');

test('Ship functionality', () => {
  const temp = Ship(4);
  expect(temp.length).toBe(4);
  temp.hit();
  temp.hit();
  expect(temp.hits).toBe(2);
  expect(temp.sunk).toBe(false);
  temp.hit();
  temp.hit();
  expect(temp.sunk).toBe(true);
  temp.hit();
  temp.hit();
  temp.hit();
  expect(temp.hits).toBe(temp.length);
});