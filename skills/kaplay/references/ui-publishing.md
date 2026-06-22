# UI, Pausing, Debug, and Publishing

## Fixed UI Elements

Make UI elements unaffected by camera:

```js
const score = add([
    text("Score: 0"),
    pos(12, 12),
    fixed(), // ignores camera transform, renders last
    z(9999), // always on top
]);
```

## Pausing

### Pause Game Objects

```js
obj.paused = true;
// onUpdate() stops, children also pause
// obj.hidden = true to also hide
```

### Pause Structure

Create a parent container for pausable objects:

```js
const game = add(); // empty parent
const player = game.add([sprite("bean"), ...]); // pausable
const pauseMenu = add([text("Pause"), ...]); // NOT pausable

onKeyPress("p", () => { game.paused = !game.paused; });
```

### Safe Unpause (avoid same-frame clicks)

```js
pauseBtn.onClick(() => {
    const wasPaused = game.paused;
    if (!wasPaused) game.paused = true; // instant pause
    else wait(0, () => { game.paused = false; }); // delayed unpause
});
```

### Pause Levels

```js
level.paused = true;

// Or with level component inside game group
const game = add();
const levelObj = game.add([level(map, opt)]);
game.paused = true; // pauses everything including level
```

## Debug Mode

Toggle with F1. Shows FPS, object areas (blue), anchor points (red), component properties.

```js
debug.log("Hello!"); // log to game screen
// F2 clears log

// Customize debug key
kaplay({ debugKey: "r" });

// Disable for production
kaplay({ debug: false });
```

### Time Control

- F7: decrease time speed
- F8: pause/unpause game time
- F9: increase time speed

## Prefabs

Define once, instantiate many times with customization:

```js
createPrefab("hexagon", obj); // serialize object

const instance = addPrefab("hexagon", [pos(200, 200), color(BLUE)]);
```

Prefabs can be serialized to/loaded from files for team collaboration.

## Publishing

### Prepare Your Game

```
game/
├── public/
│   ├── sprites/
│   ├── sounds/
│   ├── index.html
│   └── game.js
```

### Asset Paths

Use relative paths for web portals:

```js
loadRoot("."); // prepend "./" to all asset URLs
loadSprite("bean", "sprites/bean.png"); // -> ./sprites/bean.png

// Or
loadRoot("./");
loadSprite("bean", "sprites/bean.png"); // -> ./sprites/bean.png
```

### Itch.io

1. Upload new project
2. Select **HTML** as kind
3. Upload zip with your files (public/ folder contents)

### Newgrounds.com

1. Click up arrow, select Game
2. Upload zip with index.html
3. Tag with `kaplayjs` and `kaplay`

### Build for Production

```bash
# If using create-kaplay
npm run build
# Output in dist/ folder - ready to upload
```

## Crew Plugin (KAPLAY Assets)

```bash
npm i @kaplayjs/crew
```

```js
import { crew } from "@kaplayjs/crew";
import kaplay from "kaplay";

kaplay({ plugins: [crew] });

loadCrew("sprite", "bean"); // load crew sprites
loadCrew("sound", "bean_voice");
loadCrew("font", "happy");
```

## Multiplayer with Colyseus

Use the [official quickstart](https://github.com/colyseus/kaplay) for Colyseus + KAPLAY:

```bash
git clone https://github.com/colyseus/kaplay.git kaplay-colyseus
```

Two folders: `client/` (KAPLAY game) and `server/` (Colyseus server).
- Room state syncs automatically via schemas
- Messages sent via `room.send()` and `room.onMessage()`
- Deploy Colyseus server separately from client
