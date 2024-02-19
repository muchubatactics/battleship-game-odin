/**
 * 
**/

const Player = require('./player.js');

function Computer() {
  const comp = Player();
  
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

  let straightAIX = 0;
  let straightAIY = 0;

  function straightAI() {
    console.log('called');
    let x = straightAIX;
    let y = straightAIY;

    if (straightAIX + 1 > 9) {
      straightAIX = 0;
      straightAIY++;
    } else straightAIX++;

    console.log('he:', straightAIX)

    return {x,y};
  }
  
  function smartAI() {
  
  }
  
  // comp.ai = dumbAI;
  comp.ai = straightAI;
  
  comp.attack = function attack(enemy, coordinate) {
    // if (!(coordinate.x && coordinate.y)) coordinate = this.ai();
    return enemy.getGameboard().receiveAttack(coordinate.x, coordinate.y);
  }
  
  
  comp.printBoard = function() {
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

  return comp;

}

module.exports = Computer;
