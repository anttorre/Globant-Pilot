const gridSize = 4;
let board = [];
let score = 0;
let canMove = true;
let movedThisTurn = false; // Variable para saber si hubo movimiento
let gameOver = false;

document.addEventListener("DOMContentLoaded", () => {
    initializeGame();
    document.getElementById("restart-btn").addEventListener("click", restartGame);
    document.getElementById("restart-btn2").addEventListener("click", restartGame);
	window.addEventListener("keydown", handleKeyPress);
});

function initializeGame() {
	document.getElementById('gameOver').style.display = 'none';
    board = Array(gridSize).fill().map(() => Array(gridSize).fill(0)); // Reset board
    score = 0; // Reset score
    updateBoard();
    addRandomTile(); // Add two random tiles
    addRandomTile();
}

function restartGame() {
	gameOver = false;
    document.getElementById('gameOver').style.display = 'none'; // Ocultar Game Over
    initializeGame(); // Reiniciar el juego
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
                tile.innerHTML = "<span>"+ cell+ "</span>";
            }
            gridContainer.appendChild(tile); // Append tile to grid
        });
    });
    // Update score
    document.getElementById("score").textContent = score;
}

function handleKeyPress(e) {
    if (!canMove) return;

    movedThisTurn = false; // Reset the movement flag

    // Make a copy of the board to compare before and after the move
    const boardBeforeMove = board.map(row => row.slice());

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

    // Only add a random tile if the board has changed
    if (!arraysEqual(boardBeforeMove, board)) {
        addRandomTile();
        updateBoard();
    }

	checkGameOver();
}

function moveUp() {
	checkGameOver();
    canMove = false;
    let moved = false;
    for (let c = 0; c < gridSize; c++) {
        let column = [];
        for (let r = 0; r < gridSize; r++) {
            if (board[r][c] !== 0) {
                column.push(board[r][c]);
            }
        }
        column = merge(column);
        for (let r = 0; r < gridSize; r++) {
            if (board[r][c] !== column[r]) {
                moved = true;
            }
            board[r][c] = column[r] || 0;
        }
    }
    if (moved) {
        movedThisTurn = true;
    }
    setTimeout(() => {
        canMove = true;
    }, 200);  // Wait for animation to complete
}

function moveDown() {
	checkGameOver();
    canMove = false;
    let moved = false;
    for (let c = 0; c < gridSize; c++) {
        let column = [];
        for (let r = gridSize - 1; r >= 0; r--) {
            if (board[r][c] !== 0) {
                column.push(board[r][c]);
            }
        }
        column = merge(column);
        for (let r = 0; r < gridSize; r++) {
            if (board[gridSize - 1 - r][c] !== column[r]) {
                moved = true;
            }
            board[gridSize - 1 - r][c] = column[r] || 0;
        }
    }
    if (moved) {
        movedThisTurn = true;
    }
    setTimeout(() => {
        canMove = true;
    }, 200);
}

function moveLeft() {
	checkGameOver();
    canMove = false;
    let moved = false;
    for (let r = 0; r < gridSize; r++) {
        let row = [];
        for (let c = 0; c < gridSize; c++) {
            if (board[r][c] !== 0) {
                row.push(board[r][c]);
            }
        }
        row = merge(row);
        for (let c = 0; c < gridSize; c++) {
            if (board[r][c] !== row[c]) {
                moved = true;
            }
            board[r][c] = row[c] || 0;
        }
    }
    if (moved) {
        movedThisTurn = true;
    }
    setTimeout(() => {
        canMove = true;
    }, 200);
}

function moveRight() {
	checkGameOver();
    canMove = false;
    let moved = false;
    for (let r = 0; r < gridSize; r++) {
        let row = [];
        for (let c = gridSize - 1; c >= 0; c--) {
            if (board[r][c] !== 0) {
                row.push(board[r][c]);
            }
        }
        row = merge(row);
        for (let c = 0; c < gridSize; c++) {
            if (board[r][gridSize - 1 - c] !== row[c]) {
                moved = true;
            }
            board[r][gridSize - 1 - c] = row[c] || 0;
        }
    }
    if (moved) {
        movedThisTurn = true;
    }
    setTimeout(() => {
        canMove = true;
    }, 200);
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

// Helper function to compare arrays (board states)
function arraysEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

function checkGameOver() {
    // 1. Comprobar si aún hay celdas vacías
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (board[r][c] === 0) {
                return false; // Si hay una celda vacía, el juego no está terminado
            }
        }
    }

    // 2. Comprobar si existen movimientos posibles
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            // Comprobar si hay celdas adyacentes con el mismo valor (posibles movimientos)
            if (c + 1 < gridSize && board[r][c] === board[r][c + 1]) {
                return false; // Movimiento posible a la derecha
            }
            if (r + 1 < gridSize && board[r][c] === board[r + 1][c]) {
                return false; // Movimiento posible hacia abajo
            }
        }
    }

    // Si no hay celdas vacías y no existen movimientos posibles
    gameOver = true;
    document.getElementById('gameOver').style.display = 'flex'; // Mostrar el Game Over
    return true;
}
