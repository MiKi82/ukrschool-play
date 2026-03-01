import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, RotateCcw, HelpCircle } from 'lucide-react';

export interface CrosswordClue {
  id: string;
  number: number;
  direction: 'across' | 'down';
  clue: string;
  answer: string;
  row: number;
  col: number;
}

export interface CrosswordVariant {
  gridSize: number;
  clues: CrosswordClue[];
}

interface CrosswordGameProps {
  clues?: CrosswordClue[];
  gridSize?: number;
  variants?: CrosswordVariant[];
  onComplete: (score: number, timeSpent: number) => void;
}

interface Cell {
  letter: string;
  number?: number;
  isBlocked: boolean;
  clueIds: string[];
}

export const CrosswordGame: React.FC<CrosswordGameProps> = ({
  clues: directClues,
  gridSize: directGridSize,
  variants,
  onComplete,
}) => {
  // Pick a random variant once on mount (stable via ref)
  const variantIndexRef = useRef<number>(
    variants && variants.length > 0 ? Math.floor(Math.random() * variants.length) : -1
  );

  const activeVariant = useMemo(() => {
    if (variants && variants.length > 0) {
      return variants[variantIndexRef.current];
    }
    if (directClues && directGridSize) {
      return { gridSize: directGridSize, clues: directClues };
    }
    return null;
  }, [variants, directClues, directGridSize]);

  const clues = activeVariant?.clues || [];
  const gridSize = activeVariant?.gridSize || 8;

  const [grid, setGrid] = useState<Cell[][]>([]);
  const [userInputs, setUserInputs] = useState<string[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedClue, setSelectedClue] = useState<CrosswordClue | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  // Build grid from clues
  useEffect(() => {
    const newGrid: Cell[][] = Array(gridSize)
      .fill(null)
      .map(() =>
        Array(gridSize)
          .fill(null)
          .map(() => ({ letter: '', isBlocked: true, clueIds: [] }))
      );

    const newInputs: string[][] = Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(''));

    clues.forEach((clue) => {
      const letters = clue.answer.toUpperCase().split('');
      letters.forEach((letter, i) => {
        const row = clue.direction === 'down' ? clue.row + i : clue.row;
        const col = clue.direction === 'across' ? clue.col + i : clue.col;
        if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
          newGrid[row][col] = {
            letter,
            isBlocked: false,
            clueIds: [...(newGrid[row][col]?.clueIds || []), clue.id],
            number: i === 0 ? clue.number : newGrid[row][col]?.number,
          };
        }
      });
    });

    setGrid(newGrid);
    setUserInputs(newInputs);
  }, [clues, gridSize]);

  const handleCellClick = (row: number, col: number) => {
    if (grid[row]?.[col]?.isBlocked) return;

    const cellClues = grid[row][col].clueIds;
    if (cellClues.length === 0) return;

    // Toggle between clues on repeated click of same cell
    if (selectedCell?.row === row && selectedCell?.col === col && cellClues.length > 1 && selectedClue) {
      const currentClueIndex = cellClues.indexOf(selectedClue.id);
      const nextClueId = cellClues[(currentClueIndex + 1) % cellClues.length];
      const nextClue = clues.find((c) => c.id === nextClueId);
      if (nextClue) {
        setSelectedClue(nextClue);
        return;
      }
    }

    setSelectedCell({ row, col });

    // Keep current clue if it contains this cell
    if (selectedClue && cellClues.includes(selectedClue.id)) {
      return;
    }

    const clue = clues.find((c) => c.id === cellClues[0]);
    if (clue) setSelectedClue(clue);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selectedCell || isComplete) return;

      const { row, col } = selectedCell;
      const letter = e.key.toUpperCase();

      if (/^[А-ЯІЇЄҐ]$/.test(letter) || /^[A-Z0-9]$/.test(letter)) {
        const newInputs = userInputs.map(r => [...r]);
        newInputs[row][col] = letter;
        setUserInputs(newInputs);

        if (selectedClue) {
          const nextRow = selectedClue.direction === 'down' ? row + 1 : row;
          const nextCol = selectedClue.direction === 'across' ? col + 1 : col;
          if (nextRow < gridSize && nextCol < gridSize && !grid[nextRow]?.[nextCol]?.isBlocked) {
            setSelectedCell({ row: nextRow, col: nextCol });
          }
        }
      } else if (e.key === 'Backspace') {
        const newInputs = userInputs.map(r => [...r]);
        newInputs[row][col] = '';
        setUserInputs(newInputs);

        if (selectedClue) {
          const prevRow = selectedClue.direction === 'down' ? row - 1 : row;
          const prevCol = selectedClue.direction === 'across' ? col - 1 : col;
          if (prevRow >= 0 && prevCol >= 0 && !grid[prevRow]?.[prevCol]?.isBlocked) {
            setSelectedCell({ row: prevRow, col: prevCol });
          }
        }
      }
    },
    [selectedCell, selectedClue, userInputs, grid, gridSize, isComplete]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const calculateScore = () => {
    let correct = 0;
    let total = 0;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (!grid[row]?.[col]?.isBlocked) {
          total++;
          if (userInputs[row]?.[col] === grid[row][col].letter) {
            correct++;
          }
        }
      }
    }

    return { correct, total };
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  const handleComplete = () => {
    const { correct, total } = calculateScore();
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    setIsComplete(true);
    onComplete(score, timeSpent);
  };

  const resetGame = () => {
    // Pick a new random variant on restart
    if (variants && variants.length > 0) {
      variantIndexRef.current = Math.floor(Math.random() * variants.length);
    }
    setUserInputs(
      Array(gridSize)
        .fill(null)
        .map(() => Array(gridSize).fill(''))
    );
    setShowResults(false);
    setIsComplete(false);
    setSelectedCell(null);
    setSelectedClue(null);
    setStartTime(Date.now());
  };

  const getCellClass = (row: number, col: number) => {
    const cell = grid[row]?.[col];
    if (!cell || cell.isBlocked) return 'bg-muted';

    let classes = 'bg-card border-2 border-border cursor-pointer transition-all ';

    if (selectedCell?.row === row && selectedCell?.col === col) {
      classes += 'ring-2 ring-primary border-primary ';
    }

    if (showResults && userInputs[row]?.[col]) {
      if (userInputs[row][col] === cell.letter) {
        classes += 'bg-green-100 dark:bg-green-900/30 border-green-500 ';
      } else {
        classes += 'bg-red-100 dark:bg-red-900/30 border-red-500 ';
      }
    }

    return classes;
  };

  if (!activeVariant || clues.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Дані кросворду відсутні або пошкоджені</p>
      </Card>
    );
  }

  if (isComplete) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Кросворд розв'язано!</h2>
        <p className="text-muted-foreground mb-4">Ви успішно заповнили всі слова</p>
        <Button onClick={resetGame} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          Грати знову
        </Button>
      </Card>
    );
  }

  const acrossClues = clues.filter((c) => c.direction === 'across').sort((a, b) => a.number - b.number);
  const downClues = clues.filter((c) => c.direction === 'down').sort((a, b) => a.number - b.number);

  return (
    <div className="space-y-6">
      <Card className="p-4 overflow-x-auto">
        <div
          className="grid gap-1 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(32px, 40px))`,
            width: 'fit-content',
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-lg font-bold ${getCellClass(
                  rowIndex,
                  colIndex
                )}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell.number && (
                  <span className="absolute top-0 left-0.5 text-[8px] sm:text-[10px] text-muted-foreground">
                    {cell.number}
                  </span>
                )}
                {!cell.isBlocked && (
                  <span className="text-foreground">{userInputs[rowIndex]?.[colIndex] || ''}</span>
                )}
              </div>
            ))
          )}
        </div>
      </Card>

      {selectedClue && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-2">
            <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">
                {selectedClue.number}. {selectedClue.direction === 'across' ? 'По горизонталі' : 'По вертикалі'}
              </p>
              <p className="text-muted-foreground">{selectedClue.clue}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            → По горизонталі
          </h3>
          <ul className="space-y-2">
            {acrossClues.map((clue) => (
              <li
                key={clue.id}
                className={`text-sm cursor-pointer p-2 rounded transition-colors ${
                  selectedClue?.id === clue.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                }`}
                onClick={() => {
                  setSelectedClue(clue);
                  setSelectedCell({ row: clue.row, col: clue.col });
                }}
              >
                <span className="font-medium">{clue.number}.</span> {clue.clue}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-4">
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            ↓ По вертикалі
          </h3>
          <ul className="space-y-2">
            {downClues.map((clue) => (
              <li
                key={clue.id}
                className={`text-sm cursor-pointer p-2 rounded transition-colors ${
                  selectedClue?.id === clue.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                }`}
                onClick={() => {
                  setSelectedClue(clue);
                  setSelectedCell({ row: clue.row, col: clue.col });
                }}
              >
                <span className="font-medium">{clue.number}.</span> {clue.clue}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={resetGame}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Скинути
        </Button>
        <Button onClick={checkAnswers}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Перевірити
        </Button>
        {showResults && (
          <Button onClick={handleComplete} variant="secondary">
            Завершити
          </Button>
        )}
      </div>
    </div>
  );
};
