/**
 * Core game constants and configuration
 */

// Supported board sizes
export const BOARD_SIZES = [3, 4, 5] as const;
export type BoardSize = typeof BOARD_SIZES[number];

// Default board size
export const DEFAULT_BOARD_SIZE: BoardSize = 4;

// Number of tiles to spawn at game start
export const INITIAL_TILES = 2;

// Tile spawn probabilities
export const SPAWN_PROBABILITY = {
  2: 0.9,  // 90% chance
  4: 0.1,  // 10% chance
} as const;

// Win condition
export const WIN_TILE_VALUE = 2048;

// Maximum undo history depth
export const MAX_UNDO_HISTORY = 10;

// Game status types
export type GameStatus = 'playing' | 'won' | 'lost';

// Direction types
export type Direction = 'up' | 'down' | 'left' | 'right';

// Tile value type (0 represents empty cell)
export type TileValue = 0 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | 32768 | 65536;

// Board type (2D grid of tile values)
export type Board = TileValue[][];

// Score multiplier for merges
export const SCORE_MULTIPLIER = 1;

// Animation timing constants (for future use in components)
export const ANIMATION_DURATION = {
  MOVE: 150,      // ms for tile movement
  MERGE: 150,     // ms for merge animation
  SPAWN: 200,     // ms for new tile spawn
  POP: 100,       // ms for merge "pop" effect
} as const;
