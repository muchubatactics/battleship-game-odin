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
  computer.printBoard();

  document.querySelectorAll('.grid2 > div').forEach((box) => {
    box.addEventListener('click', attackClick);
  });
  
});

function attackClick() {
  /**
   * accept shot, to computer grid
   * shade computer grid accordingly
   * all this time disable more clicks for some time
   * let the computer attack player grid
   * shade player grid accordingly
   * 
   * allow further shots
   */
  
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

    let shipx = computer.getGameboard().getShipFromNum(boxnum);
    if (shipx.isSunk()) {
      paintSink(computer, shipx, boxnum);
    }
  } else {

    const blackdot = document.createElement('div');
    blackdot.classList.add('blackdot');
    
    enableGrid(grid1);
    disableGrid(grid2);
    this.classList.add('wronghit');
    this.appendChild(blackdot);
    let xy = computer.ai();
    let box = document.querySelector(`.grid1 [data-val='${helpers.xyToNum(xy.x, xy.y)}']`);

    setTimeout(() => {
      if (computer.attack(player, xy)) {
        const first = document.createElement('div');
        first.classList.add('st');
        const second = document.createElement('div');
        second.classList.add('nd');

        box.classList.add('correcthit');
        box.appendChild(first);
        box.appendChild(second);

        let shipx = player.getGameboard().getShipFromNum(helpers.xyToNum(xy.x, xy.y));
        if (shipx.isSunk()) {
          paintSink(player, shipx, helpers.xyToNum(xy.x, xy.y));
        }
      } else {

        const blackdot = document.createElement('div');
        blackdot.classList.add('blackdot');

        box.classList.add('wronghit');
        box.appendChild(blackdot);
      }
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
    let l = document.querySelector(`.grid2 [data-val='${num - 1}']`);
    let r = document.querySelector(`.grid2 [data-val='${num + 1}']`);
    console.log(l, r);
    let left, right;
    if (l) left = l.childNodes.length > 1;
    if (r) right = r.childNodes.length > 1;

    orientation = (left || right) ? 'h' : 'v';

    console.log('orient: ', orientation);


    start = num;
    let x = num;
    console.log('start: ',start);

    let temp = document.querySelector(`.grid2 [data-val='${x}']`);
    if (orientation == 'h') {
      while(temp && temp.childNodes.length > 1) {
        x = x - 1;
        start = x;
        temp = document.querySelector(`.grid2 [data-val='${x}']`);
      }
      start++;
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
    console.log('start: ',start);

    let paint = document.createElement('div');
    paint.classList.add('grid2boat');
    let xx;
    switch (length) {
      case 2:
        xx = 48;
        break;
      case 3:
        xx = 73;
        break;
      case 4:
        xx = 98;
        break;
      case 5:
        xx = 123;
        break;
    }
    if (orientation == 'h') {
      paint.style.height = '23px';
      paint.style.width = `${xx}px`;
    } else {
      paint.style.width = '23px';
      paint.style.height = `${xx}px`;
    }
    console.log('start: ',start);

    document.querySelector(`.grid2 [data-val='${start}']`).appendChild(paint);

  } else {
    let l = document.querySelector(`.grid1 [data-val='${num - 1}']`);
    let r = document.querySelector(`.grid1 [data-val='${num + 1}']`);
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
    } else {
      while(temp && temp.childNodes.length > 1) {
        x = x - 10;
        start = x;
        temp = document.querySelector(`.grid1 [data-val='${x}']`);
      }
    }
    start++;
    document.querySelector(`.grid1 [data-val='${start}']`).childNodes[0].classList.add('ownhit');
  }
}