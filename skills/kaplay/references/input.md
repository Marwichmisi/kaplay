# Input: Keyboard, Mouse, Touch, Gamepad

## Keyboard

```js
onKeyPress("space", () => { bean.jump(); });
onKeyPress(["up", "space"], () => { bean.jump(); });
onKeyPress((key) => { debug.log(key); }); // any key

onKeyDown("right", () => { bean.move(200, 0); });
onKeyRelease("space", () => {});
onKeyPressRepeat("a", () => {}); // repeats while held
```

## Mouse

```js
onMousePress((m) => { debug.log(m); });           // any button
onMousePress("left", () => { cookies++; });       // specific button
onMouseDown(() => {});
onMouseRelease(() => {});
onMouseMove(() => {});
onScroll((delta) => {});

// Click on objects (requires area() component)
onClick("chest", (chest) => chest.open());
```

## Touch

```js
onTouchStart((pos) => {});
onTouchMove((pos) => {});
onTouchEnd(() => {});
```

## Gamepad

```js
onGamepadButtonPress("south", () => {});
onGamepadButtonDown("east", () => {});
onGamepadButtonRelease("north", () => {});
onGamepadStick("left", (value) => {});
onGamepadConnect((gamepad) => {});
onGamepadDisconnect((gamepad) => {});
```

## Buttons API (Input Bindings)

Map multiple inputs to a single action:

```js
kaplay({
    buttons: {
        jump: { keyboard: ["space", "up"], gamepad: "south" },
    },
});

onButtonPress("jump", () => { player.jump(); });
onButtonDown("jump", () => {});
onButtonRelease("jump", () => {});
```

### Boolean Checks
```js
isButtonPressed("jump");  // true this frame
isButtonDown("jump");      // true while held
isButtonReleased("jump");  // true this frame
```

### Dynamic Button Config
```js
getButton("jump").keyboard;  // get current binding
setButton("jump", { keyboard: ["w"] }); // change binding
getButtons(); // all bindings

// Virtual trigger
pressButton("jump");
releaseButton("jump");
```

## Fake Mouse

Use a game object as a cursor (for gamepad/keyboard navigation):

```js
loadSprite("cursor", "cursor.png");
const cursor = add([
    sprite("cursor"),
    fakeMouse({ followMouse: true }),
]);

// Bind press/release to keys
cursor.onKeyPress("f", () => { cursor.press(); });
cursor.onKeyRelease("f", () => { cursor.release(); });

// Move with keys
cursor.onKeyDown("left", () => { cursor.move(-MOUSE_VEL, 0); });
cursor.onKeyDown("right", () => { cursor.move(MOUSE_VEL, 0); });
cursor.onKeyDown("up", () => { cursor.move(0, -MOUSE_VEL); });
cursor.onKeyDown("down", () => { cursor.move(0, MOUSE_VEL); });
```
