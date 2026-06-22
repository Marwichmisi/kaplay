# Getting Started with KAPLAY

## Installation

### Recommended (create-kaplay)
```bash
npx create-kaplay myGame --version next
cd myGame && npm run dev
```

### Zero Bundlers (CDN)
```html
<html>
  <head><title>My Game</title></head>
  <body>
    <script type="module" src="./main.js"></script>
  </body>
</html>
```
```js
// main.js
import kaplay from "https://unpkg.com/kaplay@4000.0.0-alpha.27.1/dist/kaplay.mjs";
kaplay();
```

### Custom Node.js
```bash
npm install kaplay
npm install esbuild
```
```js
import kaplay from "kaplay";
kaplay();
```
```bash
esbuild game.js --bundle > build.js
```

## Game Initialization

```js
kaplay(); // defaults: fullscreen canvas under <body>

kaplay({
    width: 200,
    height: 200,
    background: "#d46eb3",
    scale: 2,
});
```

## 4 Main Concepts

Think of your game as a **theater**:
- **Scenes** - the acts (menu, game, game over)
- **Game Objects** - the actors (player, enemies, items)
- **Components** - the scripts actors follow (movement, rendering, physics)
- **Events** - what happens during the play (key presses, collisions)

## Basic Knowledge

### JavaScript
The language used to create your game. Runs in a browser.

### Node.js
Executes JavaScript locally for dev tools and build processes.

### Bundler (esbuild, webpack, vite)
Converts your dev code into browser-compatible code. Required for npm-based KAPLAY usage.
