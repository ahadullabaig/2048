/**
 * Core 2048 game logic - movement and merging
 */

import type { Board, Direction, TileValue } from './constants';
import { cloneBoard, rotateBoard, rotateCounterClockwise } from './boardUtils';

/**
 * Result of a move operation
 */
export interface MoveResult {
  board: Board;
  score: number;
  moved: boolean;
  merges: Array<{ row: number; col: number; value: TileValue }>;
}

/**
 * Slides and merges a single row to the left
 * Returns the new row, score gained, and whether any change occurred
 */
function slideRowLeft(row: TileValue[]): {
  row: TileValue[];
  score: number;
  merges: number[]; // Indices where merges occurred
} {
  const size = row.length;
  const newRow: TileValue[] = Array(size).fill(0);
  const merges: number[] = [];
  let writeIndex = 0;
  let score = 0;
  let lastMergeIndex = -1;

  for (let i = 0; i < size; i++) {
    if (row[i] === 0) continue;

    // If the previous tile has the same value and wasn't just created by a merge
    if (writeIndex > 0 &&
        newRow[writeIndex - 1] === row[i] &&
        lastMergeIndex !== writeIndex - 1) {
      // Merge with previous tile
      const mergedValue = (newRow[writeIndex - 1] * 2) as TileValue;
      newRow[writeIndex - 1] = mergedValue;
      score += mergedValue;
      merges.push(writeIndex - 1);
      lastMergeIndex = writeIndex - 1;
    } else {
      // Place tile at write position
      newRow[writeIndex] = row[i];
      writeIndex++;
    }
  }

  return { row: newRow, score, merges };
}

/**
 * Moves all tiles left and performs merges
 * Returns the new board, score gained, and whether the board changed
 */
function moveLeft(board: Board): MoveResult {
  const newBoard = cloneBoard(board);
  let totalScore = 0;
  let moved = false;
  const allMerges: Array<{ row: number; col: number; value: TileValue }> = [];

  for (let row = 0; row < board.length; row++) {
    const { row: newRow, score, merges } = slideRowLeft(board[row]);

    // Check if row changed
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] !== newRow[col]) {
        moved = true;
      }
    }

    newBoard[row] = newRow;
    totalScore += score;

    // Record merge positions
    for (const col of merges) {
      allMerges.push({ row, col, value: newRow[col] });
    }
  }

  return { board: newBoard, score: totalScore, moved, merges: allMerges };
}

/**
 * Main move function - handles all four directions
 * Uses rotation to reduce code duplication
 */
export function move(board: Board, direction: Direction): MoveResult {
  let workingBoard = cloneBoard(board);
  let rotations = 0;

  // Rotate board so we can always use "left" logic
  switch (direction) {
    case 'left':
      rotations = 0;
      break;
    case 'up':
      rotations = 1;
      workingBoard = rotateBoard(workingBoard);
      break;
    case 'right':
      rotations = 2;
      workingBoard = rotateBoard(rotateBoard(workingBoard));
      break;
    case 'down':
      rotations = 3;
      workingBoard = rotateCounterClockwise(workingBoard);
      break;
  }

  // Perform the move
  const result = moveLeft(workingBoard);

  // Rotate board back to original orientation
  for (let i = 0; i < (4 - rotations) % 4; i++) {
    result.board = rotateBoard(result.board);
  }

  // Transform merge coordinates back to original orientation
  const size = board.length;
  const transformedMerges = result.merges.map(({ row, col, value }) => {
    let newRow = row;
    let newCol = col;

    // Apply inverse rotations to coordinates
    for (let i = 0; i < (4 - rotations) % 4; i++) {
      const temp = newRow;
      newRow = newCol;
      newCol = size - 1 - temp;
    }

    return { row: newRow, col: newCol, value };
  });

  return { ...result, merges: transformedMerges };
}

/**
 * Validates if a move is legal (i.e., would change the board)
 */
export function isValidMove(board: Board, direction: Direction): boolean {
  const result = move(board, direction);
  return result.moved;
}

/**
 * Gets all valid moves from the current board state
 */
export function getValidMoves(board: Board): Direction[] {
  const directions: Direction[] = ['up', 'down', 'left', 'right'];
  return directions.filter(dir => isValidMove(board, dir));
}
