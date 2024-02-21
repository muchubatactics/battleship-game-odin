/**
 * 
**/
const Gameboard = require('./gameboard.js');

function Player() {
  const gameboard = Gameboard();

  function getGameboard() {
    return gameboard;
  }

  function attack(enemy, coordinate) {
    return enemy.getGameboard().receiveAttack(coordinate.x, coordinate.y);
  }

  function lossCondition() {
    return getGameboard().allShipsSunk();
  }

  function putShipOnGameBoard(start, end) {
    gameboard.placeShip(start, end);
  }

  // gonna need a less random implementation
  // beacuse this could potentially take a while
  // or not, maybe I underestimate how fast computers are

  function randomlyPlaceShips() {
    const shipsBlueprint = [5, 4, 3, 3, 2];
    let chance, start = {x:null, y:null}, end = {x:null, y:null};
    for (let i = 0; i < shipsBlueprint.length; i++) {
      chance = Math.random() * 10;
      while (true) {
        start.x = Math.floor((Math.random())*10);
        start.y = Math.floor((Math.random())*10);

        if (chance < 5) {
          end.x = start.x + shipsBlueprint[i] - 1;
          if (end.x > 9) continue;
          end.y = start.y;
        } else {
          end.y = start.y + shipsBlueprint[i] - 1;
          if (end.y > 9) continue;
          end.x = start.x;
        }

        if (getGameboard().validPlacement(start, end)) {
          break;
        }
      }
      putShipOnGameBoard(start, end);
    }
  }


  return {
    attack, getGameboard, lossCondition,
    putShipOnGameBoard, randomlyPlaceShips,
  }
}

module.exports = Player;