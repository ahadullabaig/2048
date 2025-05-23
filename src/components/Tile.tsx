import React from "react";
import classes from "./Tile.module.css";

interface TileProps {
  value: number;
}

const Tile: React.FC<TileProps> = ({ value }) => {
  const tileClass = value === 0 ? classes.empty : classes[`tile-${value}`];
  return (
    <div className={`${classes.tile} ${tileClass}`}>
      {value !== 0 ? value : ""}
    </div>
  );
};

export default Tile;

