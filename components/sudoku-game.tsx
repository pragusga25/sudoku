'use client';

import { useState, useEffect, useCallback, KeyboardEvent } from 'react';
import { generateSudoku, isValid } from '@/lib/sudoku';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trophy, Timer, RotateCcw } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';
type Board = number[][];
type CellPosition = [number, number] | null;

export default function SudokuGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [board, setBoard] = useState<Board>([]);
  const [initialBoard, setInitialBoard] = useState<Board>([]);
  const [selectedCell, setSelectedCell] = useState<CellPosition>(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [errorCells, setErrorCells] = useState<Set<string>>(new Set());

  // Initialize game on mount
  useEffect(() => {
    startNewGame(difficulty);
  }, []);

  // Add keyboard listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      // Handle number inputs (1-9)
      if (/^[1-9]$/.test(key)) {
        handleNumberInput(parseInt(key));
        return;
      }

      // Handle navigation
      if (selectedCell) {
        const [row, col] = selectedCell;
        let newRow = row;
        let newCol = col;

        switch (key) {
          case 'ArrowUp':
            newRow = Math.max(0, row - 1);
            break;
          case 'ArrowDown':
            newRow = Math.min(8, row + 1);
            break;
          case 'ArrowLeft':
            newCol = Math.max(0, col - 1);
            break;
          case 'ArrowRight':
            newCol = Math.min(8, col + 1);
            break;
          case 'Backspace':
          case 'Delete':
            if (initialBoard[row][col] === 0) {
              const newBoard = board.map((row) => [...row]);
              newBoard[row][col] = 0;
              setBoard(newBoard);
            }
            break;
          default:
            return;
        }

        // Only move if the new position is editable
        if (initialBoard[newRow][newCol] === 0) {
          setSelectedCell([newRow, newCol]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown as any);
    return () => window.removeEventListener('keydown', handleKeyDown as any);
  }, [selectedCell, initialBoard, board]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isComplete) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isComplete]);

  // Validate if the current number placement is valid
  const validateCell = useCallback(isValid, []);

  // Check if the entire board is valid and complete
  const checkBoardCompletion = useCallback(
    (board: Board): boolean => {
      const newErrorCells = new Set<string>();

      // Check each cell
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          const value = board[i][j];
          if (value === 0) return false;

          const currentValue = board[i][j];
          board[i][j] = 0; // Temporarily remove current value
          if (!validateCell(board, i, j, currentValue)) {
            newErrorCells.add(`${i}-${j}`);
          }
          board[i][j] = currentValue; // Restore value
        }
      }

      setErrorCells(newErrorCells);
      return newErrorCells.size === 0;
    },
    [validateCell]
  );

  const startNewGame = useCallback((diff: Difficulty) => {
    const { initial } = generateSudoku(diff);
    const initialBoardCopy = initial.map((row) => [...row]);
    setBoard(initialBoardCopy);
    setInitialBoard(initialBoardCopy);
    setSelectedCell(null);
    setTimer(0);
    setIsRunning(true);
    setIsComplete(false);
    setErrorCells(new Set());
    setDifficulty(diff);
  }, []);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (initialBoard[row][col] === 0) {
        setSelectedCell([row, col]);
      }
    },
    [initialBoard]
  );

  const handleNumberInput = useCallback(
    (number: number) => {
      if (!selectedCell || isComplete) return;
      const [row, col] = selectedCell;

      if (initialBoard[row][col] !== 0) return;

      const newBoard = board.map((row) => [...row]);
      newBoard[row][col] = number;
      setBoard(newBoard);

      // Check if the board is complete and valid
      const isBoardComplete = checkBoardCompletion(newBoard);
      if (isBoardComplete) {
        setIsComplete(true);
        setIsRunning(false);
      }
    },
    [selectedCell, initialBoard, board, checkBoardCompletion, isComplete]
  );

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-4xl font-bold text-primary">Sudoku</h1>
        <div className="flex items-center gap-4">
          <Select
            value={difficulty}
            onValueChange={(value: Difficulty) => startNewGame(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => startNewGame(difficulty)}
            title="New Game"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="grid grid-cols-9 gap-0.5 bg-muted p-2 rounded-lg">
            {board.map((row, i) =>
              row.map((cell, j) => (
                <button
                  key={`${i}-${j}`}
                  className={`
                    aspect-square flex items-center justify-center text-lg font-semibold
                    transition-colors duration-200
                    ${
                      initialBoard[i][j] !== 0
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-background text-primary'
                    }
                    ${
                      selectedCell?.[0] === i && selectedCell?.[1] === j
                        ? 'ring-2 ring-primary'
                        : ''
                    }
                    ${
                      errorCells.has(`${i}-${j}`)
                        ? 'bg-red-100 text-red-600'
                        : ''
                    }
                    ${i % 3 === 2 && i !== 8 ? 'border-b-2 border-primary' : ''}
                    ${j % 3 === 2 && j !== 8 ? 'border-r-2 border-primary' : ''}
                    hover:bg-accent hover:text-accent-foreground
                    focus:outline-none focus:ring-2 focus:ring-primary
                  `}
                  onClick={() => handleCellClick(i, j)}
                  disabled={isComplete || initialBoard[i][j] !== 0}
                  tabIndex={initialBoard[i][j] === 0 ? 0 : -1}
                  aria-label={`Cell ${i + 1},${j + 1}: ${
                    cell === 0 ? 'empty' : cell
                  }`}
                >
                  {cell !== 0 ? cell : ''}
                </button>
              ))
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Difficulty</p>
                <p className="text-2xl font-semibold capitalize">
                  {difficulty}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Time</p>
                <div className="flex items-center justify-center gap-2">
                  <Timer className="w-4 h-4" />
                  <p className="text-2xl font-semibold">{formatTime(timer)}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="flex items-center justify-center gap-2">
                  {isComplete ? (
                    <>
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <p className="text-2xl font-semibold text-yellow-500">
                        Complete!
                      </p>
                    </>
                  ) : (
                    <p className="text-2xl font-semibold">In Progress</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                <Button
                  key={number}
                  variant="outline"
                  className="text-xl font-semibold h-12"
                  onClick={() => handleNumberInput(number)}
                  disabled={isComplete || !selectedCell}
                >
                  {number}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
