// Sudoku generator and solver
const EMPTY = 0;

function isValid(
  board: number[][],
  row: number,
  col: number,
  num: number
): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
}

function solveSudoku(board: number[][]): boolean {
  let row = 0;
  let col = 0;
  let isEmpty = false;

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === EMPTY) {
        row = i;
        col = j;
        isEmpty = true;
        break;
      }
    }
    if (isEmpty) break;
  }

  if (!isEmpty) return true;

  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      if (solveSudoku(board)) return true;
      board[row][col] = EMPTY;
    }
  }

  return false;
}

function generateSudoku(difficulty: 'easy' | 'medium' | 'hard'): {
  initial: number[][];
  solution: number[][];
} {
  const board: number[][] = Array(9)
    .fill(null)
    .map(() => Array(9).fill(EMPTY));
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  // Fill diagonal boxes
  for (let box = 0; box < 9; box += 3) {
    const shuffled = [...nums].sort(() => Math.random() - 0.5);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[box + i][box + j] = shuffled[i * 3 + j];
      }
    }
  }

  solveSudoku(board);
  const solution = board.map((row) => [...row]);

  // Remove numbers based on difficulty
  const cellsToRemove = {
    easy: 30,
    medium: 45,
    hard: 55,
  }[difficulty];

  const initial = board.map((row) => [...row]);
  let removed = 0;

  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (initial[row][col] !== EMPTY) {
      initial[row][col] = EMPTY;
      removed++;
    }
  }

  return { initial, solution };
}

export { generateSudoku, isValid };
