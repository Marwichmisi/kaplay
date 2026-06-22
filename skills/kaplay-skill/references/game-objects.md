# Game Objects, Components, and Tags

## Game Objects

The basic unit of KAPLAY. Created with `add()`:

```js
const obj = add([
    rect(32, 32),
    pos(10, 20),
    "shape",
]);
```

### Parent, Children, and Root

Every game object can have children. Children follow parent position, rotation, and scale.

```js
const player = add([rect(32, 32), pos(80, 80)]);
const head = player.add([circle(16), pos(16, -16)]); // relative to player
```

All objects are children of the root. `getTreeRoot()` gets the root (not recommended to modify).

### Game Object Operations

```js
const obj = add([sprite("bag")]);

// Remove
destroy(obj);        // global
obj.destroy();       // method

// Get all with tag
get("friend");       // array of GameObjs
get("*");            // all game objects

// Add/remove children
obj.add([sprite("mini-bag"), scale(0.8)]);
obj.remove(child);

// Get children
obj.get("*");                       // direct children
obj.get("tag", { recursive: true });// include descendants
```

### Dynamic Object Creation

```js
// Factory function pattern
function makeEnemy(x, y) {
    return [sprite("alien"), pos(x, y), area(), "enemy"];
}
const enemy = add(makeEnemy(100, 200));

// Factory with custom logic
function addFriend(spr) {
    const obj = add([pos(rand(0, width()), rand(0, height()))]);
    if (spr) obj.use(sprite(spr));
    else obj.use(circle(16));
    return obj;
}
```

## Components

Components are building blocks. They define behavior, appearance, physics, etc.

```js
const player = add([
    rect(40, 60),
    pos(10, 10),
]);

player.move(100, 0);  // from pos() comp
console.log(player.height); // from rect() comp
```

### Component Operations

```js
loadSprite("bean", "sprites/bean.png");

// Add on creation
const bean = add([sprite("bean"), opacity(0.6)]);

// Add after creation
bean.use(color("#ff00ff"));

// Remove component
bean.unuse("sprite"); // pass the component ID (name), not the component itself

// Check if has component
bean.has("sprite"); // true/false (pass component ID string)
```

### Custom Components

```js
function myComp(data) {
    let internal = data;
    return {
        id: "mycomp",
        require: ["area", "pos"], // required comps
        add() { /* runs when added */ },
        update() { this.move(200, 0); /* runs every frame */ },
        draw() { drawLine(this.pos, mousePos()); },
        destroy() { /* cleanup */ },
        inspect() { return "state for debug view"; },
    };
}
```

**Important:** Don't use arrow functions in component methods - `this` context is lost.

## Tags

Tags group game objects by classification.

```js
const ghosty = add([sprite("ghosty"), "enemy"]);

// Add/remove tags
ghosty.tag("friend");
ghosty.untag("friend");

// Check
ghosty.is("enemy"); // true/false

// Get all tags (read-only)
ghosty.tags; // ["enemy"]
```

**Special tag `*`:** All game objects have the `*` tag. `get("*")` returns everything.

**Components as tags (v4000):** Disabled by default. Enable with `kaplay({ tagComponentIds: true })`. Use `obj.has()` instead of `obj.is()` for component checks.
