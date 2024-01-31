/**
 * 
 * 
 * 
**/

module.exports = (function DOMstuff() {

  function initialRender(player) {
    let container = document.createElement('table');
    for (let i = 0; i < 10; i++) {
      let row = document.createElement('tr');
      for (let j = 0; j < 10; j++) {
        let temp = document.createElement('td');
        temp.textContent = player.getGameboard().getBoard()[i][j].ship ? 'X' : 'O';
        row.appendChild(temp);
      }
      container.appendChild(row);
    }
    return container;
  }

  return {
    initialRender,
  }
})();