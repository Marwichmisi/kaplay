# Rendering: Sprites, Text, Shapes, Audio

## Sprites

### Loading Sprites
```js
loadSprite("bean", "sprites/bean.png");

// Spritesheet with animations
loadSprite("player", "sprites/player.png", {
    sliceX: 2,
    sliceY: 2,
    anims: {
        crack: { from: 0, to: 3, loop: false },
        idle: { from: 0, to: 0 },
    },
});
```

### Using Sprites
```js
const bean = add([sprite("bean"), pos(100, 100)]);

// With options
const bean = add([
    sprite("bean", {
        frame: 1,
        flipX: true,
        anim: "crack",
    }),
    pos(100, 100),
]);

// Play animations
player.play("crack");
player.stop();
player.frame = 3; // manual frame
```

### Built-in Sprites
```js
loadBean(); // loads default "bean" sprite
loadHappy(); // loads "happy" font sprite
```

### Sprite Atlas
```js
loadSpriteAtlas("sprites/dungeon.png", {
    hero: {
        x: 128, y: 68, width: 144, height: 28,
        sliceX: 9,
        anims: { idle: { from: 0, to: 3 }, run: { from: 4, to: 7 } },
    },
});
const player = add([sprite("hero")]);
```

## Text
```js
const score = add([
    text("Score: 0"),
    pos(24, 24),
    { value: 0 },
]);

// With options
add([
    text("ohhi", {
        size: 48,
        width: 320,     // word wrap width
        font: "sans-serif",
    }),
]);
```

## Shapes

```js
// Rectangle
add([pos(80, 120), rect(20, 40), outline(4), area()]);

// Circle
add([pos(80, 120), circle(16)]);

// Ellipse
add([ellipse(30, 20)]);

// Polygon
add([polygon([vec2(0), vec2(100), vec2(50, 100)])]);
```

## Color

```js
color(0, 0, 255);           // RGB 0-255
color("#0000ff");           // hex string
color(0x0000ff);            // hex literal
color("red");               // CSS color keyword
color(rgb(0, 0, 255));      // Color object
color([0, 0, 255]);         // array
color();                    // white (no effect)
```

## Transform Components

```js
pos(x, y);            // position
scale(x, y);          // scale (3 = 3x)
rotate(angle);        // rotation in degrees
skew(x, y);           // skew
z(value);            // draw order (higher = on top)
anchor("center");     // anchor point: "topleft", "center", "botright", etc.
opacity(value);       // 0-1
outline(width, color);// outline/border
```

## Audio

### Loading Sounds
```js
loadSound("soundName", "/path/to/sound.mp3");
loadSound("shoot", "/sounds/horse.ogg");
loadSound("shoot", "/sounds/squeeze.mp3");
```

### Playing Sounds
```js
// One-off sound
play("wooosh");

// With options
const music = play("OverworldlyFoe", {
    volume: 0.8,
    speed: 1.2,
    loop: true,
});

// Control
music.pause();
music.paused = true;
music.speed = 1.5;
```

### Loading Fonts
```js
loadFont("frogblock", "fonts/frogblock.ttf");
loadBitmapFont("happy-o", "./assets/happy-o.png", 31, 39);
```

## Asset Loading Utilities
```js
loadRoot("https://myassets.com/"); // base path for all URLs
loadRoot("./"); // for Itch.io relative paths

loadSprite("bean", "sprites/bean.png");
// resolves to "./sprites/bean.png"
```

## Drawing API (onDraw)
For rendering without creating game objects (optimization):
```js
onDraw(() => {
    drawSprite({ sprite: "bean", pos: vec2(100, 200) });
    drawRect({ width: 100, height: 50, pos: vec2(50, 50) });
    drawCircle({ radius: 30, pos: mousePos() });
    drawText({ text: "Hello", pos: vec2(10, 10), size: 24 });
});
```
