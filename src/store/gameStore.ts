/**
 * Zustand game state store
 * Manages game state, logic, and undo history
 */

import { create } from 'zustand';
import type { Board, BoardSize, Direction, GameStatus, TileValue } from '../logic/constants';
import { DEFAULT_BOARD_SIZE, INITIAL_TILES, MAX_UNDO_HISTORY } from '../logic/constants';
import {
  createEmptyBoard,
  spawnRandomTile,
  hasValidMoves,
  hasWinTile,
  cloneBoard,
} from '../logic/boardUtils';
import { move } from '../logic/gameLogic';

/**
 * Represents a snapshot of game state for undo functionality
 */
interface GameSnapshot {
  board: Board;
  score: number;
  moves: number;
}

/**
 * Game state interface
 */
interface GameState {
  // Current game state
  board: Board;
  score: number;
  bestScore: number;
  moves: number;
  gameStatus: GameStatus;
  boardSize: BoardSize;
  hasWon: boolean; // Track if user has achieved 2048 (for "continue playing" feature)

  // Undo history
  history: GameSnapshot[];
  canUndo: boolean;

  // Last merge information (for animations)
  lastMerges: Array<{ row: number; col: number; value: TileValue }>;

  // Actions
  move: (direction: Direction) => boolean;
  undo: () => void;
  newGame: () => void;
  setBoardSize: (size: BoardSize) => void;
  continueAfterWin: () => void;

  // Private helpers
  _initializeBoard: () => void;
  _saveToHistory: () => void;
  _updateGameStatus: () => void;
  _loadBestScore: () => number;
  _saveBestScore: (score: number) => void;
}

/**
 * Initialize a new game board with starting tiles
 */
function initializeBoard(size: BoardSize): Board {
  let board = createEmptyBoard(size);

  // Spawn initial tiles
  for (let i = 0; i < INITIAL_TILES; i++) {
    board = spawnRandomTile(board);
  }

  return board;
}

/**
 * Load best score from localStorage
 */
function loadBestScore(): number {
  try {
    const saved = localStorage.getItem('2048-best-score');
    return saved ? parseInt(saved, 10) : 0;
  } catch {
    return 0;
  }
}

/**
 * Save best score to localStorage
 */
function saveBestScore(score: number): void {
  try {
    localStorage.setItem('2048-best-score', score.toString());
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Create the Zustand store
 */
export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  board: initializeBoard(DEFAULT_BOARD_SIZE),
  score: 0,
  bestScore: loadBestScore(),
  moves: 0,
  gameStatus: 'playing',
  boardSize: DEFAULT_BOARD_SIZE,
  hasWon: false,
  history: [],
  canUndo: false,
  lastMerges: [],

  /**
   * Execute a move in the specified direction
   * Returns true if the move was successful, false otherwise
   */
  move: (direction: Direction) => {
    const state = get();

    // Don't allow moves if game is over (unless continuing after win)
    if (state.gameStatus === 'lost') {
      return false;
    }

    // Save current state to history before moving
    state._saveToHistory();

    // Attempt the move
    const result = move(state.board, direction);

    // If nothing changed, don't update state
    if (!result.moved) {
      // Remove the history entry we just added
      set({ history: state.history.slice(0, -1) });
      return false;
    }

    // Spawn a new tile
    const newBoard = spawnRandomTile(result.board);
    const newScore = state.score + result.score;
    const newMoves = state.moves + 1;

    // Update best score if needed
    const newBestScore = Math.max(state.bestScore, newScore);
    if (newBestScore > state.bestScore) {
      saveBestScore(newBestScore);
    }

    // Update state
    set({
      board: newBoard,
      score: newScore,
      bestScore: newBestScore,
      moves: newMoves,
      lastMerges: result.merges,
      canUndo: true,
    });

    // Check game status after move
    get()._updateGameStatus();

    return true;
  },

  /**
   * Undo the last move
   */
  undo: () => {
    const state = get();

    if (state.history.length === 0) {
      return;
    }

    const previousState = state.history[state.history.length - 1];
    const newHistory = state.history.slice(0, -1);

    set({
      board: previousState.board,
      score: previousState.score,
      moves: previousState.moves,
      history: newHistory,
      canUndo: newHistory.length > 0,
      gameStatus: 'playing', // Reset to playing when undoing
      lastMerges: [],
    });
  },

  /**
   * Start a new game
   */
  newGame: () => {
    const state = get();
    const newBoard = initializeBoard(state.boardSize);

    set({
      board: newBoard,
      score: 0,
      moves: 0,
      gameStatus: 'playing',
      hasWon: false,
      history: [],
      canUndo: false,
      lastMerges: [],
    });
  },

  /**
   * Change board size and start a new game
   */
  setBoardSize: (size: BoardSize) => {
    const newBoard = initializeBoard(size);

    set({
      boardSize: size,
      board: newBoard,
      score: 0,
      moves: 0,
      gameStatus: 'playing',
      hasWon: false,
      history: [],
      canUndo: false,
      lastMerges: [],
    });
  },

  /**
   * Continue playing after winning (reaching 2048)
   */
  continueAfterWin: () => {
    set({ gameStatus: 'playing' });
  },

  /**
   * Save current state to history (for undo)
   */
  _saveToHistory: () => {
    const state = get();

    const snapshot: GameSnapshot = {
      board: cloneBoard(state.board),
      score: state.score,
      moves: state.moves,
    };

    const newHistory = [...state.history, snapshot];

    // Limit history size
    if (newHistory.length > MAX_UNDO_HISTORY) {
      newHistory.shift();
    }

    set({ history: newHistory });
  },

  /**
   * Update game status (check for win/loss)
   */
  _updateGameStatus: () => {
    const state = get();

    // Check for win condition (only trigger once)
    if (!state.hasWon && hasWinTile(state.board)) {
      set({
        gameStatus: 'won',
        hasWon: true,
      });
      return;
    }

    // Check for loss condition
    if (!hasValidMoves(state.board)) {
      set({ gameStatus: 'lost' });
      return;
    }

    // Otherwise, game is still in progress
    set({ gameStatus: 'playing' });
  },

  /**
   * Initialize board helper
   */
  _initializeBoard: () => {
    const state = get();
    const newBoard = initializeBoard(state.boardSize);
    set({ board: newBoard });
  },

  /**
   * Load best score helper
   */
  _loadBestScore: () => {
    return loadBestScore();
  },

  /**
   * Save best score helper
   */
  _saveBestScore: (score: number) => {
    saveBestScore(score);
  },
}));

// Export store hook
export default useGameStore;
