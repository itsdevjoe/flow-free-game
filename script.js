// Flow Free game script with multiple levels
let currentLevel = 0;
let boardEl;
let paths = {};
let isDrawing = false;
let selectedColor = null;

function loadLevel() {
  const level = levels[currentLevel];
  const size = level.size;
  boardEl = document.getElementById('board');
  boardEl.innerHTML = '';
  boardEl.style.gridTemplateColumns = `repeat(${size}, 60px)`;
  boardEl.style.gridTemplateRows = `repeat(${size}, 60px)`;
  paths = {};
  // initialize paths for each color
  level.connections.forEach(conn => {
    paths[conn.color] = [];
  });
  // create grid cells
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const div = document.createElement('div');
      div.className = 'cell';
      div.dataset.row = r;
      div.dataset.col = c;
      boardEl.appendChild(div);
    }
  }
  // place dots
  level.connections.forEach(conn => {
    conn.points.forEach(pt => {
      const idx = pt[0] * size + pt[1];
      const cell = boardEl.children[idx];
      const dot = document.createElement('div');
      dot.className = 'dot';
      dot.style.background = conn.color;
      cell.appendChild(dot);
    });
  });
}

function checkSolved() {
  // check if every color has a path connecting two dots
  return Object.values(paths).every(arr => arr.length > 0);
}

function drawPath(cell, color) {
  // color cell if no dot inside
  if (!cell.querySelector('.dot')) {
    cell.style.background = color;
  }
}

function handlePointerDown(e) {
  const cell = e.target.closest('.cell');
  if (!cell) return;
  const dot = cell.querySelector('.dot');
  if (dot) {
    selectedColor = dot.style.background;
    isDrawing = true;
    paths[selectedColor] = [[parseInt(cell.dataset.row), parseInt(cell.dataset.col)]];
    drawPath(cell, selectedColor);
  }
}

function handlePointerMove(e) {
  if (!isDrawing || !selectedColor) return;
  const cell = document.elementFromPoint(e.clientX, e.clientY)?.closest('.cell');
  if (!cell) return;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  const last = paths[selectedColor][paths[selectedColor].length - 1];
  if (!last || last[0] !== row || last[1] !== col) {
    paths[selectedColor].push([row, col]);
    drawPath(cell, selectedColor);
  }
}

function handlePointerUp() {
  if (isDrawing) {
    isDrawing = false;
    if (checkSolved()) {
      currentLevel++;
      if (currentLevel < levels.length) {
        setTimeout(() => loadLevel(), 300);
      } else {
        alert('Congratulations! You completed all levels!');
      }
    }
    selectedColor = null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadLevel();
  boardEl = document.getElementById('board');
  boardEl.addEventListener('pointerdown', handlePointerDown);
  boardEl.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', handlePointerUp);
});
