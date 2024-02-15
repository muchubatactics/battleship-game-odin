/**
 * 
 * the x, y co-ordinate system in this code 
 * works with the origin being in the top left
 * board 2d array is indexed with (y,x) not (x,y)
 * all functions take in (x,y) not (y,x) although
 * inconsitent? yeah
 * 
**/

const helpers = require('./helper.js');
const Gameboard = require('./gameboard.js');
const Computer = require('./computerAI.js');
const Player = require('./player.js');
const Ship = require('./ship.js');

let gm = Gameboard();

let boats = document.querySelectorAll('.boat');

function handleDragStart(event) {
  this.style.opacity = '0.2';
  this.classList.add('temp');
  if (this.getAttribute('data-placed') == '1') {
    gm.removeShip(
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

  console.log('drag start');
  gm.printBoard();
  console.log('end of drag start');
}

function handleDragEnd(event) {
  this.style.opacity = '1';
  this.classList.remove('temp');
  if (!this.parentElement.classList.contains('spot')) {
    let num = Number(this.parentElement.getAttribute('data-val'));
    gm.placeShip(
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

  console.log('drag end');
  gm.printBoard();
  console.log('end of drag  end');
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
    
    if (gm.validPlacement(coordinates, end)) {
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
      boat.addEventListener('click', (event) => {
        event.stopPropagation();
        let possible = false;
        let orientation = boat.getAttribute('data-orient');
        let length = Number(boat.getAttribute('data-length'));
        let boxVal = Number(boat.parentElement.getAttribute('data-val'));
        let coordinates = helpers.numToXY(boxVal);

        gm.removeShip(coordinates, helpers.getEnd(coordinates, orientation, length));
  
        let end = {};
        if (orientation == 'h') {
          end.y = coordinates.y + length - 1;
          end.x = coordinates.x;
        
          if (gm.validPlacement(coordinates, end)) {
            possible = true;
          } 
          else {
            console.log('here')
            gm.placeShip(coordinates, helpers.getEnd(coordinates, orientation, length));
          }
        
        } else {
          end.x = coordinates.x + length - 1;
          end.y = coordinates.y;
          
          if (gm.validPlacement(coordinates, end)) {
            possible = true;
          } 
          else {
            console.log('here')
            gm.placeShip(coordinates, helpers.getEnd(coordinates, orientation, length));
          }
        
        }
  
        if (possible) {
          let h = boat.getAttribute('data-h');
          let w = boat.getAttribute('data-w');
          boat.style.height = w + 'px';
          boat.setAttribute('data-h', w);
          boat.style.width = h + 'px';
          boat.setAttribute('data-w', h);
  
          if (orientation == 'h') {
            boat.setAttribute('data-orient', 'v');
          } else {
            boat.setAttribute('data-orient', 'h');
          }
          gm.placeShip(coordinates, end);
        } else {
          boat.classList.add('animate');
          setTimeout(() => {
            boat.classList.remove('animate');
          }, 200)
        }

        console.log('toggle');
  gm.printBoard();
  console.log('end of drag toggle');
      });
    }

    console.log('drag drop');
  gm.printBoard();
  console.log('end of drag drop');

    return false;
  });

});