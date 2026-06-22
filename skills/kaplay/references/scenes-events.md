# Scenes and Events

## Scenes

Organize your game into chapters. Create with `scene()`, change with `go()`.

```js
scene("game", () => {
    add([text("Score: 0"), pos(12, 12)]);
});

go("game");
```

### Passing Data Between Scenes

```js
scene("game", (score) => {
    add([text(score), pos(12, 12)]);
});
go("game", 100);

// Multiple params via object
scene("game", ({ score, level }) => { /* ... */ });
go("game", { score: 100, level: 1 });
```

### Preserving Objects on Scene Change

Use `stay()` component to keep objects across scenes:

```js
const menuBtn = add([
    text("Menu"), pos(12, 36), area(),
    stay(), // survives scene switch
]);
```

### Scenes vs Global Code

Code outside scenes runs once and can't be re-run. Always wrap in scenes:

```js
// BAD - can't return to this code
add([sprite("mark")]);
scene("bean", () => { add([sprite("bean")]); });
go("bean"); // can't go back to "mark"

// GOOD
scene("mark", () => { add([sprite("mark")]); });
scene("bean", () => { add([sprite("bean")]); });
go("bean"); // can go("mark") later
```

## Events

Events are things that happen in the game. Event handlers run code when they happen.

### Event Controller

Event handlers return a controller:
```js
const pressEvent = onKeyPress((key) => debug.log(key));
pressEvent.cancel(); // stop running
```

### App Events (global)

Run without needing a game object. Also available as `obj.onEventName()` on objects.

| Event | Handler |
|-------|---------|
| Mouse move | `onMouseMove()` |
| Mouse down | `onMouseDown()` |
| Mouse press | `onMousePress()` |
| Mouse release | `onMouseRelease()` |
| Key press | `onKeyPress()` |
| Key down | `onKeyDown()` |
| Key release | `onKeyRelease()` |
| Char input | `onCharInput()` |
| Touch start | `onTouchStart()` |
| Touch move | `onTouchMove()` |
| Touch end | `onTouchEnd()` |
| Gamepad button | `onGamepadButtonPress()` etc. |
| Gamepad stick | `onGamepadStick()` |
| Scroll | `onScroll()` |
| Tab hide/show | `onHide()` / `onShow()` |
| Resize | `onResize()` |

### Root Events

Run forever, every frame:

```js
onUpdate(() => { bean.moveBy(10, 0); });
onDraw(() => { drawSprite("bean"); });
```

### Tag-Scoped Events

Run for every object with a given tag:

```js
onUpdate("friend", (obj) => {
    debug.log(obj.id);
});
```

### Game Object Events

Lifecycle events on individual objects:

```js
const obj = add([]);
obj.onAdd(() => {});
obj.onDestroy(() => {});
obj.onUpdate(() => {});
obj.onDraw(() => {});
```

### Component-Given Events

Some components provide events:

```js
const kat = add([health(4)]);
kat.onHurt(() => { debug.log("ouch!"); });
kat.onHeal((amount) => {});
kat.onDeath(() => { destroy(kat); });
```

### Generic Event Handler

`on()` for custom or component events on tags:

```js
on("hurt", "friend", (o) => { debug.log(o.id); });

// Object version
kat.on("eat", () => {});
```

### Custom Events

```js
on("eat", "cake", () => { debug.log("Yum!"); });
obj.trigger("eat");
```

### Object Events List

| Event | Component | Global | Object |
|-------|-----------|--------|--------|
| update | - | `onUpdate()` | `obj.onUpdate()` |
| draw | - | `onDraw()` | `obj.onDraw()` |
| add | - | `onAdd()` | `obj.onAdd()` |
| destroy | - | `onDestroy()` | `obj.onDestroy()` |
| collide | area() | `onCollide()` | `obj.onCollide()` |
| collideUpdate | area() | `onCollideUpdate()` | `obj.onCollideUpdate()` |
| collideEnd | area() | `onCollideEnd()` | `obj.onCollideEnd()` |
| hurt | health() | via `on()` | `obj.onHurt()` |
| heal | health() | via `on()` | `obj.onHeal()` |
| death | health() | via `on()` | `obj.onDeath()` |
| ground | body() | via `on()` | `obj.onGround()` |
| fall | body() | via `on()` | `obj.onFall()` |
| land | body() | via `on()` | `obj.onLand()` |
| headbutt | body() | via `on()` | `obj.onHeadbutt()` |
| doubleJump | doubleJump() | via `on()` | `obj.onDoubleJump()` |
| exitView | offscreen() | via `on()` | `obj.onExitScreen()` |
| enterView | offscreen() | via `on()` | `obj.onEnterScreen()` |
| animStart | sprite() | via `on()` | `obj.onAnimStart()` |
| animEnd | sprite() | via `on()` | `obj.onAnimEnd()` |
| targetReached | agent() | via `on()` | `obj.onTargetReached()` |
| patrolFinished | patrol() | via `on()` | `obj.onPatrolFinished()` |
| objectSpotted | sentry() | via `on()` | `obj.onObjectsSpotted()` |
