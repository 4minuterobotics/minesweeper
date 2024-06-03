document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");
  const numRows = 10;
  const numCols = 10;
  const numMines = 30;
  let mines = [];
  let isGameOver = false;
  let flag = true;

  function createGrid() {
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = i;
        cell.dataset.col = j;
        container.appendChild(cell);
        cell.addEventListener("click", handleCellClick);
        // Add event listener for right-click (contextmenu) to flag cells
        cell.addEventListener("contextmenu", handleCellFlag);
      }
    }
  }

  function plantMines() {
    while (mines.length < numMines) {
      const row = Math.floor(Math.random() * numRows);
      const col = Math.floor(Math.random() * numCols);
      const duplicate = mines.some(
        (mine) => mine[0] === row && mine[1] === col
      );
      if (!duplicate) {
        mines.push([row, col]);
      }
    }
  }

  function handleCellClick(event) {
    if (isGameOver) return;
    const cell = event.target;
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    if (cell.classList.contains("flagged")) {
      return;
    }
    if (isMine(row, col)) {
      isGameOver = true;
      revealAllMines();
      alert("Game Over!");
    } else {
      const count = countNeighborMines(row, col);
      event.target.classList.add("revealed");
      event.target.textContent = count > 0 ? count : "";
    }
  }

  // Handle right-click to flag cells
  function handleCellFlag(event) {
    event.preventDefault(); // Prevent the context menu from appearing
    if (isGameOver) return;
    const cell = event.target;
    if (!cell.classList.contains("flagged")) {
      cell.classList.add("flagged");
      cell.textContent = "🚩"; // You can use any symbol for the flag
    } else {
      cell.classList.remove("flagged");
      cell.textContent = "";
    }
  }

  function isMine(row, col) {
    return mines.some((mine) => mine[0] === row && mine[1] === col);
  }

  function countNeighborMines(row, col) {
    let count = 0;
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i >= 0 && i < numRows && j >= 0 && j < numCols && isMine(i, j)) {
          count++;
        }
      }
    }
    return count;
  }

  function revealAllMines() {
    mines.forEach((mine) => {
      const [row, col] = mine;
      const cell = document.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
      );
      cell.classList.add("mine");
      cell.textContent = "💣";
    });
  }

  createGrid();
  plantMines();
});
