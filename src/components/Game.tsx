import React, { useState, useEffect } from "react";
import Board from "./Board";
import {
  Grid,
  initializeGrid,
  moveGrid,
  addRandomTile,
  gridsAreEqual,
  isGameOver,
} from "../utils/gameUtils";
import classes from "./Game.module.css";

const Game: React.FC = () => {
  const [grid, setGrid] = useState<Grid>(initializeGrid());
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const directionMap: { [key: string]: "left" | "right" | "up" | "down" } = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down",
      };
      const direction = directionMap[event.key];
      if (direction) {
        event.preventDefault();
        const { newGrid, scoreIncrement } = moveGrid(direction, grid);
        if (!gridsAreEqual(grid, newGrid)) {
          const updatedGrid = addRandomTile(newGrid);
          setGrid(updatedGrid);
          setScore(score + scoreIncrement);
          if (isGameOver(updatedGrid)) {
            alert("Game Over");
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [grid, score]);

  return (
    <div className={classes.game}>
      <h1>2048</h1>
      <p>Score: {score}</p>
      <Board grid={grid} />
    </div>
  );
};

export default Game;

