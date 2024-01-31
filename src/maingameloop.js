/**
 * 
 * Allow me to demonstrate the skill of shaolin
 * The special technique of shadow boxing
 * 
**/

const Computer = require('./computerAI');
const Player = require('./player.js');
const domstuff = require('./domstuff.js');

function Game() {
  let player1 = Player();
  let player2 = Computer();

  player1.randomlyPlaceShips();
  player2.randomlyPlaceShips();

  let a = domstuff.initialRender(player1);
  let b = domstuff.initialRender(player2);

  document.querySelector('.container').appendChild(a);
  document.querySelector('.container').appendChild(b);

  return {
    player1, player2
  }
}

module.exports = Game;