const stepBoard = document.getElementById("stepBoard");
const logBox = document.getElementById("logBox");
const boardInput = document.getElementById("boardInput");
const solutionDisplay = document.getElementById("solutionDisplay");
const themeToggle = document.getElementById("themeToggle");
let delay = 100;
let boardSize = 8;

function createStepBoard() {
  boardSize = parseInt(boardInput.value);
  stepBoard.style.gridTemplateColumns = `repeat(${boardSize}, 40px)`;
  stepBoard.style.gridTemplateRows = `repeat(${boardSize}, 40px)`;
  stepBoard.innerHTML = "";
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.classList.add((row + col) % 2 === 0 ? "white" : "black");
      cell.setAttribute("id", `step-${row}-${col}`);
      stepBoard.appendChild(cell);
    }
  }
}

function drawBoardState(board) {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = document.getElementById(`step-${row}-${col}`);
      if (cell) {
        cell.innerHTML = board[row] === col ? `<span class="queen">♛</span>` : "";
      }
    }
  }
}

function logMessage(msg) {
  const p = document.createElement("p");
  p.textContent = msg;
  logBox.appendChild(p);
  logBox.scrollTop = logBox.scrollHeight;
}

function isSafe(board, row, col) {
  for (let i = 0; i < row; i++) {
    if (
      board[i] === col ||
      board[i] - i === col - row ||
      board[i] + i === col + row
    ) {
      return false;
    }
  }
  return true;
}

function renderSolution(board) {
  const container = document.createElement("div");
  container.className = "solution-board";
  container.style.setProperty('--size', boardSize);
  container.style.gridTemplateColumns = `repeat(${boardSize}, 20px)`;
  container.style.gridTemplateRows = `repeat(${boardSize}, 20px)`;
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = document.createElement("div");
      cell.className = "solution-cell";
      cell.style.backgroundColor = (row + col) % 2 === 0 ? "#f0d9b5" : "#b58863";
      if (board[row] === col) {
        cell.innerHTML = `<span class="queen">♛</span>`;
      }
      container.appendChild(cell);
    }
  }
  solutionDisplay.appendChild(container);
}

async function solveAll(row, board, solutions) {
  if (row === boardSize) {
    drawBoardState(board);
    logMessage("✅ Solution Found");
    await new Promise(res => setTimeout(res, delay * 5));
    solutions.push([...board]);
    renderSolution(board);
    return;
  }

  for (let col = 0; col < boardSize; col++) {
    if (isSafe(board, row, col)) {
      board[row] = col;
      drawBoardState(board);
      await new Promise(res => setTimeout(res, delay));
      await solveAll(row + 1, board, solutions);
      board[row] = -1;
      drawBoardState(board);
      await new Promise(res => setTimeout(res, delay));
    } else {
      logMessage(`❌ Queens under attack at (${row}, ${col}) — Backtracking`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

async function startFullBacktracking() {
  logBox.innerHTML = "";
  solutionDisplay.innerHTML = "";
  createStepBoard();
  boardSize = parseInt(boardInput.value);
  const board = Array(boardSize).fill(-1);
  const solutions = [];
  await solveAll(0, board, solutions);
  logMessage(`🎯 Total Solutions Found: ${solutions.length}`);
}

// Toggle light/dark theme
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
}
