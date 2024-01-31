const Player = require('./player.js');
const Computer = require('./computerAI.js');

const computer = Computer();
computer.randomlyPlaceShips();
computer.printBoard();

test('Nice! you found the easter egg!!', () => {
  expect(true).toBe(true);
})