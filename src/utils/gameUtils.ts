export type Grid = number[][];

export function moveLeft(row: number[]): { newRow: number[]; scoreIncrement: number } {
  let newRow = row.filter((val) => val !== 0);
  let scoreIncrement = 0;
  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      scoreIncrement += newRow[i];
      newRow[i + 1] = 0;
      i++;
    }
  }
  newRow = newRow.filter((val) => val !== 0);
  while (newRow.length < 4) {
    newRow.push(0);
  }
  return { newRow, scoreIncrement };
}

export function transpose(grid: Grid): Grid {
  return grid[0].map((_, colIndex) => grid.map((row) => row[colIndex]));
}

export function moveGrid(
  direction: "left" | "right" | "up" | "down",
  grid: Grid
): { newGrid: Grid; scoreIncrement: number } {
  let transformedGrid: Grid;
  let transformBack: (grid: Grid) => Grid;
  switch (direction) {
    case "left":
      transformedGrid = grid;
      transformBack = (g) => g;
      break;
    case "right":
      transformedGrid = grid.map((row) => [...row].reverse());
      transformBack = (g) => g.map((row) => [...row].reverse());
      break;
    case "up":
      transformedGrid = transpose(grid);
      transformBack = transpose;
      break;
    case "down":
      const transposed = transpose(grid);
      transformedGrid = transposed.map((row) => [...row].reverse());
      transformBack = (g) => transpose(g.map((row) => [...row].reverse()));
      break;
  }
  let newTransformedGrid: number[][] = [];
  let totalScoreIncrement = 0;
  for (const row of transformedGrid) {
    const { newRow, scoreIncrement } = moveLeft(row);
    newTransformedGrid.push(newRow);
    totalScoreIncrement += scoreIncrement;
  }
  const newGrid = transformBack(newTransformedGrid);
  return { newGrid, scoreIncrement: totalScoreIncrement };
}

export function addRandomTile(grid: Grid): Grid {
  const emptyPositions: [number, number][] = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        emptyPositions.push([i, j]);
      }
    }
  }
  if (emptyPositions.length === 0) return grid;
  const [row, col] =
    emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  const newGrid = grid.map((row) => [...row]);
  newGrid[row][col] = 2; // Could be 2 or 4, using 2 for simplicity
  return newGrid;
}

export function gridsAreEqual(grid1: Grid, grid2: Grid): boolean {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid1[i][j] !== grid2[i][j]) return false;
    }
  }
  return true;
}

export function isGameOver(grid: Grid): boolean {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) return false;
    }
  }
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i][j] === grid[i][j + 1]) return false;
    }
  }
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 3; i++) {
      if (grid[i][j] === grid[i + 1][j]) return false;
    }
  }
  return true;
}

export function initializeGrid(): Grid {
  let grid: Grid = Array(4)
    .fill(null)
    .map(() => Array(4).fill(0));
  grid = addRandomTile(grid);
  grid = addRandomTile(grid);
  return grid;
}

