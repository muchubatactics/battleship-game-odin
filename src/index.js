/**
 * 
 * the x, y co-ordinate system in this code 
 * works with the origin being in the top left
 * board 2d array is indexed with (y,x) not (x,y)
 * all functions take in (x,y) not (y,x) although
 * inconsitent? yeah
 * 
**/


let table = document.querySelector('.onex');

let draggables = document.querySelectorAll('.boat');

draggables.forEach((draggable) => {
  draggable.addEventListener('dragstart', (event) => {
    draggable.classList.add('dragging');

    draggable.parentElement.classList.add('forward');
  })

  draggable.addEventListener('dragend', () => {
    draggable.parentElement.classList.remove('forward');
    draggable.classList.remove('dragging');
  })
})

table.querySelectorAll('td').forEach((td) => {
  td.addEventListener('dragover', (e) => {
    e.preventDefault();
    td.classList.add('hehe');
  })
})