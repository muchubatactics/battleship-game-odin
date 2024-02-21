/**
 * 
 * the x, y co-ordinate system in this code 
 * works with the origin being in the top left
 * board 2d array is indexed with (y,x) not (x,y)
 * all functions take in (x,y) not (y,x) although
 * inconsitent? yeah
 * 
**/

import './style.css';

const helpers = require('./helper.js');
// const Gameboard = require('./gameboard.js');
const Computer = require('./computerAI.js');
const Player = require('./player.js');
// const Ship = require('./ship.js');
const computer = Computer();
const player = Player();

let boats = document.querySelectorAll('.boat');
let gridboxes = document.querySelectorAll('.grid1 > div');
let grid2 = document.querySelector('.grid2');
let grid1 = document.querySelector('.grid1');
let enabledrop = false;

const boatSpots = document.querySelectorAll('.spot');

const resetButton = document.querySelector('.reset');
const randomiseButton = document.querySelector('.randomise');
const playButton = document.querySelector('.play');

const notifications = document.querySelector('.header .notifications');

disableGrid(grid2);

function handleDragStart(event) {
  this.style.opacity = '0.2';
  this.classList.add('temp');
  if (this.getAttribute('data-placed') == '1') {
    player.getGameboard().removeShip(
      helpers.numToXY(
        this.parentElement.getAttribute('data-val')
      ),
      helpers.getEnd(
        helpers.numToXY(
          this.parentElement.getAttribute('data-val')
        ),
        this.getAttribute('data-orient'),
        this.getAttribute('data-length')
      )
    );
  }

}

function handleDragEnd(event) {
  this.style.opacity = '1';
  this.classList.remove('temp');
  if (!this.parentElement.classList.contains('spot')) {
    let num = Number(this.parentElement.getAttribute('data-val'));
    player.getGameboard().placeShip(
      helpers.numToXY(num),
      helpers.getEnd(
        helpers.numToXY(num),
        this.getAttribute('data-orient'),
        this.getAttribute('data-length')
      )
    );
    this.setAttribute('data-placed', '1');
  }

  gridboxes.forEach((x) => {
    x.classList.remove('over');
    x.style.cssText = '';
  });

  let test = 0;
  boatSpots.forEach((spot) => {
    if (spot.children.length > 0) test++;
  });

  if (!test) {
    setTimeout(() => {
      playButton.removeAttribute('disabled');
      document.querySelector('.contents').style.display = 'none';
    }, 500);
  }

}

function handleDragEnter(event) {
  let boat = document.querySelector('.temp');
  let length = Number(boat.getAttribute('data-length'));
  let orientation = boat.getAttribute('data-orient');
  let boxVal = Number(this.getAttribute('data-val'));
  let coordinates = helpers.numToXY(boxVal);

  let end = helpers.getEnd(coordinates, orientation, length);
  
  if (player.getGameboard().validPlacement(coordinates, end)) {
    helpers.shadeArea(coordinates, end);
    enabledrop = true;
  } else {
    enabledrop = false;
  }
}

function handleDragLeave(event) {
  let boat = document.querySelector('.temp');
  let length = Number(boat.getAttribute('data-length'));
  let orientation = boat.getAttribute('data-orient');
  let boxVal = Number(this.getAttribute('data-val'));
  let coordinates = helpers.numToXY(boxVal);

  let end = helpers.getEnd(coordinates, orientation, length);
  helpers.unshadeArea(coordinates, end);
  
}

function handleDragOver(event) {
  if (!enabledrop) return;
  event.preventDefault();
  return false;
}

function handleDrop(event) {
  if (!enabledrop) return;
  let boat = document.querySelector('.temp');

  event.preventDefault();
  event.stopPropagation();
  this.appendChild(boat);

  if (boat.getAttribute('data-placed') == '0') {
    boat.addEventListener('click', handleClick);
  }

  return false;
}

boats.forEach((boat) => {
  boat.addEventListener('dragstart', handleDragStart);
  boat.addEventListener('dragend', handleDragEnd);
});



function handleClick(event) {
  event.stopPropagation();
  let possible = false;
  let orientation = this.getAttribute('data-orient');
  let length = Number(this.getAttribute('data-length'));
  let boxVal = Number(this.parentElement.getAttribute('data-val'));
  let coordinates = helpers.numToXY(boxVal);

  player.getGameboard().removeShip(coordinates, helpers.getEnd(coordinates, orientation, length));

  let end = {};
  if (orientation == 'h') {
    end.y = coordinates.y + length - 1;
    end.x = coordinates.x;
  
    if (player.getGameboard().validPlacement(coordinates, end)) {
      possible = true;
    } 
    else {
      player.getGameboard().placeShip(coordinates, helpers.getEnd(coordinates, orientation, length));
    }
  
  } else {
    end.x = coordinates.x + length - 1;
    end.y = coordinates.y;
    
    if (player.getGameboard().validPlacement(coordinates, end)) {
      possible = true;
    } 
    else {
      player.getGameboard().placeShip(coordinates, helpers.getEnd(coordinates, orientation, length));
    }
  
  }

  if (possible) {
    let h = this.getAttribute('data-h');
    let w = this.getAttribute('data-w');
    this.style.height = w + 'px';
    this.setAttribute('data-h', w);
    this.style.width = h + 'px';
    this.setAttribute('data-w', h);

    if (orientation == 'h') {
      this.setAttribute('data-orient', 'v');
    } else {
      this.setAttribute('data-orient', 'h');
    }
    player.getGameboard().placeShip(coordinates, end);
  } else {
    this.classList.add('animate');
    setTimeout(() => {
      this.classList.remove('animate');
    }, 200)
  }
}


// sync dom grid basing on js grid
function syncDomGrid() {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (player.getGameboard().getBoard()[i][j].ship) {
        
        if (i != 0) {
          if (player.getGameboard().getBoard()[i - 1][j].ship) continue;
        }
        if (j != 0) {
          if (player.getGameboard().getBoard()[i][j - 1].ship) continue;
        }

        let length = player.getGameboard().getBoard()[i][j].ship.length;
        let orient;
        if (j != 9) {
          orient = player.getGameboard().getBoard()[i][j + 1].ship ? 'h' : 'v';
        } else orient = 'v';
        let boxVal = helpers.xyToNum(j, i);
        
        let dict = ['zero', 'one', 'two', 'three', 'four', 'five'];
        let boat;
        if (length != 3) {
          boat = document.querySelector(`.boat.${dict[length]}`);
        } else {
          boat = document.querySelector(`.boat.three[data-placed="0"]`);
        }

        if (orient == 'v') {
          let h = boat.getAttribute('data-h');
          let w = boat.getAttribute('data-w');
          boat.style.height = w + 'px';
          boat.setAttribute('data-h', w);
          boat.style.width = h + 'px';
          boat.setAttribute('data-w', h);
          boat.setAttribute('data-orient', 'v');
        }

        document.querySelector(`.grid1 [data-val="${boxVal}"]`).appendChild(boat);
        boat.setAttribute('data-placed', '1');
        boat.addEventListener('click', handleClick);
      }
    }
  }
}

function resetGrid() {
  player.getGameboard().removeAllShips();
  let dict = ['two', 'three', 'three', 'four', 'five'];
  let boat;
  for (let i = 0; i < 5; i++) {
    if (i != 2) {
      boat = document.querySelector(`.boat.${dict[i]}`);
      if (boat.parentElement.classList.contains('spot')) continue;
      document.querySelector(`.spot.${dict[i]}`).appendChild(boat);
    } else {
      boat = document.querySelector('.boat.three[data-placed="1"]');
      if (!boat) continue;
      if (boat.parentElement.classList.contains('spot')) continue;
      let x = document.querySelector(`.spot.three .boat`);
      document.querySelectorAll('.spot.three').forEach((y) => {
        if (y !== x) {
          y.appendChild(boat);
        }
      });
    }

    boat.setAttribute('data-placed', '0');
    boat.setAttribute('data-orient', 'h')
    let w = Number(boat.getAttribute('data-w'));
    let h = Number(boat.getAttribute('data-h'));
    let temp = w;
    w = w > h ? w : h;
    h = temp == w ? h : temp;
    boat.setAttribute('data-w', w);
    boat.setAttribute('data-h', h);

    boat.style.height = h + 'px';
    boat.style.width = w + 'px';
    boat.removeEventListener('click', handleClick)
  } 
}

function removeAllEventListeners() {
  gridboxes.forEach((box) => {
    box.removeEventListener('dragenter', handleDragEnter);
    box.removeEventListener('dragleave', handleDragLeave);
    box.removeEventListener('dragover', handleDragOver);
    box.removeEventListener('drop', handleDrop);
  });

  boats.forEach((boat) => {
    boat.removeEventListener('dragstart', handleDragStart);
    boat.removeEventListener('dragend', handleDragEnd);
    boat.removeEventListener('click', handleClick);
    boat.removeAttribute('draggable');
  });  
}

function disableButtons() {
  resetButton.setAttribute('disabled', 'true');
  randomiseButton.setAttribute('disabled', 'true');
  playButton.setAttribute('disabled', 'true');
}

function disableGrid(grid) {
  grid.classList.add('disabled');
}

function enableGrid(grid) {
  grid.classList.remove('disabled');
}

function randomise() {
  resetGrid();
  player.randomlyPlaceShips();
  syncDomGrid();
  document.querySelector('.contents').style.display = 'none';
  playButton.removeAttribute('disabled');
}

randomise();

gridboxes.forEach((box) => {
  box.addEventListener('dragenter', handleDragEnter);

  box.addEventListener('dragleave', handleDragLeave);

  box.addEventListener('dragover', handleDragOver);

  box.addEventListener('drop', handleDrop);

});

randomiseButton.addEventListener('click', randomise);

resetButton.addEventListener('click', () => {
  document.querySelector('.contents').style.cssText = '';
  playButton.setAttribute('disabled', 'true');
  resetGrid();
});

playButton.addEventListener('click', () => {
  removeAllEventListeners();
  disableButtons();
  enableGrid(grid2);
  grid1.classList.add('nodrag');
  
  computer.randomlyPlaceShips();
  // computer.printBoard();

  document.querySelectorAll('.grid2 > div').forEach((box) => {
    box.addEventListener('click', attackClick);
  });
  
  document.querySelectorAll('.showprogress').forEach((div) => {
    div.style.cssText = '';
  });

  notifications.textContent = 'Good luck!';
});

function attackClick() {
  let boxnum = Number(this.getAttribute('data-val'));
  
  this.removeEventListener('click', attackClick);
  if (player.attack(computer, helpers.numToXY(boxnum))) {
    const first = document.createElement('div');
    first.classList.add('st');
    const second = document.createElement('div');
    second.classList.add('nd');
  
    this.classList.add('correcthit');
    this.appendChild(first);
    this.appendChild(second);

    autoSolve(boxnum, grid2, player, computer);

    let shipx = computer.getGameboard().getShipFromNum(boxnum);
    if (shipx.isSunk()) {
      paintSink(computer, shipx, boxnum);

      let representation = document.querySelector(`.showprogress.two .rep${shipx.length}[data-sunk='false']`);
      representation.querySelectorAll('div').forEach((div) => {
        div.style.backgroundColor = 'red';
      });

      representation.setAttribute('data-sunk', 'true');
      if (computer.lossCondition()) {
        handleLoss(computer);
      }
    }
  } else {

    const blackdot = document.createElement('div');
    blackdot.classList.add('blackdot');
    
    enableGrid(grid1);
    disableGrid(grid2);
    this.classList.add('wronghit');
    this.appendChild(blackdot);
    let xy = computer.ai(player);
    console.log('computer ai returns: ', xy);
    
    if (player.getGameboard().getBoard()[xy.y][xy.x].isHit) console.log('IMPOSSIBLE');

    let box = document.querySelector(`.grid1 [data-val='${helpers.xyToNum(xy.x, xy.y)}']`);

    setTimeout(() => {
      continousComputer(xy, box);
      enableGrid(grid2);
      disableGrid(grid1);
    }, 1000);

  }
};

function paintSink(player, ship, num) {
  num = Number(num);
  //end does not even matter

  let length = ship.length;
  let orientation;
  let start;
  let end;

  if (player == computer) {
    let res = beforeAfter(num);
    let l, r;
    if (res.before) l = document.querySelector(`.grid2 [data-val='${res.before}']`);
    if (res.after) r = document.querySelector(`.grid2 [data-val='${res.after}']`);
    let left, right;
    if (l) left = l.childNodes.length > 1;
    if (r) right = r.childNodes.length > 1;

    orientation = (left || right) ? 'h' : 'v';

    start = num;
    let x = num;

    let temp = document.querySelector(`.grid2 [data-val='${x}']`);
    if (orientation == 'h') {
      while(temp && temp.childNodes.length > 1) {
        x = x - 1;
        start = x;
        temp = document.querySelector(`.grid2 [data-val='${x}']`);
      }
      start++;

      while(!checkSameRow(num, start)) start++;

      end = start + length - 1;
    } else {
      while(temp && temp.childNodes.length > 1) {
        x = x - 10;
        start = x;
        temp = document.querySelector(`.grid2 [data-val='${x}']`);
      }
      start += 10;
      end = start + ((length - 1) * 10)
    }

    let paint = document.createElement('div');
    paint.classList.add('grid2boat');
    let xx;
    switch (length) {
      case 2:
        xx = 69;
        break;
      case 3:
        xx = 104;
        break;
      case 4:
        xx = 139;
        break;
      case 5:
        xx = 174;
        break;
    }
    if (orientation == 'h') {
      paint.style.height = '33px';
      paint.style.width = `${xx}px`;
    } else {
      paint.style.width = '33px';
      paint.style.height = `${xx}px`;
    }

    document.querySelector(`.grid2 [data-val='${start}']`).appendChild(paint);

  } else {
    let res = beforeAfter(num);
    let l, r;
    if (res.before) l = document.querySelector(`.grid1 [data-val='${res.before}']`);
    if (res.after) r = document.querySelector(`.grid1 [data-val='${res.after}']`);
    let left, right;
    if (l) left = l.childNodes.length > 1;
    if (r) right = r.childNodes.length > 1;

    orientation = (left || right) ? 'h' : 'v';
    start = num;
    let x = num;
    let temp = document.querySelector(`.grid1 [data-val='${x}']`);

    if (orientation == 'h') {
      while(temp && temp.childNodes.length > 1) {
        x = x - 1;
        start = x;
        temp = document.querySelector(`.grid1 [data-val='${x}']`);
      }
      start++;

      while(!checkSameRow(num, start)) start++;
      
    } else {
      while(temp && temp.childNodes.length > 1) {
        x = x - 10;
        start = x;
        temp = document.querySelector(`.grid1 [data-val='${x}']`);
      }
      start += 10;
    }
    document.querySelector(`.grid1 [data-val='${start}']`).childNodes[0].classList.add('ownhit');
  }
}

function handleLoss(loser) {

  document.querySelectorAll('.grid2 > div').forEach((box) => {
    box.removeEventListener('click', attackClick);
  });

  if (loser == player) {
    notifications.style.backgroundColor = 'red';
    notifications.textContent = 'You lose.';
  } else {
    notifications.style.backgroundColor = 'yellowgreen';
    notifications.textContent = 'You win!';
  }

  let rematch = document.createElement('button');
  rematch.textContent = 'Play again!';
  rematch.classList.add('rematch');
  rematch.addEventListener('click', () => {
    window.location.reload();
  });

  notifications.appendChild(rematch);
  
}

function continousComputer(xy, box) {
  if (computer.attack(player, xy)) {
    const first = document.createElement('div');
    first.classList.add('st');
    const second = document.createElement('div');
    second.classList.add('nd');

    box.classList.add('correcthit');
    box.appendChild(first);
    box.appendChild(second);

    autoSolve(Number(box.getAttribute('data-val')), grid1, computer, player);

    let shipx = player.getGameboard().getShipFromNum(helpers.xyToNum(xy.x, xy.y));
    if (shipx.isSunk()) {
      paintSink(player, shipx, helpers.xyToNum(xy.x, xy.y));

      let representation = document.querySelector(`.showprogress.one .rep${shipx.length}[data-sunk='false']`);
      representation.querySelectorAll('div').forEach((div) => {
        div.style.backgroundColor = 'red';
      });

      representation.setAttribute('data-sunk', 'true');

      if (player.lossCondition()) {
        handleLoss(player);
        return;
      }
    }

    setTimeout(() => {
      let xy = computer.ai(player);
      console.log('computer ai returns: ', xy);
      
      if (player.getGameboard().getBoard()[xy.y][xy.x].isHit) console.log('IMPOSSIBLE');

      let box = document.querySelector(`.grid1 [data-val='${helpers.xyToNum(xy.x, xy.y)}']`);
      return continousComputer(xy, box);
    }, 500);
  } else {

    const blackdot = document.createElement('div');
    blackdot.classList.add('blackdot');

    box.classList.add('wronghit');
    box.appendChild(blackdot);
  }
}

function autoSolve(num, grid, attacker, enemy) {
  let xy = helpers.numToXY(num);
  let arr = getToBeAutoSolved(xy);


  if (enemy.getGameboard().getBoard()[xy.y][xy.x].ship.isSunk()) {

    let l, r, orientation, start, end;
    let length = enemy.getGameboard().getBoard()[xy.y][xy.x].ship.length;
    if (enemy == computer) {
      let res = beforeAfter(num);
      let l, r;
      if (res.before) l = document.querySelector(`.grid2 [data-val='${res.before}']`);
      if (res.after) r = document.querySelector(`.grid2 [data-val='${res.after}']`);

      let left, right;
      if (l) left = l.childNodes.length > 1;
      if (r) right = r.childNodes.length > 1;

      orientation = (left || right) ? 'h' : 'v';

      start = num;
      let x = num;

      let temp = document.querySelector(`.grid2 [data-val='${x}']`);
      if (orientation == 'h') {
        while(temp && temp.childNodes.length > 1) {
          x = x - 1;
          start = x;
          temp = document.querySelector(`.grid2 [data-val='${x}']`);
        }
        start;
        end = start + length + 1;

        if (!checkSameRow(num, start)) start = null;
        if (!checkSameRow(num, end)) end = null;

      } else {
        while(temp && temp.childNodes.length > 1) {
          x = x - 10;
          start = x;
          temp = document.querySelector(`.grid2 [data-val='${x}']`);
        }
        start;
        end = start + ((length - 1) * 10) + 20;
      }
    } else {
      let res = beforeAfter(num);
      let l, r;
      if (res.before) l = document.querySelector(`.grid1 [data-val='${res.before}']`);
      if (res.after) r = document.querySelector(`.grid1 [data-val='${res.after}']`);
      let left, right;
      if (l) left = l.childNodes.length > 1;
      if (r) right = r.childNodes.length > 1;
  
      orientation = (left || right) ? 'h' : 'v';
  
      start = num;
      let x = num;
  
      let temp = document.querySelector(`.grid1 [data-val='${x}']`);
      if (orientation == 'h') {
        while(temp && temp.childNodes.length > 1) {
          x = x - 1;
          start = x;
          temp = document.querySelector(`.grid1 [data-val='${x}']`);
        }
        start;
        end = start + length + 1;

        if (!checkSameRow(num, start)) start = null;
        if (!checkSameRow(num, end)) end = null;

      } else {
        while(temp && temp.childNodes.length > 1) {
          x = x - 10;
          start = x;
          temp = document.querySelector(`.grid1 [data-val='${x}']`);
        }
        start;
        end = start + ((length - 1) * 10) + 20;
      }
    }

    if (start && 0 < start && start < 100) {
      arr.push(start);
    }
    if (end && 0 < end  && end < 100) {
      arr.push(end);
    }

  }

  arr.forEach((x) => {
    let y = grid.querySelector(`[data-val='${x}']`);
    if (y && !y.childNodes.length) {
      attacker.attack(enemy, helpers.numToXY(x));
      const blackdot = document.createElement('div');
      blackdot.classList.add('blackdot');
      y.appendChild(blackdot);
      y.classList.add('autosolve');

      y.removeEventListener('click', attackClick);
    }
  })
}

function getToBeAutoSolved(xy) {
  let arr = [];
  arr.push({x: xy.x - 1, y: xy.y - 1});
  arr.push({x: xy.x - 1, y: xy.y + 1});
  arr.push({x: xy.x + 1, y: xy.y - 1});
  arr.push({x: xy.x + 1, y: xy.y + 1});
  arr.forEach((obj) => {
    if (obj.x > 9 || obj.x < 0) {
      obj.invalid = true;
    }
    if (obj.y > 9 || obj.y < 0) {
      obj.invalid = true;
    }
  });
  return arr.filter((obj) => {
    return !obj.invalid;
  }).map((obj) => {
    return helpers.xyToNum(obj.x, obj.y);
  })
}

function beforeAfter(num) {
  let xy = helpers.numToXY(num);
  let before = {x: xy.x - 1, y: xy.y};
  let after = {x: xy.x + 1, y: xy.y};

  if (!(before.x >= 0 && before.x <= 9)) before = null;
  if (!(after.x >= 0 && after.x <= 9)) after = null;

  if (before) before = helpers.xyToNum(before.x, before.y);
  if (after) after = helpers.xyToNum(after.x, after.y);

  return {before, after};
}

function checkSameRow(num1, num2) {
  let a = Math.floor(num1 / 10);
  let b = Math.floor(num2 / 10);
  return a == b;
}
