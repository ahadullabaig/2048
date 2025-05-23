# 2048 Game

This is a modern implementation of the classic 2048 game built using **React** and **TypeScript**. The game features smooth tile animations, a clean user interface, and modular code organization. Players combine tiles with the same number to reach the 2048 tile while managing their score.

## Features

- **Smooth Tile Animations**: Tiles slide smoothly to their new positions when moved, enhancing the user experience.
- **Type-Safe Code**: Written in TypeScript for robust type checking and maintainability.
- **Modular Structure**: Components and utilities are organized into separate files for clarity and scalability.
- **Responsive Design**: Styled with CSS modules for scoped, maintainable styles inspired by the original 2048 game.
- **Score Tracking**: Displays the current score as tiles merge.
- **Game Over Detection**: Alerts players when no valid moves remain.

## Project Structure

```
my-2048-game/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Tile.tsx
│   │   ├── Tile.module.css
│   │   ├── Board.tsx
│   │   ├── Board.module.css
│   │   ├── Game.tsx
│   │   └── Game.module.css
│   ├── utils/
│   │   └── gameUtils.ts
│   ├── App.tsx
│   ├── index.tsx
│   ├── index.css
│   └── react-app-env.d.ts
├── README.md
├── package.json
└── tsconfig.json
```

- **`components/`**: Contains React components for the game (`Tile`, `Board`, `Game`) with their respective CSS modules.
- **`utils/gameUtils.ts`**: Handles game logic, including tile movement, merging, and game state management.
- **`App.tsx`**: Entry point for the React application.
- **`index.css`**: Global styles for centering and styling the game.
- **`react-app-env.d.ts`**: TypeScript declarations for CSS modules.

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)

## Setup Instructions

1. **Clone the Repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd my-2048-game
   ```

2. **Install Dependencies**:
   Run the following command to install required packages:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   Launch the app in development mode:
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to play the game.

4. **Build for Production** (optional):
   Create an optimized production build:
   ```bash
   npm run build
   ```

## How to Play

- Use the **arrow keys** (Up, Down, Left, Right) to move tiles on the 4x4 grid.
- Tiles with the same number merge into a single tile with double the value (e.g., two 2s become a 4).
- After each move, a new tile (value 2 or 4) appears in a random empty position.
- The goal is to create a tile with the value **2048**.
- The game ends when no valid moves are possible, displaying a "Game Over" alert.
- Your score increases by the value of merged tiles.

## Development Notes

- **Tile Animations**: Tiles use CSS transitions (`transform: translate`) for smooth sliding effects, with a 200ms animation duration.
- **TypeScript**: Ensures type safety for tile states and game logic, reducing runtime errors.
- **CSS Modules**: Scoped styles prevent naming conflicts and improve maintainability.
- **Game Logic**: The `gameUtils.ts` file manages tile-based state, movement, merging, and game-over conditions.

## Potential Enhancements

- Add a "New Game" button to reset the game state.
- Implement persistent high-score tracking using local storage.
- Enhance animations for tile merging (e.g., scale effects).
- Add touch/swipe support for mobile devices.
- Include a "Win" condition when reaching the 2048 tile.

## Troubleshooting

- **TypeScript Errors with CSS Modules**:
  If you encounter `TS2307: Cannot find module './*.module.css'`, ensure `src/react-app-env.d.ts` contains:
  ```typescript
  declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
  }
  ```
  Then restart the development server (`npm start`).

- **Animation Issues**: If tiles don’t animate smoothly, verify that the `transition` property in `Tile.module.css` is set correctly (`transition: transform 0.2s ease-in-out`).

## Acknowledgments

- Inspired by the original 2048 game by Gabriele Cirulli.
- Built with [Create React App](https://create-react-app.dev/) and TypeScript.
