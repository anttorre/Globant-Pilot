const gridSize = 4;
let board = [];
let score = 0;

document.addEventListener("DOMContentLoaded", () => {
    initializeGame();
    document.getElementById("restart-btn").addEventListener("click", restartGame);
    window.addEventListener("keydown", handleKeyPress);
});

function initializeGame() {
    board = Array(gridSize).fill().map(() => Array(gridSize).fill(0)); // Reset board
    score = 0; // Reset score
    updateBoard();
    addRandomTile(); // Add two random tiles
    addRandomTile();
}

function restartGame() {
    initializeGame(); // Restart the game
}

function addRandomTile() {
    const emptyCells = [];
    // Iterate through the grid to find empty cells
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (board[r][c] === 0) {
                emptyCells.push({ r, c });
            }
        }
    }
    if (emptyCells.length > 0) {
        const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        // Add a random tile (either 2 or 4) at an empty cell
        board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
    updateBoard();
}

function updateBoard() {
    const gridContainer = document.querySelector(".grid-container");
    gridContainer.innerHTML = ""; // Clear existing grid
    // Create tiles based on the current board state
    board.forEach((row, r) => {
        row.forEach((cell, c) => {
            const tile = document.createElement("div");
            tile.classList.add("grid-cell");
            tile.style.gridRowStart = r + 1; // Adjust to correct grid position
            tile.style.gridColumnStart = c + 1; // Adjust to correct grid position
            if (cell !== 0) {
                tile.classList.add(`tile-${cell}`);
                tile.textContent = cell;
            }
            gridContainer.appendChild(tile); // Append tile to grid
        });
    });
    // Update score
    document.getElementById("score").textContent = score;
}

function handleKeyPress(e) {
    switch (e.key) {
        case "ArrowUp":
            moveUp();
            break;
        case "ArrowDown":
            moveDown();
            break;
        case "ArrowLeft":
            moveLeft();
            break;
        case "ArrowRight":
            moveRight();
            break;
    }
}

function moveUp() {
    for (let c = 0; c < gridSize; c++) {
        let column = [];
        for (let r = 0; r < gridSize; r++) {
            if (board[r][c] !== 0) {
                column.push(board[r][c]);
            }
        }
        column = merge(column);
        for (let r = 0; r < gridSize; r++) {
            board[r][c] = column[r] || 0;
        }
    }
    addRandomTile();
    updateBoard();
    animateTiles();
}

function moveDown() {
    for (let c = 0; c < gridSize; c++) {
        let column = [];
        for (let r = gridSize - 1; r >= 0; r--) {
            if (board[r][c] !== 0) {
                column.push(board[r][c]);
            }
        }
        column = merge(column);
        for (let r = 0; r < gridSize; r++) {
            board[gridSize - 1 - r][c] = column[r] || 0;
        }
    }
    addRandomTile();
    updateBoard();
    animateTiles();
}

function moveLeft() {
    for (let r = 0; r < gridSize; r++) {
        let row = [];
        for (let c = 0; c < gridSize; c++) {
            if (board[r][c] !== 0) {
                row.push(board[r][c]);
            }
        }
        row = merge(row);
        for (let c = 0; c < gridSize; c++) {
            board[r][c] = row[c] || 0;
        }
    }
    addRandomTile();
    updateBoard();
    animateTiles();
}

function moveRight() {
    for (let r = 0; r < gridSize; r++) {
        let row = [];
        for (let c = gridSize - 1; c >= 0; c--) {
            if (board[r][c] !== 0) {
                row.push(board[r][c]);
            }
        }
        row = merge(row);
        for (let c = 0; c < gridSize; c++) {
            board[r][gridSize - 1 - c] = row[c] || 0;
        }
    }
    addRandomTile();
    updateBoard();
    animateTiles();
}

function merge(arr) {
    const newArray = [];
    let skip = false;
    for (let i = 0; i < arr.length; i++) {
        if (skip) {
            skip = false;
            continue;
        }
        if (i + 1 < arr.length && arr[i] === arr[i + 1]) {
            newArray.push(arr[i] * 2);
            score += arr[i] * 2;
            skip = true;
        } else {
            newArray.push(arr[i]);
        }
    }
    return newArray;
}

function animateTiles() {
    const tiles = document.querySelectorAll(".grid-cell");
    tiles.forEach(tile => {
        // Apply animation class for tile movement
        tile.classList.add("tile-merge");
        setTimeout(() => {
            tile.classList.remove("tile-merge");
        }, 200); // Duration of the merge animation
    });
}
