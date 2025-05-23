import React from "react";
import Tile from "./Tile";
import classes from "./Board.module.css";

interface BoardProps {
  grid: number[][];
}

const Board: React.FC<BoardProps> = ({ grid }) => {
  return (
    <div className={classes.board}>
      {grid.map((row, rowIndex) =>
        row.map((value, colIndex) => (
          <Tile key={`${rowIndex}-${colIndex}`} value={value} />
        ))
      )}
    </div>
  );
};

export default Board;

