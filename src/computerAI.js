/**
 * 
**/
const helpers = require('./helper.js');
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

  function straightAI(enemy) {
    let x = straightAIX;
    let y = straightAIY;

    if (straightAIX + 1 > 9) {
      straightAIX = 0;
      straightAIY++;
    } else straightAIX++;

    if (enemy) {
      while (enemy.getGameboard().getBoard()[y][x].isHit) {
        x = straightAIX;
        y = straightAIY;

        if (straightAIX + 1 > 9) {
          straightAIX = 0;
          straightAIY++;
        } else straightAIX++;
      }
    }

    return {x,y};
  }
  
  /**
   * smartHistory
   * -xy (current)
   * -top, left, right, bottom (of cirrent)
   * -found
   *  -orient (h / v)
   *  -start
   *  -next
   *  -streak (boolean)
   *  -currop (- / +) //set it when you set found
   */

  let smartHistory = null;

  function smartAI(enemy) {
    if (smartHistory && !enemy.getGameboard().getBoard()[smartHistory.found.start.y][smartHistory.found.start.x].ship.isSunk()) {
      let xy;
      if (smartHistory.found.next) {

        xy = smartHistory.found.next;
        
        // while (!isValid(xy) || enemy.getGameboard().getBoard()[xy.y][xy.x].isHit) {
        //   console.log('here in loop');
        //   if (smartHistory.found.orient == 'h') {
        //     // if (smartHistory.found.start.x > smartHistory.found.next.x) {
        //     //   xy = {x: xy.x + 1, y: xy.y};
        //     //   smartHistory.found.currop = '+';
        //     // } else {
        //     //   xy = {x: xy.x - 1, y: xy.y};
        //     //   smartHistory.found.currop = '-'; 
        //     // }

        //   }
        //   else if (smartHistory.found.start.y > smartHistory.found.next.y) {
        //     xy = {x: xy.x, y: xy.y + 1};
        //     smartHistory.found.currop = '+';
        //   } else {
        //     xy = {x: xy.x, y: xy.y - 1};
        //     smartHistory.found.currop = '-';
        //   }

        // }
        
        console.log('before new code: xy: ', xy)

        if ((!isValid(xy) || enemy.getGameboard().getBoard()[xy.y][xy.x].isHit) && smartHistory.found.streak) {
          console.log('In new code');
          if (smartHistory.found.orient == 'h') {
            if (smartHistory.found.currop == '+') {
              let count = 0;
              while ((!isValid(xy) || enemy.getGameboard().getBoard()[xy.y][xy.x].isHit) && count < 20 ) {
                xy = {x: xy.x - 1, y : xy.y};
                count++;
              }
              if (!(count < 20)) console.log('VERY MAJOR ERROR');
              smartHistory.found.currop = '-';
            } else {
              let count = 0;
              while ((!isValid(xy) || enemy.getGameboard().getBoard()[xy.y][xy.x].isHit) && count < 20 ) {
                xy = {x: xy.x + 1, y : xy.y};
                count++;
              }
              if (!(count < 20)) console.log('VERY MAJOR ERROR');
              smartHistory.found.currop = '+';
            }
          } else {
            if (smartHistory.found.currop == '+') {
              let count = 0;
              while ((!isValid(xy) || enemy.getGameboard().getBoard()[xy.y][xy.x].isHit) && count < 20 ) {
                xy = {x: xy.x, y : xy.y - 1};
                count++;
              }
              if (!(count < 20)) console.log('VERY MAJOR ERROR');
              smartHistory.found.currop = '-';
            } else {
              let count = 0;
              while ((!isValid(xy) || enemy.getGameboard().getBoard()[xy.y][xy.x].isHit) && count < 20 ) {
                xy = {x: xy.x, y : xy.y + 1};
                count++;
              }
              if (!(count < 20)) console.log('VERY MAJOR ERROR');
              smartHistory.found.currop = '+';
            }
          }
          console.log('result of new code :', xy);
        }



        if (smartHistory.found.streak) {
          if (smartHistory.found.currop == '+') smartHistory.found.next = (smartHistory.found.orient == 'h') ? {x: xy.x + 1, y: xy.y} : {x: xy.x, y: xy.y + 1};
          else smartHistory.found.next = smartHistory.found.orient == 'h' ? {x: xy.x - 1, y: xy.y} : {x: xy.x, y: xy.y - 1};
        } else {
          if (smartHistory.found.currop == '+') {
            smartHistory.found.next = smartHistory.found.orient == 'h' ? 
            {x: smartHistory.found.start.x - 1, y: smartHistory.found.start.y} : 
            {x: smartHistory.found.start.x, y: smartHistory.found.start.y - 1};
            smartHistory.found.currop = '-';

            xy = smartHistory.found.next;

            smartHistory.found.next = smartHistory.found.orient == 'h' ? 
            {x: xy.x - 1, y: xy.y} : 
            {x: xy.x, y: xy.y - 1};

          } else {
            smartHistory.found.next = smartHistory.found.orient == 'h' ? 
            {x: smartHistory.found.start.x + 1, y: smartHistory.found.start.y} : 
            {x: smartHistory.found.start.x, y: smartHistory.found.start.y + 1};
            smartHistory.found.currop = '+';

            xy = smartHistory.found.next;

            smartHistory.found.next = smartHistory.found.orient == 'h' ? 
            {x: xy.x + 1, y: xy.y} : 
            {x: xy.x, y: xy.y + 1};
          }
        }

        if (enemy.getGameboard().getBoard()[xy.y][xy.x].ship) smartHistory.found.streak = true;
        else smartHistory.found.streak = false;

      } else {
        let temp;
        if (smartHistory.top) { 
          smartHistory.found.next = smartHistory.top;
          temp = 't';
        }
        else if (smartHistory.right) { 
          smartHistory.found.next = smartHistory.right;
          temp = 'r';
        }
        else if (smartHistory.bottom) { 
          smartHistory.found.next = smartHistory.bottom; 
          temp = 'b';
        }
        else { 
          smartHistory.found.next = smartHistory.left;
          temp = 'l'
        }

        xy = smartHistory.found.next;

        if (enemy.getGameboard().getBoard()[xy.y][xy.x].ship) {
          if (temp == 't' || temp == 'l') smartHistory.found.currop = '-';
          else smartHistory.found.currop = '+';

          smartHistory.found.streak = true;
          let {horizontal, length} = comp.getGameboard().getLenAndDirection(smartHistory.found.start, smartHistory.found.next);
          smartHistory.found.orient = (horizontal) ? 'h' : 'v';

          if (horizontal) smartHistory.found.next = smartHistory.found.currop == '+' ? {x: xy.x + 1, y: xy.y} : {x: xy.x - 1, y: xy.y};
          else smartHistory.found.next = smartHistory.found.currop == '+' ? {x: xy.x, y: xy.y + 1} : {x: xy.x, y: xy.y - 1};

        } else {
          smartHistory.found.next = null;
          if (temp == 't') smartHistory.top = null;
          if (temp == 'r') smartHistory.right = null;
          if (temp == 'b') smartHistory.bottom = null;
          if (temp == 'l') smartHistory.left = null;
        }
        console.log('trying to find first next: ', JSON.stringify(smartHistory));
      }

      return xy;

    } else {
      smartHistory = null;
      let num = Math.floor(Math.random() * 100);
      let xy = helpers.numToXY(num);
      while (enemy.getGameboard().getBoard()[xy.y][xy.x].isHit) {
        num = Math.floor(Math.random() * 100);
        xy = helpers.numToXY(num);
      }


      if (enemy.getGameboard().getBoard()[xy.y][xy.x].ship) {
        let top = {x: xy.x, y: xy.y - 1};
        if (!isValid(top)) top = null;
        else if (enemy.getGameboard().getBoard()[top.y][top.x].isHit) top = null;

        let left = {x: xy.x - 1, y: xy.y};
        if (!isValid(left)) left = null;
        else if (enemy.getGameboard().getBoard()[left.y][left.x].isHit) left = null;

        let right = {x: xy.x + 1, y: xy.y};
        if (!isValid(right)) right = null;
        else if (enemy.getGameboard().getBoard()[right.y][right.x].isHit) right = null;

        let bottom = {x: xy.x, y: xy.y + 1};
        if (!isValid(bottom)) bottom = null;
        else if (enemy.getGameboard().getBoard()[bottom.y][bottom.x].isHit) bottom = null;

        let hist = {xy, top, left, right, bottom};
        hist.found = {};
        hist.found.start = xy;
        hist.found.next = null;
        smartHistory = hist;
      }
      console.log('Just found: ', JSON.stringify(smartHistory));
      return xy;
    }
  
  }

  function isValid(obj) {
    return obj.x >= 0 && obj.x < 10 && obj.y >= 0 && obj.y < 10;
  }

  comp.isValid = isValid;
  
  // comp.ai = dumbAI;
  // comp.ai = straightAI;
  comp.ai = smartAI;
  
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
