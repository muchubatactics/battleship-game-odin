const Player = require('./player.js');
const computer = require('./computerAI.js');

computer.randomlyPlaceShips();
computer.printBoard();

test('Nice! you found the easter egg!!', () => {
  expect(true).toBe(true);
})