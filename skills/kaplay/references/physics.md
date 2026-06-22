# Physics and Collisions

## Area Component

Defines collision shape. Required for collision detection.

```js
// Auto-detect shape from render component
const player = add([
    sprite("bean"),
    area(),
]);

// Custom shape
area({ shape: new Circle(vec2(0), 16) });
area({ collisionIgnore: ["bullet"] });

// Collision events
player.onCollide("tree", (tree, col) => { destroy(player); });
player.onCollideUpdate("tree", (tree, col) => {});
player.onCollideEnd("tree", (tree) => {});

// Manual checks
player.isColliding(bomb); // boolean
player.isOverlaping(zone); // boolean (not physics-based overlap)
player.checkCollisions(); // array of current collisions
```

### Global Collision Events
```js
onCollide("sun", "earth", () => { addExplosion(); });
onCollideUpdate("bullet", "enemy", (bullet, enemy) => {});
onCollideEnd("bullet", "enemy", () => {});
```

## Body Component

Makes object solid and affected by gravity. Requires `area()` and `pos()`.

```js
const bean = add([
    sprite("bean"), pos(), area(), body(),
]);

// Check state
bean.isGrounded();
bean.isFalling();

// Jump
bean.jump();
bean.jump(200); // with custom force

// Static body (not affected by gravity - like platforms)
add([pos(80, 400), rect(250, 20), area(), body({ isStatic: true })]);

// Body events
bean.onGround(() => {});
bean.onFall(() => {});
bean.onFallOff(() => {});
bean.onLand(() => {});
bean.onHeadbutt(() => {});

// Physics events
bean.onBeforePhysicsResolve((col) => {});
bean.onPhysicsResolve((col) => {});

// Gravity direction
setGravityDirection(vec2(0, -1)); // inverse gravity
```

### Impulses and Forces
```js
obj.applyImpulse(vec2(100, 0));   // sudden velocity change (px/s)
obj.addForce(vec2(100, 0));        // force for one physics frame (kg*px/s^2)

obj.vel; // current velocity
obj.mass; // mass (affects collision response)
```

### Gravity

**Recommended** — set gravity in `kaplay()` options:
```js
kaplay({
    gravity: 980,         // pixels/s^2 (default ~980)
});
```

**Alternative** — `setGravity()` still works in v4000 but the option above is preferred:
```js
setGravity(1600);
setGravityDirection(vec2(0, -1)); // inverse gravity
```

### Physics Config
```js
kaplay({
    gravity: 980,
    fixedUpdateMode: "normal", // 50Hz: "friedPotato"=10, "potato"=20, "snail"=25, "normal"=50, "lightspeed"=80
});
```

## Effectors

Apply forces to objects passing through their area.

### AreaEffector (directional force like wind)
```js
add([pos(20, 150), rect(50, 300), area(),
    areaEffector({ forceAngle: -90, forceMagnitude: 150 }),
]);
```

### SurfaceEffector (tangential force like conveyor belt)
```js
add([pos(100, 300), rect(200, 20), area(), body({ isStatic: true }),
    surfaceEffector({ speed: 20 }),
]);
```

### PointEffector (force toward/away from a point)
```js
add([pos(85, 50), rect(90, 90), anchor("center"), area(),
    pointEffector({ forceMagnitude: 300 }),
]);
```

### BuoyancyEffector (fluid/water)
```js
add([pos(400, 200), rect(200, 100), color(BLUE), opacity(0.5), area(),
    buoyancyEffector({ surfaceLevel: 200, density: 6 }),
]);
```

### PlatformEffector (one-way platforms)
```js
add([pos(100, 100), rect(100, 100), area(), body(), platformEffector()]);

// Ignore specific sides
platformEffector({ ignoreSides: [UP, LEFT, RIGHT] });

// Custom collision logic
platformEffector({
    shouldCollide(obj, normal) {
        if (obj !== player) return true;
        if (isKeyDown("shift")) return true;
        if (normal.eq(LEFT) || normal.eq(RIGHT)) return false;
        return true;
    }
});

// Temporarily ignore platform
onKeyDown("down", () => {
    const p = player.curPlatform();
    if (p && p.is("platformEffector")) {
        p.platformIgnore.add(player);
    }
});
```

### ConstantForce (constant acceleration)
```js
add([pos(80, 80), body(), constantForce({ force: vec2(0, -100) })]);
```

## Double Jump
```js
add([body(), doubleJump()]);  // allows double jump
add([body(), doubleJump(2)]); // triple jump, etc.

obj.onDoubleJump(() => {});
```

## Collision Resolution Config
```js
kaplay({
    broadPhaseCollisionAlgorithm: "sap",   // "sap", "sapv", "quadtree"
    narrowPhaseCollisionAlgorithm: "gjk",  // "gjk", "sat", "box"
});
```
