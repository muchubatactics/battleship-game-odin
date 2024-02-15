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
// const Computer = require('./computerAI.js');
const Player = require('./player.js');
// const Ship = require('./ship.js');

let player = Player();

let boats = document.querySelectorAll('.boat');

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

}

boats.forEach((boat) => {
  boat.addEventListener('dragstart', handleDragStart);
  boat.addEventListener('dragend', handleDragEnd);
});


let gridboxes = document.querySelectorAll('.grid1 > div');
let enabledrop = false;

gridboxes.forEach((box) => {
  box.addEventListener('dragenter', (event) => {
    let boat = document.querySelector('.temp');
    let length = Number(boat.getAttribute('data-length'));
    let orientation = boat.getAttribute('data-orient');
    let boxVal = Number(box.getAttribute('data-val'));
    let coordinates = helpers.numToXY(boxVal);

    let end = helpers.getEnd(coordinates, orientation, length);
    
    if (player.getGameboard().validPlacement(coordinates, end)) {
      helpers.shadeArea(coordinates, end);
      enabledrop = true;
    } else {
      enabledrop = false;
    }

  });

  box.addEventListener('dragleave', (event) => {
    let boat = document.querySelector('.temp');
    let length = Number(boat.getAttribute('data-length'));
    let orientation = boat.getAttribute('data-orient');
    let boxVal = Number(box.getAttribute('data-val'));
    let coordinates = helpers.numToXY(boxVal);

    let end = helpers.getEnd(coordinates, orientation, length);
    helpers.unshadeArea(coordinates, end);
    
  });

  box.addEventListener('dragover', (event) => {
    if (!enabledrop) return;
    event.preventDefault();
    return false;
  });

  box.addEventListener('drop', (event) => {
    if (!enabledrop) return;
    let boat = document.querySelector('.temp');

    event.preventDefault();
    event.stopPropagation();
    box.appendChild(boat);

    if (boat.getAttribute('data-placed') == '0') {
      boat.addEventListener('click', handleClick);
    }

    return false;
  });

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

        document.querySelector(`[data-val="${boxVal}"]`).appendChild(boat);
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

  // reset them to horizontallll

}

let randomiseButton = document.querySelector('.randomise');
randomiseButton.addEventListener('click', () => {
  resetGrid();
  player.randomlyPlaceShips();
  syncDomGrid();
});

let resetButton = document.querySelector('.reset');
resetButton.addEventListener('click', () => {
  resetGrid();
});
