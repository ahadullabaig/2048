/**
 * Pure utility functions for board manipulation
 */

import type { Board, BoardSize, TileValue } from './constants';
import { SPAWN_PROBABILITY } from './constants';

/**
 * Creates an empty board filled with zeros
 */
export function createEmptyBoard(size: BoardSize): Board {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => 0 as TileValue)
  );
}

/**
 * Deep clones a board to prevent mutations
 */
export function cloneBoard(board: Board): Board {
  return board.map(row => [...row]);
}

/**
 * Checks if two boards are equal
 */
export function boardsEqual(board1: Board, board2: Board): boolean {
  if (board1.length !== board2.length) return false;

  for (let i = 0; i < board1.length; i++) {
    for (let j = 0; j < board1[i].length; j++) {
      if (board1[i][j] !== board2[i][j]) return false;
    }
  }

  return true;
}

/**
 * Gets all empty cell positions on the board
 */
export function getEmptyCells(board: Board): Array<[number, number]> {
  const emptyCells: Array<[number, number]> = [];

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === 0) {
        emptyCells.push([row, col]);
      }
    }
  }

  return emptyCells;
}

/**
 * Spawns a random tile (2 or 4) at a random empty position
 * Returns a new board with the spawned tile, or the same board if no empty cells
 */
export function spawnRandomTile(board: Board): Board {
  const emptyCells = getEmptyCells(board);

  if (emptyCells.length === 0) {
    return board;
  }

  const newBoard = cloneBoard(board);
  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  // 90% chance of 2, 10% chance of 4
  const value = Math.random() < SPAWN_PROBABILITY[2] ? 2 : 4;
  newBoard[row][col] = value as TileValue;

  return newBoard;
}

/**
 * Rotates the board 90 degrees clockwise
 * Used to reduce code duplication for different move directions
 */
export function rotateBoard(board: Board): Board {
  const size = board.length;
  const rotated = createEmptyBoard(size as BoardSize);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      rotated[col][size - 1 - row] = board[row][col];
    }
  }

  return rotated;
}

/**
 * Rotates the board counter-clockwise (3 clockwise rotations)
 */
export function rotateCounterClockwise(board: Board): Board {
  return rotateBoard(rotateBoard(rotateBoard(board)));
}

/**
 * Checks if the board has any empty cells
 */
export function hasEmptyCells(board: Board): boolean {
  return getEmptyCells(board).length > 0;
}

/**
 * Checks if any adjacent tiles can be merged
 */
export function hasAdjacentMatches(board: Board): boolean {
  const size = board.length;

  // Check horizontal matches
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size - 1; col++) {
      if (board[row][col] !== 0 && board[row][col] === board[row][col + 1]) {
        return true;
      }
    }
  }

  // Check vertical matches
  for (let col = 0; col < size; col++) {
    for (let row = 0; row < size - 1; row++) {
      if (board[row][col] !== 0 && board[row][col] === board[row + 1][col]) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Checks if any valid moves are available
 */
export function hasValidMoves(board: Board): boolean {
  return hasEmptyCells(board) || hasAdjacentMatches(board);
}

/**
 * Checks if the board contains the win tile (2048)
 */
export function hasWinTile(board: Board): boolean {
  for (const row of board) {
    if (row.includes(2048)) {
      return true;
    }
  }
  return false;
}

/**
 * Gets the highest tile value on the board
 */
export function getMaxTile(board: Board): number {
  let max = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell > max) max = cell;
    }
  }
  return max;
}

/**
 * Counts total number of tiles on the board
 */
export function countTiles(board: Board): number {
  let count = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell !== 0) count++;
    }
  }
  return count;
}
