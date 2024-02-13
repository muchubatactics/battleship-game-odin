/**
 * 
 * the x, y co-ordinate system in this code 
 * works with the origin being in the top left
 * board 2d array is indexed with (y,x) not (x,y)
 * all functions take in (x,y) not (y,x) although
 * inconsitent? yeah
 * 
**/

const helpers = (function() {
  function numToXY(num) {
    let x = num % 10;
    let y = Math.floor(num / 10);
    return {x, y};
  }

  function xyToNum(x, y) {
    return (y * 10) + x
  }

  function getEnd(coordinates, orientation, length) {
    let end = {};
    if (orientation == 'h') {
      end.x = coordinates.x + length;
      end.y = coordinates.y;
      
      while(end.x > 9) {
        coordinates.x = coordinates.x - 1;
        end.x = end.x - 1;
      }

    } else {
      end.y = coordinates.y + length;
      end.x = coordinates.x;

      while(end.y > 9) {
        coordinates.y = coordinates.y - 1;
        end.y = end.y - 1;
      }
    }

    return end;
  }

  function shadeArea(start, end) {
    console.log(start, end)
    if (start.x == end.x) {
      for (let i = 0; i < end.y - start.y; i++) {
        let box = document.querySelector(`[data-val='${xyToNum(start.x, start.y + i)}']`);
        box.style.cssText = `
        border-left: 1px solid green;
        border-right: 1px solid green;
        opacity: 1;
        `;
        if (i == 0) {
          box.style.cssText += `
          border-top: 1px solid green;
          `;
        }

        if (i == end.x - start.x - 1) {
          box.style.cssText += `
          border-bottom: 1px solid green;
          `;
        }
      }
    } else {
      for (let i = 0; i < end.x - start.x; i++) {
        let box = document.querySelector(`[data-val='${xyToNum(start.x + i, start.y)}']`);
        box.style.cssText = `
        border-top: 1px solid green;
        border-bottom: 1px solid green;
        opacity: 1;
        `;
        if (i == 0) {
          box.style.cssText += `
          border-left: 1px solid green;
          `;
        }

        if (i == end.x - start.x - 1) {
          box.style.cssText += `
          border-right: 1px solid green;
          `;
        }
      }
    }
  }

  function unshadeArea(start, end) {
    if (start.x == end.x) {
      for (let i = 0; i < end.y - start.y; i++) {
        let box = document.querySelector(`[data-val='${xyToNum(start.x, start.y + i)}']`);
        box.style = '';
      }
    } else {
      for (let i = 0; i < end.x - start.x; i++) {
        let box = document.querySelector(`[data-val='${xyToNum(start.x + i, start.y)}']`);
        box.style = '';
      }
    }

    console.log('done');
  }

  return {
    numToXY, unshadeArea,
    xyToNum, getEnd, shadeArea,
  };
})();

// const helpers = require('./helper.js');

let boats = document.querySelectorAll('.boat');

function handleDragStart(event) {
  this.style.opacity = '0.2';
  this.classList.add('temp');
}

function handleDragEnd(event) {
  this.style.opacity = '1';
  this.classList.remove('temp');

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
let enabledrop = true;

gridboxes.forEach((box) => {
  box.addEventListener('dragenter', (event) => {
    let boat = document.querySelector('.temp');
    let length = Number(boat.getAttribute('data-length'));
    let orientation = boat.getAttribute('data-orient');
    let boxVal = Number(box.getAttribute('data-val'));
    let coordinates = helpers.numToXY(boxVal);

    let end = helpers.getEnd(coordinates, orientation, length);
    helpers.shadeArea(coordinates, end);
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
  })
  box.addEventListener('drop', (event) => {
    let boat = document.querySelector('.temp');
    event.preventDefault();
    event.stopPropagation();
    box.appendChild(boat);
    boat.addEventListener('click', (event) => {
      event.stopPropagation();
      let possible = false;
      let orientation = boat.getAttribute('data-orient');
      let length = Number(boat.getAttribute('data-length'));
      let boxVal = Number(box.getAttribute('data-val'));
      let coordinates = helpers.numToXY(boxVal);

      let end = {};
      if (orientation == 'h') {
        end.y = coordinates.y + length - 1;
        if (end.y <= 9) possible = true;
      } else {
        end.x = coordinates.x + length - 1;
        if (end.x <= 9) possible = true;
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
      } 

    });
    return false;
  })
})