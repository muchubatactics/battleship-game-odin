/**
 * 
 * 
**/

function Ship(length) {
  function hit() {
    if(this.sunk) return;
    if (!this.hits) this.hits = 1;
    else this.hits++;
    this.isSunk();
  }

  function isSunk() {
    if (this.hits == this.length) {
      this.sunk = true;
      return true;
    } else return false;
  }

  return {
    length: length,
    hits: null,
    sunk: false,
    hit, isSunk,
  }
}

module.exports = Ship;