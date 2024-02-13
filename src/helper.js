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
    let end;
    if (orientation == 'h') {
      end.x = coordinates.x + length;
      end.y = coordinates.y;
      
      while(end.x > 9) {
        coordinates.x = coordinates.x - 1;
        end.x = end.x - 1;
      }

    } else {
      end.y = coordinates.x + length;
      end.x = coordinates.x;

      while(end.y > 9) {
        coordinates.y = coordinates.y - 1;
        end.y = end.y - 1;
      }
    }

    return end;
  }

  function shadeArea(start, end) {
    if (start.x == end.x) {
      for (let i = 0; i < end.y - start.y; i++) {
        let box = document.querySelector(`[data-val='${xyToNum(start.x, start.y + i)}']`);
        box.style = `
        border-left = 2px solid green;
        border-right = 2px solid green;
        opacity = 1;
        `;
        if (i == 0) {
          box.style += `
          border-top: 2px solid green;
          `;
        }

        if (i == end.x - start.x - 1) {
          box.style += `
          border-bottom: 2px solid green;
          `;
        }
      }
    } else {
      for (let i = 0; i < end.x - start.x; i++) {
        let box = document.querySelector(`[data-val='${xyToNum(start.x + i, start.y)}']`);
        box.style = `
        border-top = 2px solid green;
        border-bottom = 2px solid green;
        opacity = 1;
        `;
        if (i == 0) {
          box.style += `
          border-left: 2px solid green;
          `;
        }

        if (i == end.x - start.x - 1) {
          box.style += `
          border-right: 2px solid green;
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
  }

  return {
    numToXY, unshadeArea,
    xyToNum, getEnd, shadeArea,
  };
})();

module.exports = helpers;