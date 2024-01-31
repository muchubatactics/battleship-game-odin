/**
 * 
**/

const Player = require('./player.js');

const computer = Player();

function dumbAI() {
  let x = Math.floor((Math.random())*10);
  let y = Math.floor((Math.random())*10);

  while (true) {
    if (this.getGameboard().getBoard()[y][x].isHit) {
      x = Math.floor((Math.random())*10);
      y = Math.floor((Math.random())*10);
    } else {
      break;
    }
  }

  return {x, y};
}

function smartAI() {

}

computer.ai = dumbAI;

computer.attack = function attack(enemy, coordinate) {
  coordinate = this.ai();
  enemy.getGameboard().receiveAttack(coordinate.x, coordinate.y);
}


computer.printBoard = function() {
  let ss = '';
  for (let i = 0; i < 10; i++) {
    let str = '';
    for (let j = 0; j < 10; j++) {
      if (this.getGameboard().getBoard()[i][j].ship) {
        str += 'X ';
      } else str += 'O ';
    }
    ss += str;
    ss += '\n';
  }
  console.log(ss);
}

module.exports = computer;