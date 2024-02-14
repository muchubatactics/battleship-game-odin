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
}

function handleDragEnd(event) {
  this.style.opacity = '1';
  this.classList.remove('temp');

  gm.placeShip(
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

  console.log( 
  helpers.getEnd(
    helpers.numToXY(
      this.parentElement.getAttribute('data-val')
    ),
    this.getAttribute('data-orient'),
    this.getAttribute('data-length')
  ));

  this.setAttribute('data-placed', '1');

  gm.printBoard();

  gridboxes.forEach((x) => {
    x.classList.remove('over');
    x.style.cssText = '';
  })
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
        let boxVal = Number(box.getAttribute('data-val'));
        let coordinates = helpers.numToXY(boxVal);
  
        gm.removeShip(coordinates, helpers.getEnd(coordinates, orientation, length));
  
        let end = {};
        if (orientation == 'h') {
          end.y = coordinates.y + length - 1;
          end.x = coordinates.x;
          if (end.y <= 9) {
            if (gm.validPlacement(coordinates, end)) possible = true;
            else gm.placeShip(coordinates, helpers.getEnd(coordinates, orientation, length));
          }
        } else {
          end.x = coordinates.x + length - 1;
          end.y = coordinates.y;
          if (end.x <= 9) {
            if (gm.validPlacement(coordinates, end)) possible = true;
            else gm.placeShip(coordinates, helpers.getEnd(coordinates, orientation, length));
          }
        }
        console.log(end, possible);
  
        if (possible) {
          let h = boat.getAttribute('data-h');
          let w = boat.getAttribute('data-w');
          console.log('h:', h, w);
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
        } 
        console.log(gm.printBoard())
      });
    }

    boat.setAttribute('data-placed', '1');

    return false;
  });

});