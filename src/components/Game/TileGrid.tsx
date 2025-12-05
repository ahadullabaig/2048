/**
 * TileGrid component
 * Maps game state board to Tile components
 */

import { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import Tile from './Tile';

export default function TileGrid() {
  const board = useGameStore((state) => state.board);
  const lastMerges = useGameStore((state) => state.lastMerges);

  // Track which tiles are new (just spawned)
  const prevBoardRef = useRef(board);
  const newTilePositionsRef = useRef<Set<string>>(new Set());

  // Track which tiles just merged
  const mergedPositionsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const prevBoard = prevBoardRef.current;
    const newPositions = new Set<string>();

    // Find newly spawned tiles
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const currentValue = board[row][col];
        const prevValue = prevBoard[row]?.[col] || 0;

        // New tile if: current is non-zero and previous was zero
        if (currentValue !== 0 && prevValue === 0) {
          newPositions.add(`${row}-${col}`);
        }
      }
    }

    newTilePositionsRef.current = newPositions;

    // Update merged positions from lastMerges
    const mergedSet = new Set<string>();
    for (const merge of lastMerges) {
      mergedSet.add(`${merge.row}-${merge.col}`);
    }
    mergedPositionsRef.current = mergedSet;

    // Clear new tile markers after animation
    const timer = setTimeout(() => {
      newTilePositionsRef.current.clear();
      mergedPositionsRef.current.clear();
    }, 300);

    prevBoardRef.current = board;

    return () => clearTimeout(timer);
  }, [board, lastMerges]);

  return (
    <group>
      {board.map((row, rowIndex) =>
        row.map((value, colIndex) => {
          const key = `${rowIndex}-${colIndex}-${value}`;
          const posKey = `${rowIndex}-${colIndex}`;
          const isNew = newTilePositionsRef.current.has(posKey);
          const isMerged = mergedPositionsRef.current.has(posKey);

          return (
            <Tile
              key={key}
              value={value}
              gridX={colIndex}
              gridY={rowIndex}
              isNew={isNew}
              isMerged={isMerged}
            />
          );
        })
      )}
    </group>
  );
}
